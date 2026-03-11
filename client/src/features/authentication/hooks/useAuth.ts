import { useContext } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import AuthContext from '../context/AuthContext';
import {
  signInEmailAndPassword,
  createUserEmailPassword,
  updateUserProfile,
  sendPasswordReset,
  setAuthPersistence,
} from '../api/auth';

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, loading } = context;

  const login = async (email: string, password: string, rememberMe: boolean) => {
    await setAuthPersistence(rememberMe);
    await signInEmailAndPassword(email, password);
  };

  const register = async (email: string, password: string, displayName: string) => {
    const result = await createUserEmailPassword(email, password);
    await updateUserProfile(result.user, { displayName });
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordReset(email);
  };

  return { user, loading, login, register, logout, resetPassword };
}
