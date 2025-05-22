import { APIError, APIErrorType, ErrorResponse } from './types';

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
    let type: APIErrorType;
    let message: string;

    switch (status) {
      case 400:
        type = 'BAD_REQUEST';
        message = 'The request was malformed or invalid';
        break;
      case 401:
        type = 'AUTHENTICATION';
        message = 'Invalid API key provided';
        break;
      case 403:
        type = 'PERMISSION_DENIED';
        message = 'You don\'t have access to this resource';
        break;
      case 404:
        type = 'NOT_FOUND';
        message = 'The requested resource doesn\'t exist';
        break;
      case 422:
        type = 'UNPROCESSABLE_ENTITY';
        message = 'The request was well-formed but invalid';
        break;
      case 429:
        type = 'RATE_LIMIT';
        message = 'Rate limit exceeded';
        break;
      case 500:
      case 501:
      case 502:
      case 503:
      case 504:
        type = 'INTERNAL_SERVER';
        message = 'OpenAI API is experiencing issues';
        break;
      default:
        type = 'UNKNOWN';
        message = 'An unknown error occurred';
    }

    // Use the API's error message if available
    const errorMessage = data?.error?.message || message;
    throw new APIError(errorMessage, status, type);
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

      if (error instanceof TypeError && error.message.includes('fetch')) {
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