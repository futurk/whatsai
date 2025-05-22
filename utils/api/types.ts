export class APIError extends Error {
  constructor(
    message: string,
    public readonly code: number,
    public readonly type: APIErrorType
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export type APIErrorType = 
  | 'BAD_REQUEST'
  | 'AUTHENTICATION'
  | 'PERMISSION_DENIED'
  | 'NOT_FOUND'
  | 'UNPROCESSABLE_ENTITY'
  | 'RATE_LIMIT'
  | 'INTERNAL_SERVER'
  | 'NETWORK'
  | 'UNKNOWN';

export interface ErrorResponse {
  error?: {
    message?: string;
    type?: string;
    code?: string;
  };
}