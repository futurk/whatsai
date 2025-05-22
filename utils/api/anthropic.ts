import {
  APIError,
  BadRequestError,
  AuthenticationError,
  PermissionDeniedError,
  NotFoundError,
  UnprocessableEntityError,
  RateLimitError,
  InternalServerError,
  NetworkError
} from './types';

export class AnthropicClient {
  private baseUrl = 'https://api.anthropic.com/v1';

  constructor(private readonly apiKey: string) {
    if (!this.isValidApiKey(apiKey)) {
      throw new AuthenticationError('Invalid Anthropic API key');
    }
  }

  private isValidApiKey(key: string): boolean {
    return Boolean(key && typeof key === 'string');
  }

  private handleErrorResponse(status: number, message?: string): never {
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

  async chat(messages: Array<{ role: string; content: string }>, model: string, temperature?: number, maxTokens?: number) {
    if (!messages?.length) {
      throw new BadRequestError('Messages array cannot be empty');
    }

    if (!model) {
      throw new BadRequestError('Model must be specified');
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
        const data = await response.json();
        this.handleErrorResponse(response.status, data?.error?.message);
      }

      return response.json();
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new NetworkError('Unable to connect to Anthropic API');
      }

      throw new APIError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        0
      );
    }
  }
}