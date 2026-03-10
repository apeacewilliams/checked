import { AuthenticationError } from '../errors/index.js';
import type { AppContext } from '../types.js';

export function requireAuth(context: AppContext) {
  if (!context.user) {
    throw new AuthenticationError('You must be logged in');
  }
  return context.user;
}
