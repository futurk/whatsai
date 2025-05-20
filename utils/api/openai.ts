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

    const formattedMessages = messages.map(msg => {
      if (Array.isArray(msg.content)) {
        return {
          role: msg.role,
          content: msg.content.map(content => {
            if (content.type === 'image_url' && typeof content.image_url === 'string') {
              return {
                type: 'image_url',
                image_url: {
                  url: content.image_url
                }
              };
            }
            return content;
          })
        };
      }
      return msg;
    });

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: formattedMessages,
        temperature: temperature ?? 1.0,
        max_tokens: maxTokens ?? 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `HTTP error ${response.status}`);
    }

    return response.json();
  }
}