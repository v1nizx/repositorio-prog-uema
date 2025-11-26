/**
 * INSTRUÇÕES PARA CORRIGIR AS REGRAS DE SEGURANÇA DO FIREBASE
 * 
 * O erro "Missing or insufficient permissions" significa que as regras de segurança
 * do Firebase estão bloqueando o acesso aos documentos.
 * 
 * SOLUÇÃO:
 */

// 1. Acesse o Firebase Console
// https://console.firebase.google.com/

// 2. Selecione seu projeto "repositorio-proguema"

// 3. Vá para "Build" > "Firestore Database"

// 4. Clique na aba "Regras" (Rules)

// 5. Substitua o conteúdo INTEIRO pelas regras abaixo:

/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permite leitura pública de documentos
    match /documents/{docId} {
      allow read: if true;
      allow create: if request.auth != null && 
                       request.resource.data.titulo is string &&
                       request.resource.data.tipo is string &&
                       request.resource.data.autor is string &&
                       request.resource.data.setor is string;
      allow update: if request.auth != null;
      allow delete: if request.auth != null;
    }
  }
}
*/

// 6. Clique em "Publicar" (Publish)

// 7. Aguarde a confirmação (deve levar alguns segundos)

// 8. Volte ao terminal e execute novamente:
//    npm run dev

// IMPORTANTE: Essas regras permitem leitura pública mas mantêm a escrita segura.
// Para um ambiente de produção, você deve implementar autenticação real.

export const firebaseRulesForProduction = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /documents/{docId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
                       request.resource.data.titulo is string &&
                       request.resource.data.tipo is string &&
                       request.resource.data.autor is string &&
                       request.resource.data.setor is string;
      allow update: if request.auth != null && resource.data.autor == request.auth.uid;
      allow delete: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
`;
