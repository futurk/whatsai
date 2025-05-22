import { RateLimitError, NetworkError } from './types';

interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
}

export class RetryHandler {
  private attempts = 0;
  private readonly maxAttempts: number;
  private readonly initialDelay: number;
  private readonly maxDelay: number;

  constructor(options: RetryOptions = {}) {
    this.maxAttempts = options.maxAttempts || 3;
    this.initialDelay = options.initialDelay || 1000;
    this.maxDelay = options.maxDelay || 10000;
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    while (this.attempts < this.maxAttempts) {
      try {
        return await operation();
      } catch (error) {
        this.attempts++;

        if (!(error instanceof RateLimitError || error instanceof NetworkError) || 
            this.attempts === this.maxAttempts) {
          throw error;
        }

        const delay = Math.min(
          this.initialDelay * Math.pow(2, this.attempts - 1),
          this.maxDelay
        );

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw new Error('Maximum retry attempts reached');
  }

  reset() {
    this.attempts = 0;
  }
}