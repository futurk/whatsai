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

      // Handle specific status codes
      switch (response.status) {
        case 400:
          throw new Error('Bad request: The request was malformed or invalid');
        case 401:
          throw new Error('Invalid API key: Please check your API key and try again');
        case 403:
          throw new Error('Permission denied: You don\'t have access to this resource');
        case 404:
          throw new Error('Not found: The requested model or resource doesn\'t exist');
        case 422:
          throw new Error('Unprocessable entity: The request was well-formed but invalid');
        case 429:
          throw new Error('Rate limit exceeded: Please try again later');
        case 500:
        case 501:
        case 502:
        case 503:
        case 504:
          throw new Error('Anthropic API is experiencing issues. Please try again later');
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Unknown error: ${response.status}`);
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