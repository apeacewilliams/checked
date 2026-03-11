import { auth } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  type User,
} from 'firebase/auth';

const createUserEmailPassword = async (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

const signInEmailAndPassword = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

const sendPasswordReset = async (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

const updateUserProfile = async (user: User, { displayName }: { displayName?: string }) => {
  return updateProfile(user, { displayName });
};

const setAuthPersistence = async (rememberMe: boolean) => {
  return setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
};

export {
  createUserEmailPassword,
  signInEmailAndPassword,
  sendPasswordReset,
  updateUserProfile,
  setAuthPersistence,
};
