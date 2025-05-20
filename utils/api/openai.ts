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

  async chat(messages: Array<{ role: string; content: any }>, model: string) {
    if (!messages?.length) {
      throw new Error('Messages array cannot be empty');
    }

    if (!model) {
      throw new Error('Model must be specified');
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `HTTP error ${response.status}`);
    }

    return response.json();
  }
}