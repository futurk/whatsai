export class OpenAIClient {
  private baseUrl = 'https://api.openai.com/v1';
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey || typeof apiKey !== 'string' || !apiKey.startsWith('sk-')) {
      throw new Error('Invalid OpenAI API key format');
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
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || `HTTP error ${response.status}`;
        throw new Error(`OpenAI API error: ${errorMessage}`);
      }

      const data = await response.json();
      
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from OpenAI');
      }

      return data.choices[0].message.content;
  }
}
