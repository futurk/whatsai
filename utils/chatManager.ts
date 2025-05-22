import { OpenAIClient } from './api/openai';
import { AnthropicClient } from './api/anthropic';
import { APIError, getPrettyErrorMessage } from './api/types';
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
  private vendor: Vendor;

  constructor(
    private readonly agent: Agent,
    apiKeys: ApiKey[],
    private readonly onLog?: (log: LogEntry) => void
  ) {
    const apiKey = apiKeys.find(key => key.id === agent.apiKeyId);
    if (!apiKey) {
      throw new Error(`No API key found for agent: ${agent.name}`);
    }

    this.vendor = apiKey.vendor;
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

  async sendMessage(messages: Array<{ role: string; content: any }>, imageUrl?: string) {
    try {
      const requestPayload = {
        messages,
        model: this.agent.model,
        temperature: this.agent.temperature,
        maxTokens: this.agent.maxTokens
      };

      this.log('request', requestPayload);

      const response = await this.client.chat(
        messages,
        this.agent.model,
        this.agent.temperature,
        this.agent.maxTokens
      );
      
      this.log('response', response);

      return response.choices?.[0]?.message?.content || response;
    } catch (error) {
      const userMessage = error instanceof APIError
        ? getPrettyErrorMessage(error, this.vendor)
        : 'An unexpected error occurred. Please try again later.';
      
      this.log('error', {
        error: userMessage,
        originalError: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      throw new Error(userMessage);
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }
}