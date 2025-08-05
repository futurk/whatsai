import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import React from 'react';
import { Conversation, Message, MessageStatus } from '@/types/chat';
import { supabase } from '@/lib/supabase';
import { useAgentContext } from './AgentContext';
import { useApiKeyContext } from './ApiKeyContext';
import { useAuth } from './AuthContext';
import { ChatManager, LogEntry } from '@/utils/chatManager';
import { useDebugContext } from './DebugContext';
import { soundManager } from '@/utils/sound';

interface ChatContextType {
  conversations: Conversation[];
  loading: boolean;
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
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [debugLogs, setDebugLogs] = useState<Record<string, LogEntry[]>>({});
  const { getAgentById } = useAgentContext();
  const { apiKeys } = useApiKeyContext();
  const { user } = useAuth();
  const { isDebugMode } = useDebugContext();
  const chatManagers = new Map<string, ChatManager>();

  // Load conversations when user changes
  React.useEffect(() => {
    if (user && !user.isGuest) {
      loadConversations();
    } else {
      // For guests, start with empty conversations
      setConversations([]);
    }
  }, [user]);

  const loadConversations = async () => {
    if (!user || user.isGuest) return;

    try {
      setLoading(true);
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select(`
          *,
          messages (*)
        `)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (conversationsError) throw conversationsError;

      const formattedConversations: Conversation[] = conversationsData.map(conv => ({
        id: conv.id,
        agentId: conv.agent_id,
        title: conv.title,
        messages: conv.messages
          .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
          .map(msg => ({
            id: msg.id,
            text: msg.text,
            sender: msg.sender as 'user' | 'assistant' | 'system',
            type: msg.type as 'text' | 'image' | 'error',
            status: msg.status as MessageStatus,
            imageUrl: msg.image_url,
            timestamp: msg.created_at,
          })),
        createdAt: conv.created_at,
        updatedAt: conv.updated_at,
      }));

      setConversations(formattedConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

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
    
    // Create conversation in database if user is authenticated
    if (user && !user.isGuest) {
      createConversationInDB(newConversation);
    }
    
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
  }, [getAgentById, apiKeys, isDebugMode, user]);

  const createConversationInDB = async (conversation: Conversation) => {
    if (!user || user.isGuest) return;

    try {
      const { error } = await supabase
        .from('conversations')
        .insert({
          id: conversation.id,
          user_id: user.id,
          agent_id: conversation.agentId,
          title: conversation.title,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error creating conversation in DB:', error);
    }
  };

  const deleteConversations = useCallback(async (ids: string[]) => {
    setConversations(prev => prev.filter(conv => !ids.includes(conv.id)));
    setDebugLogs(prev => {
      const newLogs = { ...prev };
      ids.forEach(id => delete newLogs[id]);
      return newLogs;
    });

    // Delete from database if user is authenticated
    if (user && !user.isGuest) {
      try {
        const { error } = await supabase
          .from('conversations')
          .delete()
          .in('id', ids)
          .eq('user_id', user.id);

        if (error) throw error;
      } catch (error) {
        console.error('Error deleting conversations from DB:', error);
      }
    }
  }, [user]);

  const updateMessageStatus = useCallback((
    conversationId: string, 
    messageId: string, 
    status: MessageStatus,
    errorMessage?: string
  ) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: conv.messages.map(msg =>
                msg.id === messageId
                  ? { ...msg, status, errorMessage }
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

      // Save user message to database if authenticated
      if (user && !user.isGuest) {
        saveMessageToDB(conversationId, userMessage);
      }

      // Play message sent tone
      soundManager.playMessageTone();

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

        const validMessages = conversation.messages.filter(msg => 
          !(msg.sender === 'system' && msg.type === 'error') &&
          !(msg.sender === 'user' && msg.status === 'failed')
        );

        const formatMessageContent = (msg: Message) => {
          if (msg.type === 'image' && msg.imageUrl) {
            return [
              {
                type: 'text',
                text: msg.text
              },
              {
                type: 'image_url',
                image_url: {
                  url: msg.imageUrl
                }
              }
            ];
          }
          return msg.text;
        };

        const messages = [
          ...(agent.instructions ? [{
            role: 'system' as const,
            content: agent.instructions
          }] : []),
          ...validMessages.map(msg => ({
            role: msg.sender as 'user' | 'assistant',
            content: formatMessageContent(msg)
          })),
          {
            role: 'user' as const,
            content: formatMessageContent(message)
          }
        ];

        const response = await chatManager.sendMessage(messages);

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

        // Save assistant message to database if authenticated
        if (user && !user.isGuest) {
          saveMessageToDB(conversationId, assistantMessage);
        }

        // Play notification tone for assistant's response
        soundManager.playNotificationTone();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        updateMessageStatus(conversationId, message.id, 'failed', errorMessage);

        const errorSystemMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: errorMessage,
          sender: 'system',
          type: 'error',
          timestamp: new Date().toISOString()
        };

        setConversations(prev =>
          prev.map(conv =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, errorSystemMessage],
                  updatedAt: new Date().toISOString()
                }
              : conv
          )
        );

        // Save error message to database if authenticated
        if (user && !user.isGuest) {
          saveMessageToDB(conversationId, errorSystemMessage);
        }
      } finally {
        setIsTyping(false);
      }
    } else {
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
  }, [getConversationById, getAgentById, apiKeys, isDebugMode, updateMessageStatus, user]);

  const saveMessageToDB = async (conversationId: string, message: Message) => {
    if (!user || user.isGuest) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          id: message.id,
          conversation_id: conversationId,
          text: message.text,
          sender: message.sender,
          type: message.type || 'text',
          status: message.status,
          image_url: message.imageUrl,
        });

      if (error) throw error;

      // Update conversation updated_at timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId)
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Error saving message to DB:', error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        loading,
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