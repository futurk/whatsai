interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatCompletionResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class OpenAIClient {
  private readonly baseUrl = 'https://api.openai.com/v1';
  private readonly apiKey: string;

  constructor(apiKey: string) {
    if (!this.isValidApiKey(apiKey)) {
      throw new Error('Invalid OpenAI API key format');
    }
    this.apiKey = apiKey;
  }

  private isValidApiKey(key: string): boolean {
    return typeof key === 'string' && key.startsWith('sk-') && key.length > 20;
  }

  private async makeRequest(endpoint: string, body: unknown) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }

    return response.json();
  }

  async chat(messages: ChatMessage[], model: string): Promise<string> {
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error('Messages must be a non-empty array');
    }

    if (!model) {
      throw new Error('Model must be specified');
    }

    try {
      const data = await this.makeRequest('/chat/completions', {
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }) as ChatCompletionResponse;

      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('Invalid response format from OpenAI');
      }

      return content;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get response from OpenAI: ${error.message}`);
      }
      throw new Error('Failed to get response from OpenAI');
    }
  }
}