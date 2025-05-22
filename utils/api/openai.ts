import {
  APIError,
  ErrorResponse,
  BadRequestError,
  AuthenticationError,
  PermissionDeniedError,
  NotFoundError,
  UnprocessableEntityError,
  RateLimitError,
  InternalServerError,
  NetworkError
} from './types';

export class OpenAIClient {
  private baseUrl = 'https://api.openai.com/v1';

  constructor(private readonly apiKey: string) {
    if (!this.isValidApiKey(apiKey)) {
      throw new AuthenticationError('Invalid OpenAI API key');
    }
  }

  private isValidApiKey(key: string): boolean {
    return Boolean(key && typeof key === 'string' && key.startsWith('sk-'));
  }

  private handleErrorResponse(status: number, data?: ErrorResponse): never {
    const message = data?.error?.message;

    switch (status) {
      case 400:
        throw new BadRequestError(message);
      case 401:
        throw new AuthenticationError(message);
      case 403:
        throw new PermissionDeniedError(message);
      case 404:
        throw new NotFoundError(message);
      case 422:
        throw new UnprocessableEntityError(message);
      case 429:
        throw new RateLimitError(message);
      case 500:
      case 501:
      case 502:
      case 503:
      case 504:
        throw new InternalServerError(message);
      default:
        throw new APIError(message || 'An unknown error occurred', status);
    }
  }

  async chat(messages: Array<{ role: string; content: any }>, model: string, temperature?: number, maxTokens?: number) {
    if (!messages?.length) {
      throw new BadRequestError('Messages array cannot be empty');
    }

    if (!model) {
      throw new BadRequestError('Model must be specified');
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
        throw new NetworkError('Unable to connect to OpenAI API');
      }

      throw new APIError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        0
      );
    }
  }
}