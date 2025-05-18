import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { Conversation, Message } from '@/types/chat';
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

const getErrorMessage = (error: Error): string => {
  const errorType = error.message.split(':')[0];
  
  switch (errorType) {
    case 'INVALID_API_KEY':
      return 'Invalid API key. Please check your API key in settings and ensure it is correct.';
    case 'RATE_LIMIT_EXCEEDED':
      return 'Rate limit exceeded. Please wait a moment before sending another message.';
    case 'QUOTA_EXCEEDED':
      return 'API quota exceeded. Please check your OpenAI account billing status.';
    case 'MODEL_NOT_FOUND':
      return 'The selected AI model is not available. Please choose a different model in settings.';
    case 'SERVICE_UNAVAILABLE':
      return 'OpenAI service is temporarily unavailable. Please try again later.';
    case 'INVALID_RESPONSE':
      return 'Received an invalid response from OpenAI. Please try again.';
    case 'NETWORK_ERROR':
      return 'Network error occurred. Please check your internet connection and try again.';
    case 'API_ERROR':
      return `OpenAI API error: ${error.message.split(':')[1]?.trim() || 'Unknown error occurred'}`;
    default:
      return 'An unexpected error occurred. Please try again later.';
  }
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
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

    const now = new Date().toISOString();
    const newConversation: Conversation = {
      id: Date.now().toString(),
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
              [newConversation.id]: [...(prev[newConversation.id] || []), log],
            }));
          } : undefined
        )
      );
    }
    
    return newConversation.id;
  }, [getAgentById, apiKeys, isDebugMode]);

  const deleteConversations = useCallback((ids: string[]) => {
    setConversations(prev => prev.filter(conv => !ids.includes(conv.id)));
    setDebugLogs(prev => {
      const newLogs = { ...prev };
      ids.forEach(id => delete newLogs[id]);
      return newLogs;
    });
  }, []);

  const addMessageToConversation = useCallback(async (conversationId: string, message: Message) => {
    const conversation = getConversationById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

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

    if (message.sender === 'user') {
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

        const messages = conversation.messages.map(msg => ({
          role: msg.sender as 'user' | 'assistant',
          content: msg.text
        }));

        if (agent.instructions) {
          messages.unshift({
            role: 'system',
            content: agent.instructions
          });
        }

        messages.push({
          role: 'user',
          content: message.text
        });

        const response = await chatManager.sendMessage(agent.id, messages);

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
        console.error('Failed to get agent response:', error);
        
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: error instanceof Error ? getErrorMessage(error) : 'An unexpected error occurred. Please try again later.',
          sender: 'assistant',
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
    }
  }, [getConversationById, getAgentById, apiKeys, isDebugMode]);

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
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};