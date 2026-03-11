import type { User } from 'firebase/auth';
import { createContext } from 'react';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true });

export default AuthContext;
