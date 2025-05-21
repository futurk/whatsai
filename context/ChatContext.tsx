import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { Conversation, Message, MessageStatus } from '@/types/chat';
import { useAgentContext } from './AgentContext';
import { useApiKeyContext } from './ApiKeyContext';
import { ChatManager, LogEntry } from '@/utils/chatManager';
import { useDebugContext } from './DebugContext';

interface ChatContextType {
  conversations: Conversation[];
  getConversationById: (id: string) => Conversation | undefined;
  startNewConversation: (agentId: string) => string;
  addMessageToConversation: (conversationId: string, message: Message) => Promise<void>;
  deleteConversations: (ids: string[]) => void;
  isTyping: boolean;
  debugLogs: Record<string, LogEntry[]>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [debugLogs, setDebugLogs] = useState<Record<string, LogEntry[]>>({});
  const { getAgentById } = useAgentContext();
  const { apiKeys } = useApiKeyContext();
  const { isDebugMode } = useDebugContext();
  const chatManagers = new Map<string, ChatManager>();

  const getConversationById = useCallback((id: string) => {
    return conversations.find(conversation => conversation.id === id);
  }, [conversations]);

  const startNewConversation = useCallback((agentId: string) => {
    const agent = getAgentById(agentId);
    if (!agent) {
      throw new Error('Agent not found');
    }

    const id = Date.now().toString();
    const now = new Date().toISOString();
    
    const newConversation: Conversation = {
      id,
      agentId,
      title: 'New Conversation',
      messages: [],
      createdAt: now,
      updatedAt: now
    };
    
    setConversations(prev => [newConversation, ...prev]);
    
    if (!chatManagers.has(agentId)) {
      chatManagers.set(
        agentId,
        new ChatManager(
          agent,
          apiKeys,
          isDebugMode ? (log) => {
            setDebugLogs(prev => ({
              ...prev,
              [id]: [...(prev[id] || []), log],
            }));
          } : undefined
        )
      );
    }
    
    return id;
  }, [getAgentById, apiKeys, isDebugMode]);

  const deleteConversations = useCallback((ids: string[]) => {
    setConversations(prev => prev.filter(conv => !ids.includes(conv.id)));
    setDebugLogs(prev => {
      const newLogs = { ...prev };
      ids.forEach(id => delete newLogs[id]);
      return newLogs;
    });
  }, []);

  const updateMessageStatus = useCallback((
    conversationId: string, 
    messageId: string, 
    status: MessageStatus
  ) => {
    setConversations(prev =>const mess
      prev.map(conv =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: conv.messages.map(msg =>
                msg.id === messageId
                  ? { ...msg, status }
                  : msg
              )
            }
          : conv
      )
    );
  }, []);

  const addMessageToConversation = useCallback(async (conversationId: string, message: Message) => {
    const conversation = getConversationById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    if (message.sender === 'user') {
      // Add user message with pending status
      const userMessage = { ...message, status: 'pending' as MessageStatus };
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: [...conv.messages, userMessage],
                updatedAt: new Date().toISOString()
              }
            : conv
        )
      );

      setIsTyping(true);
      try {
        const agent = getAgentById(conversation.agentId);
        if (!agent) {
          throw new Error('Agent not found');
        }

        let chatManager = chatManagers.get(agent.id);
        if (!chatManager) {
          chatManager = new ChatManager(
            agent,
            apiKeys,
            isDebugMode ? (log) => {
              setDebugLogs(prev => ({
                ...prev,
                [conversationId]: [...(prev[conversationId] || []), log],
              }));
            } : undefined
          );
          chatManagers.set(agent.id, chatManager);
        }

        // Only filter out system error messages and failed user messages
        // Keep all other messages including image messages
        const validMessages = conversation.messages.filter(msg => 
          !(msg.sender === 'system' && msg.type === 'error') &&
          !(msg.sender === 'user' && msg.status === 'failed')
        );

        const messages = [
          ...(agent.instructions ? [{
            role: 'system' as const,
            content: agent.instructions
          }] : []),
          ...validMessages.map(msg => ({
            role: msg.sender as 'user' | 'assistant',
            content: msg.text
          })),
          {
            role: 'user' as const,
            content: message.text
          }
        ];

        const response = await chatManager.sendMessage(
          messages,
          message.type === 'image' ? message.imageUrl : undefined
        );

        // Update user message status to completed
        updateMessageStatus(conversationId, message.id, 'completed');

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response,
          sender: 'assistant',
          timestamp: new Date().toISOString()
        };

        setConversations(prev =>
          prev.map(conv =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, assistantMessage],
                  updatedAt: new Date().toISOString()
                }
              : conv
          )
        );
      } catch (error) {
        // Update user message status to failed
        updateMessageStatus(conversationId, message.id, 'failed');

        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Sorry, I encountered an error while processing your message. Please try again.',
          sender: 'system',
          type: 'error',
          timestamp: new Date().toISOString()
        };

        setConversations(prev =>
          prev.map(conv =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, errorMessage],
                  updatedAt: new Date().toISOString()
                }
              : conv
          )
        );
      } finally {
        setIsTyping(false);
      }
    } else {
      // For non-user messages (system, assistant), add directly
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: [...conv.messages, message],
                updatedAt: new Date().toISOString()
              }
            : conv
        )
      );
    }
  }, [getConversationById, getAgentById, apiKeys, isDebugMode, updateMessageStatus]);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        getConversationById,
        startNewConversation,
        addMessageToConversation,
        deleteConversations,
        isTyping,
        debugLogs,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}