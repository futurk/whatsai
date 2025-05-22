export class OpenAIClient {
  private baseUrl = 'https://api.openai.com/v1';

  constructor(private readonly apiKey: string) {
    if (!this.isValidApiKey(apiKey)) {
      throw new Error('Invalid OpenAI API key');
    }
  }

  private isValidApiKey(key: string): boolean {
    return Boolean(key && typeof key === 'string' && key.startsWith('sk-'));
  }

  async chat(messages: Array<{ role: string; content: any }>, model: string, temperature?: number, maxTokens?: number) {
    if (!messages?.length) {
      throw new Error('Messages array cannot be empty');
    }

    if (!model) {
      throw new Error('Model must be specified');
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: temperature,
          max_tokens: maxTokens ?? 1000,
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
        throw new Error('Network error: Unable to connect to OpenAI API');
      }
      throw error;
    }
  }
}