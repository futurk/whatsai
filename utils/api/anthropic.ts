export class AnthropicClient {
  private baseUrl = 'https://api.anthropic.com/v1';

  constructor(private readonly apiKey: string) {
    if (!this.isValidApiKey(apiKey)) {
      throw new Error('Invalid Anthropic API key');
    }
  }

  private isValidApiKey(key: string): boolean {
    return Boolean(key && typeof key === 'string');
  }

  async chat(messages: Array<{ role: string; content: string }>, model: string, temperature?: number, maxTokens?: number) {
    if (!messages?.length) {
      throw new Error('Messages array cannot be empty');
    }

    if (!model) {
      throw new Error('Model must be specified');
    }

    const anthropicMessages = messages.map(msg => ({
      role: msg.role === 'system' ? 'assistant' : msg.role,
      content: msg.content,
    }));

    try {
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          max_tokens: maxTokens ?? 1000,
          temperature: temperature ?? 0.7,
          messages: anthropicMessages,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (error.error) {
          throw new Error(error.error.message || error.error.type);
        }
        throw new Error(`HTTP error ${response.status}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to Anthropic API');
      }
      throw error;
    }
  }
}