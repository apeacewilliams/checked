import { RegisterForm, useAuth } from '@/features/authentication';
import { Navigate } from 'react-router';

export function RegisterPage() {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/" replace />;
  }

  return <RegisterForm />;
}
