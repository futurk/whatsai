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

      // Handle specific status codes
      switch (response.status) {
        case 400:
          throw new Error('Bad request: The request was malformed or invalid');
        case 401:
          throw new Error('Invalid API key: Please check your API key and try again');
        case 403:
          throw new Error('Permission denied: You don\'t have access to this resource');
        case 404:
          throw new Error('Not found: The requested resource doesn\'t exist');
        case 422:
          throw new Error('Unprocessable entity: The request was well-formed but invalid');
        case 429:
          throw new Error('Rate limit exceeded: Please try again later');
        case 500:
        case 501:
        case 502:
        case 503:
        case 504:
          throw new Error('OpenAI API is experiencing issues. Please try again later');
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Unknown error: ${response.status}`);
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