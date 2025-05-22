import { Vendor } from '@/types/apiKey';

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

export const ERROR_STATUS_MAP: Record<number, { type: APIErrorType; defaultMessage: string }> = {
  400: {
    type: 'BAD_REQUEST',
    defaultMessage: 'The request was malformed or invalid'
  },
  401: {
    type: 'AUTHENTICATION',
    defaultMessage: 'Invalid API key provided'
  },
  403: {
    type: 'PERMISSION_DENIED',
    defaultMessage: 'You don\'t have access to this resource'
  },
  404: {
    type: 'NOT_FOUND',
    defaultMessage: 'The requested resource doesn\'t exist'
  },
  422: {
    type: 'UNPROCESSABLE_ENTITY',
    defaultMessage: 'The request was well-formed but invalid'
  },
  429: {
    type: 'RATE_LIMIT',
    defaultMessage: 'Rate limit exceeded'
  },
  500: {
    type: 'INTERNAL_SERVER',
    defaultMessage: 'The server encountered an internal error'
  },
  501: {
    type: 'INTERNAL_SERVER',
    defaultMessage: 'The server encountered an internal error'
  },
  502: {
    type: 'INTERNAL_SERVER',
    defaultMessage: 'The server encountered an internal error'
  },
  503: {
    type: 'INTERNAL_SERVER',
    defaultMessage: 'The server encountered an internal error'
  },
  504: {
    type: 'INTERNAL_SERVER',
    defaultMessage: 'The server encountered an internal error'
  }
};

export const getPrettyErrorMessage = (error: APIError, vendor?: Vendor): string => {
  switch (error.type) {
    case 'AUTHENTICATION':
      return `Your ${vendor ? vendor + ' ' : ''}API key appears to be invalid. Please check your settings and update your API key.`;
    case 'RATE_LIMIT':
      return 'You\'ve hit the rate limit. Please wait a moment before sending another message.';
    case 'PERMISSION_DENIED':
      return 'You don\'t have permission to use this feature. Please check your API key permissions.';
    case 'NOT_FOUND':
      return 'The requested AI model is not available. Please try a different model.';
    case 'BAD_REQUEST':
      return 'There was an issue with the request. Please try again with a different message.';
    case 'NETWORK':
      return `Unable to connect to the ${vendor || 'AI'} service. Please check your internet connection.`;
    case 'INTERNAL_SERVER':
      return `The ${vendor || 'AI'} service is currently experiencing technical difficulties. Please try again later.`;
    default:
      return 'An unexpected error occurred. Please try again later.';
  }
};