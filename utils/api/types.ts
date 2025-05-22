export class APIError extends Error {
  constructor(
    message: string,
    public readonly code: number
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class BadRequestError extends APIError {
  constructor(message: string = 'The request was malformed or invalid') {
    super(message, 400);
    this.name = 'BadRequestError';
  }
}

export class AuthenticationError extends APIError {
  constructor(message: string = 'Invalid API key provided') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class PermissionDeniedError extends APIError {
  constructor(message: string = 'You don\'t have access to this resource') {
    super(message, 403);
    this.name = 'PermissionDeniedError';
  }
}

export class NotFoundError extends APIError {
  constructor(message: string = 'The requested resource doesn\'t exist') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class UnprocessableEntityError extends APIError {
  constructor(message: string = 'The request was well-formed but invalid') {
    super(message, 422);
    this.name = 'UnprocessableEntityError';
  }
}

export class RateLimitError extends APIError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429);
    this.name = 'RateLimitError';
  }
}

export class InternalServerError extends APIError {
  constructor(message: string = 'The server encountered an internal error') {
    super(message, 500);
    this.name = 'InternalServerError';
  }
}

export class NetworkError extends APIError {
  constructor(message: string = 'Network connection error') {
    super(message, 0);
    this.name = 'NetworkError';
  }
}

export interface ErrorResponse {
  error?: {
    message?: string;
    type?: string;
    code?: string;
  };
}

export const getPrettyErrorMessage = (error: APIError, vendor?: string): string => {
  const vendorPrefix = vendor ? `${vendor} ` : '';

  if (error instanceof AuthenticationError) {
    return `Your ${vendorPrefix}API key appears to be invalid. Please check your settings and update your API key.`;
  }
  if (error instanceof RateLimitError) {
    return 'You\'ve hit the rate limit. Please wait a moment before sending another message.';
  }
  if (error instanceof PermissionDeniedError) {
    return 'You don\'t have permission to use this feature. Please check your API key permissions.';
  }
  if (error instanceof NotFoundError) {
    return 'The requested AI model is not available. Please try a different model.';
  }
  if (error instanceof BadRequestError) {
    return 'There was an issue with the request. Please try again with a different message.';
  }
  if (error instanceof NetworkError) {
    return `Unable to connect to the ${vendorPrefix}service. Please check your internet connection.`;
  }
  if (error instanceof InternalServerError) {
    return `The ${vendorPrefix}service is currently experiencing technical difficulties. Please try again later.`;
  }
  return 'An unexpected error occurred. Please try again later.';
};