import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    let serviceAccount;
    
    // Tentar carregar o JSON da variável de ambiente
    let serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    
    if (!serviceAccountJson) {
      console.warn('⚠️  FIREBASE_SERVICE_ACCOUNT_JSON não encontrada, tentando carregar arquivo...');
      
      // Fallback: tentar carregar do arquivo local (apenas em desenvolvimento)
      if (process.env.NODE_ENV === 'development') {
        try {
          serviceAccount = require('./firebase-service-account.json');
        } catch (e) {
          throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON não está configurada na Vercel');
        }
      } else {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON não está configurada na Vercel');
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
        throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON não é um JSON válido');
      }
    }

    const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || 'repositorio-proguema.appspot.com';
    
    console.log('🔧 Inicializando Firebase Admin com:');
    console.log('  Project ID:', serviceAccount.project_id);
    console.log('  Storage Bucket:', storageBucket);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: storageBucket,
    });
    
    console.log('✅ Firebase Admin inicializado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase Admin:', error);
    throw error;
  }
}

export const adminFirestore = admin.firestore();
export const adminStorage = admin.storage();