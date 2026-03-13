import { AppError } from './AppError.js';

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400, true);
  }
}
