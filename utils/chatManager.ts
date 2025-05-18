import { OpenAIClient } from './api/openai';
import { AnthropicClient } from './api/anthropic';
import { Agent } from '@/types/agent';
import { ApiKey } from '@/types/apiKey';

export interface LogEntry {
  timestamp: string;
  type: 'request' | 'response' | 'error';
  data: any;
}

export class ChatManager {
  private clients: Map<string, any> = new Map();
  private agent: Agent;
  private logs: LogEntry[] = [];
  private onLog?: (log: LogEntry) => void;

  constructor(agent: Agent, apiKeys: ApiKey[], onLog?: (log: LogEntry) => void) {
    this.agent = agent;
    this.onLog = onLog;
    const apiKey = apiKeys.find(key => key.id === agent.apiKeyId);
    if (!apiKey) {
      throw new Error(`No API key found for agent: ${agent.name}`);
    }

    try {
      switch (apiKey.vendorId.toLowerCase()) {
        case 'openai':
          this.clients.set(agent.id, new OpenAIClient(apiKey.key));
          break;
        case 'anthropic':
          this.clients.set(agent.id, new AnthropicClient(apiKey.key));
          break;
        default:
          throw new Error(`Unsupported vendor: ${apiKey.vendorId}`);
      }
    } catch (error) {
      console.error(`Failed to initialize chat client for ${apiKey.vendorId}:`, error);
      throw new Error(`Failed to initialize chat client: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private addLog(type: LogEntry['type'], data: any) {
    const log: LogEntry = {
      timestamp: new Date().toISOString(),
      type,
      data,
    };
    this.logs.push(log);
    this.onLog?.(log);
  }

  async sendMessage(agentId: string, messages: Array<{ role: 'user' | 'assistant' | 'system', content: string }>) {
    const client = this.clients.get(agentId);
    if (!client) {
      throw new Error('Chat client not initialized');
    }

    try {
      this.addLog('request', {
        messages,
        model: this.agent.model,
      });

      const response = await client.chat(messages, this.agent.model);

      this.addLog('response', {
        response,
      });

      return response;
    } catch (error) {
      this.addLog('error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      console.error('Chat client error:', error);
      throw error;
    }
  }

  getLogs() {
    return this.logs;
  }
}