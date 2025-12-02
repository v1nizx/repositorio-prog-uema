import { initializeApp, getApps, getApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Debug apenas em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Firebase Client Config carregado:');
  console.log('  apiKey:', firebaseConfig.apiKey ? '✅ Configurada' : '❌ Faltando');
  console.log('  projectId:', firebaseConfig.projectId ? '✅ Configurada' : '❌ Faltando');
}

// Padrão Singleton para evitar inicializar múltiplas vezes
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const storage = getStorage(app);
export const firestore = getFirestore(app);
export const auth = getAuth(app);

export default app;