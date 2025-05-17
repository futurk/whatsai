export class AnthropicClient {
  private baseUrl = 'https://api.anthropic.com/v1';
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey || typeof apiKey !== 'string') {
      throw new Error('Invalid Anthropic API key format');
    }
    this.apiKey = apiKey;
  }

  async chat(messages: Array<{ role: 'user' | 'assistant' | 'system', content: string }>, model: string) {
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error('Messages must be a non-empty array');
    }

    if (!model) {
      throw new Error('Model must be specified');
    }

    try {
      const anthropicMessages = messages.map(msg => ({
        role: msg.role === 'system' ? 'assistant' : msg.role,
        content: msg.content,
      }));

      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          max_tokens: 1000,
          messages: anthropicMessages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || `HTTP error ${response.status}`;
        throw new Error(`Anthropic API error: ${errorMessage}`);
      }

      const data = await response.json();
      
      if (!data.content?.[0]?.text) {
        throw new Error('Invalid response format from Anthropic');
      }

      return data.content[0].text;
    } catch (error) {
      console.error('Anthropic API error:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to get response from Anthropic: ${error.message}`);
      }
      throw new Error('Failed to get response from Anthropic');
    }
  }
}
