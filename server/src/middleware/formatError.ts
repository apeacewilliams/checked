import type { ApolloServerOptions } from '@apollo/server';
import { unwrapResolverError } from '@apollo/server/errors';
import { AppError } from '../errors/index.js';
import { config } from '../config/index.js';

export const formatError: ApolloServerOptions<never>['formatError'] = (formattedError, error) => {
  const originalError = unwrapResolverError(error);

  if (originalError instanceof AppError && originalError.isOperational) {
    return {
      message: originalError.message,
      extensions: {
        code: originalError.code,
        statusCode: originalError.statusCode,
      },
    };
  }

  // Unexpected error — log full details server-side, mask from client
  console.error('Unexpected error:', originalError);

  if (config.isProduction) {
    return {
      message: 'Internal server error',
      extensions: {
        code: 'INTERNAL_ERROR',
        statusCode: 500,
      },
    };
  }

  // In development, include the original message and stack for debugging
  return {
    message: formattedError.message,
    extensions: {
      ...formattedError.extensions,
      code: 'INTERNAL_ERROR',
      statusCode: 500,
      stack: originalError instanceof Error ? originalError.stack : undefined,
    },
  };
};
