import { cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { config } from '../config/index.js';

const app = initializeApp({
  credential: cert({
    projectId: config.firebaseProjectId,
    privateKey: config.firebasePrivateKey.replace(/\\n/g, '\n'), // replaces "\n" from private key string with actual newline characters
    clientEmail: config.firebaseClientEmail,
  }),
});

export const auth = getAuth(app);
