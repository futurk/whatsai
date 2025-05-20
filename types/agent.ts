export interface Agent {
  id: string;
  name: string;
  instructions?: string;
  model: string;
  apiKeyId: string;
  color: string;
  tags: string[];
  temperature?: number;
  maxTokens?: number;
}