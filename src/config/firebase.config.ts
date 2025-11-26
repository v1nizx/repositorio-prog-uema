import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

/**
 * Configuração do Firebase para o Sistema de Upload de Documentos
 * 
 * Este arquivo inicializa o Firebase com a configuração do projeto.
 * As variáveis de ambiente são carregadas do arquivo .env.local
 * 
 * Passos para configurar:
 * 1. Crie um projeto no Firebase Console (https://console.firebase.google.com/)
 * 2. Obtenha suas credenciais do Firebase
 * 3. Preencha o arquivo .env.local com as variáveis de ambiente
 * 4. O Firebase será inicializado automaticamente quando o aplicativo carregar
 */

// 1. Importe a função initializeApp do SDK do Firebase
// (já importado no topo do arquivo)

// 2. Configure seu objeto de configuração do Firebase
// Substitua com suas credenciais do Firebase (arquivo .env.local)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  // databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || '', // Opcional, dependendo do uso
};

// 3. Inicialize o Firebase com sua configuração
const app = initializeApp(firebaseConfig);

// 4. Inicialize os serviços do Firebase que serão utilizados
// - Storage: para armazenar arquivos (PDFs, DOCX, XLSX)
// - Firestore: para armazenar metadados dos documentos
// - Auth: para autenticação de usuários (opcional, não implementado ainda)

export const storage = getStorage(app);
export const firestore = getFirestore(app);
export const auth = getAuth(app);

/**
 * Exports:
 * - storage: Instância do Firebase Storage para upload/download de arquivos
 * - firestore: Instância do Firestore Database para CRUD de documentos
 * - auth: Instância do Firebase Authentication para autenticação
 * 
 * Uso em outros arquivos:
 * import { storage, firestore, auth } from '@/config/firebase.config';
 */

export default app;
