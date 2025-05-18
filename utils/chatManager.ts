import { OpenAIClient } from './api/openai';
import { AnthropicClient } from './api/anthropic';
import { Agent } from '@/types/agent';
import { ApiKey, Vendor } from '@/types/apiKey';

export interface LogEntry {
  timestamp: string;
  type: 'request' | 'response' | 'error';
  data: any;
}

export class ChatManager {
  private client: OpenAIClient | AnthropicClient;
  private logs: LogEntry[] = [];

  constructor(
    private readonly agent: Agent,
    apiKeys: ApiKey[],
    private readonly onLog?: (log: LogEntry) => void
  ) {
    const apiKey = apiKeys.find(key => key.id === agent.apiKeyId);
    if (!apiKey) {
      throw new Error(`No API key found for agent: ${agent.name}`);
    }

    this.client = this.createClient(apiKey);
  }

  private createClient(apiKey: ApiKey) {
    switch (apiKey.vendor.toLowerCase() as Lowercase<Vendor>) {
      case 'openai':
        return new OpenAIClient(apiKey.key);
      case 'anthropic':
        return new AnthropicClient(apiKey.key);
      default:
        throw new Error(`Unsupported vendor: ${apiKey.vendor}`);
    }
  }

  private log(type: LogEntry['type'], data: any) {
    const log: LogEntry = {
      timestamp: new Date().toISOString(),
      type,
      data,
    };
    this.logs.push(log);
    this.onLog?.(log);
  }

  async sendMessage(messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>) {
    try {
      this.log('request', { messages, model: this.agent.model });

      const response = await this.client.chat(messages, this.agent.model);

      this.log('response', { response });
      return response;
    } catch (error) {
      this.log('error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }
}