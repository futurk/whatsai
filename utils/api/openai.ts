import { APIError, APIErrorType, ErrorResponse, ERROR_STATUS_MAP } from './types';

export class OpenAIClient {
  private baseUrl = 'https://api.openai.com/v1';

  constructor(private readonly apiKey: string) {
    if (!this.isValidApiKey(apiKey)) {
      throw new APIError('Invalid OpenAI API key', 401, 'AUTHENTICATION');
    }
  }

  private isValidApiKey(key: string): boolean {
    return Boolean(key && typeof key === 'string' && key.startsWith('sk-'));
  }

  private handleErrorResponse(status: number, data?: ErrorResponse): never {
    const errorInfo = ERROR_STATUS_MAP[status] || {
      type: 'UNKNOWN' as APIErrorType,
      defaultMessage: 'An unknown error occurred'
    };

    const errorMessage = data?.error?.message || errorInfo.defaultMessage;
    throw new APIError(errorMessage, status, errorInfo.type);
  }

  async chat(messages: Array<{ role: string; content: any }>, model: string, temperature?: number, maxTokens?: number) {
    if (!messages?.length) {
      throw new APIError('Messages array cannot be empty', 400, 'BAD_REQUEST');
    }

    if (!model) {
      throw new APIError('Model must be specified', 400, 'BAD_REQUEST');
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
        const data = await response.json() as ErrorResponse;
        this.handleErrorResponse(response.status, data);
      }

      return response.json();
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new APIError('Unable to connect to OpenAI API', 0, 'NETWORK');
      }

      throw new APIError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        0,
        'UNKNOWN'
      );
    }
  }
}