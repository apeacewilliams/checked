import { AppError } from './AppError.js';

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 'UNAUTHENTICATED', 401, true);
  }
}
