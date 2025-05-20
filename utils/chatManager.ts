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

  private async getBase64FromUrl(url: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        resolve(base64data.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async sendMessage(messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>, imageUrl?: string) {
    try {
      let messageContent = messages[messages.length - 1].content;
      let requestPayload;

      if (imageUrl) {
        const base64Image = await this.getBase64FromUrl(imageUrl);
        const lastMessage = messages[messages.length - 1];
        
        requestPayload = {
          messages: [
            ...messages.slice(0, -1),
            {
              role: lastMessage.role,
              content: [
                {
                  type: 'text',
                  text: messageContent
                },
                {
                  type: 'image_url',
                  image_url: `data:image/jpeg;base64,${base64Image}`
                }
              ]
            }
          ],
          model: this.agent.model
        };
      } else {
        requestPayload = {
          messages,
          model: this.agent.model
        };
      }

      this.log('request', requestPayload);

      const response = await this.client.chat(requestPayload.messages, this.agent.model);
      this.log('response', response);

      return response.choices?.[0]?.message?.content || response;
    } catch (error) {
      this.log('error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }
}