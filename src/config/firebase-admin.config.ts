import admin from 'firebase-admin';

let firebaseInitialized = false;
let firebaseError: Error | null = null;

if (!admin.apps.length) {
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
        }
      } else {
        console.error('❌ FIREBASE_SERVICE_ACCOUNT_JSON não está configurada na Vercel');
        firebaseError = new Error('FIREBASE_SERVICE_ACCOUNT_JSON não está configurada');
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
      }
    }

    if (serviceAccount && !firebaseError) {
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
    }
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase Admin:', error);
    firebaseError = error instanceof Error ? error : new Error(String(error));
  }
}

// Lazy export com tratamento de erro
export const adminFirestore = firebaseInitialized ? admin.firestore() : null;
export const adminStorage = firebaseInitialized ? admin.storage() : null;

export function getFirestoreDb() {
  if (!firebaseInitialized || !adminFirestore) {
    throw firebaseError || new Error('Firebase não foi inicializado. Configure FIREBASE_SERVICE_ACCOUNT_JSON');
  }
  return adminFirestore;
}

export function getStorageBucket() {
  if (!firebaseInitialized || !adminStorage) {
    throw firebaseError || new Error('Firebase não foi inicializado. Configure FIREBASE_SERVICE_ACCOUNT_JSON');
  }
  return adminStorage;
}