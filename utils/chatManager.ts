import { OpenAIClient } from './api/openai';
import { AnthropicClient } from './api/anthropic';
import { APIError, getPrettyErrorMessage } from './api/types';
import { Agent } from '@/types/agent';
import { ApiKey, Vendor } from '@/types/apiKey';
import { RetryHandler } from './api/retryHandler';
import { ErrorLogger } from './api/errorLogger';

export interface LogEntry {
  timestamp: string;
  type: 'request' | 'response' | 'error';
  data: any;
}

export class ChatManager {
  private client: OpenAIClient | AnthropicClient;
  private retryHandler: RetryHandler;
  private errorLogger: ErrorLogger;
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
    this.retryHandler = new RetryHandler();
    this.errorLogger = ErrorLogger.getInstance();
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

  private log(type: LogEntry['type'], data: any, conversationId?: string) {
    const log: LogEntry = {
      timestamp: new Date().toISOString(),
      type,
      data,
    };
    
    if (conversationId) {
      this.errorLogger.log(conversationId, log);
    }
    
    this.onLog?.(log);
  }

  async sendMessage(messages: Array<{ role: string; content: any }>, conversationId: string) {
    try {
      const requestPayload = {
        messages,
        model: this.agent.model,
        temperature: this.agent.temperature,
        maxTokens: this.agent.maxTokens
      };

      this.log('request', requestPayload, conversationId);

      const response = await this.retryHandler.execute(() =>
        this.client.chat(
          messages,
          this.agent.model,
          this.agent.temperature,
          this.agent.maxTokens
        )
      );
      
      this.log('response', response, conversationId);
      this.retryHandler.reset();

      return response.choices?.[0]?.message?.content || response;
    } catch (error) {
      const userMessage = error instanceof APIError
        ? getPrettyErrorMessage(error, this.vendor)
        : 'An unexpected error occurred. Please try again later.';
      
      this.log('error', {
        userMessage,
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : 'Unknown error'
      }, conversationId);
      
      throw new Error(userMessage);
    }
  }

  getLogsForConversation(conversationId: string): LogEntry[] {
    return this.errorLogger.getLogsForConversation(conversationId);
  }

  clearLogsForConversation(conversationId: string) {
    this.errorLogger.clearLogsForConversation(conversationId);
  }
}