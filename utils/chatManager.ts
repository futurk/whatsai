import { OpenAIClient } from './api/openai';
import { AnthropicClient } from './api/anthropic';
import { APIError } from './api/types';
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

  private getUserFriendlyErrorMessage(error: APIError): string {
    switch (error.type) {
      case 'AUTHENTICATION':
        return 'Your API key appears to be invalid. Please check your settings and update your API key.';
      case 'RATE_LIMIT':
        return 'You\'ve hit the rate limit. Please wait a moment before sending another message.';
      case 'PERMISSION_DENIED':
        return 'You don\'t have permission to use this feature. Please check your API key permissions.';
      case 'NOT_FOUND':
        return 'The requested AI model is not available. Please try a different model.';
      case 'BAD_REQUEST':
        return 'There was an issue with the request. Please try again with a different message.';
      case 'NETWORK':
        return 'Unable to connect to the AI service. Please check your internet connection.';
      case 'INTERNAL_SERVER':
        return 'The AI service is currently experiencing technical difficulties. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again later.';
    }
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
        ? this.getUserFriendlyErrorMessage(error)
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