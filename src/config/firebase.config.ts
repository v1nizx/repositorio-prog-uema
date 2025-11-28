import { initializeApp, getApps, getApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// --- ÁREA DE DEPURAÇÃO ---
// Se o deploy da Vercel continuar falhando, faça o seguinte teste:
// 1. Descomente a linha 'hardcodedKey' abaixo.
// 2. Cole sua chave API real (que começa com AIza...) entre as aspas.
// 3. Isso vai forçar o sistema a usar a chave direta, ignorando as variáveis de ambiente bugadas.
// LEMBRE-SE DE REMOVER ISSO DEPOIS QUE FUNCIONAR!

// const hardcodedKey = 'SUA_CHAVE_AIzaSyD_AQUI';

const firebaseConfig = {
  // Se você descomentou a linha acima, mude para: apiKey: hardcodedKey,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, 
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// --- DEBUG PARA O VERCEL ---
// Verificando quais variáveis estão chegando (sem mostrar o valor completo por segurança)
console.log('--- DEBUG DE VARIÁVEIS DE AMBIENTE ---');
const debugVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'
];

debugVars.forEach(varName => {
  const value = process.env[varName];
  console.log(`${varName}: ${value ? 'OK (Carregado)' : 'ERRO (Undefined/Vazio)'}`);
});
console.log('--------------------------------------');

// Padrão Singleton para evitar inicializar múltiplas vezes
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const storage = getStorage(app);
export const firestore = getFirestore(app);
export const auth = getAuth(app);

export default app;