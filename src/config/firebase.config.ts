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

// --- DEBUG PARA O VERCEL ---
// Isso vai aparecer no log do Vercel antes do erro, ajudando a gente a ver se a chave existe.
// Mostra apenas os 4 primeiros caracteres por segurança.
const key = firebaseConfig.apiKey;
console.log(`[FIREBASE CONFIG] Verificando API Key: ${key ? `${key.substring(0, 4)}...` : 'NÃO ENCONTRADA (UNDEFINED)'}`);
// ---------------------------

// Padrão Singleton para evitar inicializar múltiplas vezes (erro comum no Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const storage = getStorage(app);
export const firestore = getFirestore(app);
export const auth = getAuth(app);

export default app;