# ✅ SOLUÇÃO COMPLETA - DOIS ERROS

## Erro 1: Firestore - Permission Denied
```
Missing or insufficient permissions.
```

### FIX FIRESTORE:

1. Abra: https://console.firebase.google.com/
2. Projeto: `repositorio-proguema`
3. Menu: **Build → Firestore Database**
4. Aba: **Regras** (Rules)
5. Apague TUDO e cole isto:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /documents/{docId} {
      allow read: if true;
      allow create: if request.resource.data.titulo is string;
      allow update: if true;
      allow delete: if true;
    }
  }
}
```

6. **Publicar** (Publish)

---

## Erro 2: Storage - 404
```
Firebase Storage: An unknown error occurred
Status: 404
```

### FIX STORAGE:

1. No Firebase Console, menu: **Build → Storage**
2. Se não existir, clique: **Começar** (Get Started)
3. Modo: **Teste** (Test mode)
4. Próximo
5. Região: **southamerica-east1**
6. **Criar** e aguarde 2-3 minutos
7. Clique na aba: **Regras** (Rules)
8. Apague TUDO e cole isto:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /documents/{allPaths=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

9. **Publicar** (Publish)

---

## Verificar .env.local

Seu arquivo deve ter EXATAMENTE isto:

```env
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyCJjCYc-c6PaSsb7jOLeCgo8G26mEacZOY"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="repositorio-proguema.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="repositorio-proguema"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="repositorio-proguema.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="92516090954"
NEXT_PUBLIC_FIREBASE_APP_ID="1:92516090954:web:a2115a0188faeb790692b3"
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## Testar

1. Pressione `Ctrl+C` no terminal
2. Execute:
   ```bash
   npm run dev
   ```
3. Acesse: http://localhost:3001
4. Vá para: **Upload de Documentos**
5. Selecione um **PDF**
6. Preencha os campos
7. Clique: **Enviar Documento**

Se ver:
```
✅ Documento enviado com sucesso!
```

**PRONTO! 🎉**

---

## Checklist Final

- [ ] Firestore Rules publicadas?
- [ ] Storage criado?
- [ ] Storage Rules publicadas?
- [ ] Aguardou 2-3 minutos após criar?
- [ ] `.env.local` correto?
- [ ] Servidor rodando com `npm run dev`?
- [ ] Arquivo é PDF/DOCX/XLSX?

Se todos os itens marcados, teste novamente!
