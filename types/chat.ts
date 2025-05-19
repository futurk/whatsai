export type MessageStatus = 'pending' | 'completed' | 'failed';
export type MessageSender = 'user' | 'assistant' | 'system';
export type MessageType = 'text' | 'image';

export interface Message {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: string;
  status?: MessageStatus;
  type?: 'error' | MessageType;
  imageUrl?: string;
}

export interface Conversation {
  id: string;
  agentId: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}