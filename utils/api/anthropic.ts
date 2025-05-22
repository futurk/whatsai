import { APIError, APIErrorType, ErrorResponse, ERROR_STATUS_MAP } from './types';

export class AnthropicClient {
  private baseUrl = 'https://api.anthropic.com/v1';

  constructor(private readonly apiKey: string) {
    if (!this.isValidApiKey(apiKey)) {
      throw new APIError('Invalid Anthropic API key', 401, 'AUTHENTICATION');
    }
  }

  private isValidApiKey(key: string): boolean {
    return Boolean(key && typeof key === 'string');
  }

  private handleErrorResponse(status: number, data?: ErrorResponse): never {
    const errorInfo = ERROR_STATUS_MAP[status] || {
      type: 'UNKNOWN' as APIErrorType,
      defaultMessage: 'An unknown error occurred'
    };

    const errorMessage = data?.error?.message || errorInfo.defaultMessage;
    throw new APIError(errorMessage, status, errorInfo.type);
  }

  async chat(messages: Array<{ role: string; content: string }>, model: string, temperature?: number, maxTokens?: number) {
    if (!messages?.length) {
      throw new APIError('Messages array cannot be empty', 400, 'BAD_REQUEST');
    }

    if (!model) {
      throw new APIError('Model must be specified', 400, 'BAD_REQUEST');
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
        throw new APIError('Unable to connect to Anthropic API', 0, 'NETWORK');
      }

      throw new APIError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        0,
        'UNKNOWN'
      );
    }
  }
}