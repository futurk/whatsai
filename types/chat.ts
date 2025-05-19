export type MessageStatus = 'pending' | 'completed' | 'failed';
export type MessageSender = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: string;
  status?: MessageStatus; // For user messages
  type?: 'error';        // For system messages
}

export interface Conversation {
  id: string;
  agentId: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}