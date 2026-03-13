import { AppError } from './AppError.js';

export class ForbiddenError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 'FORBIDDEN', 403, true);
  }
}
