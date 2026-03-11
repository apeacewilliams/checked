import { FirebaseError } from 'firebase/app';

const ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'Invalid email or password',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/email-already-in-use': 'An account with this email already exists',
  'auth/weak-password': 'Password is too weak',
};

export function getFirebaseErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    return ERROR_MESSAGES[error.code] ?? 'An error occurred. Please try again.';
  }
  return 'An unexpected error occurred';
}
