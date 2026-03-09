import { AppError } from './AppError';

export class ForbiddenError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 'FORBIDDEN', 403, true);
  }
}
