import admin from 'firebase-admin';

let firebaseInitialized = false;
let firebaseError: Error | null = null;
let cachedFirestore: admin.firestore.Firestore | null = null;
let cachedStorage: admin.storage.Storage | null = null;

function initializeFirebase() {
  if (firebaseInitialized || firebaseError) {
    return;
  }

  if (admin.apps.length > 0) {
    firebaseInitialized = true;
    cachedFirestore = admin.firestore();
    cachedStorage = admin.storage();
    return;
  }

  try {
    let serviceAccount: any = null;
    let serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    
    if (!serviceAccountJson) {
      console.warn('⚠️  FIREBASE_SERVICE_ACCOUNT_JSON não encontrada');
      
      // Tentar carregar do arquivo local apenas em desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        try {
          serviceAccount = require('./firebase-service-account.json');
        } catch (e) {
          console.error('⚠️  Arquivo firebase-service-account.json não encontrado');
          firebaseError = new Error('FIREBASE_SERVICE_ACCOUNT_JSON não está configurada');
          return;
        }
      } else {
        console.error('❌ FIREBASE_SERVICE_ACCOUNT_JSON não está configurada na Vercel');
        firebaseError = new Error('FIREBASE_SERVICE_ACCOUNT_JSON não está configurada');
        return;
      }
    } else {
      try {
        // Verificar se é Base64 (começa com { após decodificar)
        if (!serviceAccountJson.startsWith('{')) {
          try {
            serviceAccountJson = Buffer.from(serviceAccountJson, 'base64').toString('utf-8');
          } catch (e) {
            // Não é Base64, usar como está
          }
        }
        
        serviceAccount = JSON.parse(serviceAccountJson);
      } catch (parseError) {
        console.error('❌ Erro ao fazer parse do JSON:', parseError);
        firebaseError = new Error('FIREBASE_SERVICE_ACCOUNT_JSON não é um JSON válido');
        return;
      }
    }

    if (serviceAccount) {
      const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || 'repositorio-proguema.appspot.com';
      
      console.log('🔧 Inicializando Firebase Admin com:');
      console.log('  Project ID:', serviceAccount.project_id);
      console.log('  Storage Bucket:', storageBucket);
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: storageBucket,
      });
      
      console.log('✅ Firebase Admin inicializado com sucesso');
      firebaseInitialized = true;
      cachedFirestore = admin.firestore();
      cachedStorage = admin.storage();
    }
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase Admin:', error);
    firebaseError = error instanceof Error ? error : new Error(String(error));
  }
}

// Lazy getters - inicializam apenas quando chamados
export function getFirestoreDb() {
  initializeFirebase();
  if (!firebaseInitialized || !cachedFirestore) {
    throw firebaseError || new Error('Firebase não foi inicializado. Configure FIREBASE_SERVICE_ACCOUNT_JSON');
  }
  return cachedFirestore;
}

export function getStorageBucket() {
  initializeFirebase();
  if (!firebaseInitialized || !cachedStorage) {
    throw firebaseError || new Error('Firebase não foi inicializado. Configure FIREBASE_SERVICE_ACCOUNT_JSON');
  }
  return cachedStorage;
}