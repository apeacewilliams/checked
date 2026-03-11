import { LoginForm, useAuth } from '@/features/authentication';
import { Navigate } from 'react-router';

export function LoginPage() {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/" replace />;
  }
  return <LoginForm />;
}
