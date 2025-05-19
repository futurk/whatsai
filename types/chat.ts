export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: string;
}

export interface Conversation {
  id: string;
  agentId: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}