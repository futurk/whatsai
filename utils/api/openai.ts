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
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || `HTTP error ${response.status}`;
        
        // Categorize common OpenAI API errors
        if (errorMessage.includes('Incorrect API key provided')) {
          throw new Error('INVALID_API_KEY');
        } else if (errorMessage.includes('Rate limit reached')) {
          throw new Error('RATE_LIMIT_EXCEEDED');
        } else if (errorMessage.includes('You exceeded your current quota')) {
          throw new Error('QUOTA_EXCEEDED');
        } else if (errorMessage.includes('The model') && errorMessage.includes('does not exist')) {
          throw new Error('MODEL_NOT_FOUND');
        } else if (response.status === 503) {
          throw new Error('SERVICE_UNAVAILABLE');
        } else {
          throw new Error(`API_ERROR: ${errorMessage}`);
        }
      }

      const data = await response.json();
      
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('INVALID_RESPONSE');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      if (error instanceof Error) {
        // Pass through our categorized errors
        if (error.message.startsWith('INVALID_API_KEY') ||
            error.message.startsWith('RATE_LIMIT_EXCEEDED') ||
            error.message.startsWith('QUOTA_EXCEEDED') ||
            error.message.startsWith('MODEL_NOT_FOUND') ||
            error.message.startsWith('SERVICE_UNAVAILABLE') ||
            error.message.startsWith('INVALID_RESPONSE') ||
            error.message.startsWith('API_ERROR')) {
          throw error;
        }
        throw new Error(`NETWORK_ERROR: ${error.message}`);
      }
      throw new Error('UNKNOWN_ERROR');
    }
  }
}