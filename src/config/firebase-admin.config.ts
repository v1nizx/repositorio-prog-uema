import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    
    if (!serviceAccountJson) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON não está definida');
    }

    const serviceAccount = JSON.parse(serviceAccountJson);
    const storageBucket = 'repositorio-proguema.appspot.com'; // Nome correto do bucket
    
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