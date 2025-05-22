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

  private getErrorMessage(error: any): string {
    if (error?.message?.includes('Invalid API key')) {
      return 'Invalid API key. Please check your API key in settings and try again.';
    }
    
    if (error?.message?.includes('Rate limit')) {
      return 'Rate limit exceeded. Please wait a moment and try again.';
    }
    
    if (error?.message?.includes('insufficient_quota') || error?.message?.includes('billing')) {
      return 'API quota exceeded. Please check your billing status and try again.';
    }
    
    if (error?.message?.includes('context_length_exceeded')) {
      return 'Message too long. Please try sending a shorter message or starting a new conversation.';
    }
    
    if (error?.message?.includes('content_filter')) {
      return 'Message blocked by content filter. Please rephrase your message and try again.';
    }
    
    if (error?.message?.includes('model')) {
      return 'Selected model is currently unavailable. Please try again later or choose a different model.';
    }

    if (error?.message?.includes('timeout') || error?.message?.includes('ETIMEDOUT')) {
      return 'Request timed out. Please check your internet connection and try again.';
    }

    if (error?.message?.includes('network') || error?.message?.includes('ECONNREFUSED')) {
      return 'Network error. Please check your internet connection and try again.';
    }

    return 'An unexpected error occurred. Please try again later.';
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
      const errorMessage = this.getErrorMessage(error);
      
      this.log('error', {
        error: errorMessage,
        originalError: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      throw new Error(errorMessage);
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }
}