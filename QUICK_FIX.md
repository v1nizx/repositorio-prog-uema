# 🔴 ERRO: Missing or insufficient permissions

## Solução Rápida

### Passo 1: Acesse o Firebase Console
👉 https://console.firebase.google.com/

### Passo 2: Selecione o Projeto
- Clique em **"repositorio-proguema"**

### Passo 3: Vá para Firestore
- No menu esquerdo, vá para: **Build → Firestore Database**

### Passo 4: Abra as Regras
- Clique na aba **"Regras"** (Rules)

### Passo 5: Copie as Regras Corretas

Limpe tudo e cole exatamente isto:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /documents/{docId} {
      allow read: if true;
      allow create: if request.resource.data.titulo is string &&
                       request.resource.data.tipo is string &&
                       request.resource.data.autor is string &&
                       request.resource.data.setor is string;
      allow update: if true;
      allow delete: if true;
    }
  }
}
```

### Passo 6: Publique
- Clique em **"Publicar"** (Publish)
- Aguarde a confirmação

### Passo 7: Volte ao Terminal

Pressione `Ctrl+C` se estiver rodando o servidor, depois:

```bash
npm run dev
```

## Se ainda não funcionar

### Verifique:
1. ✅ As credenciais do Firebase em `.env.local` estão corretas?
2. ✅ O Firestore Database foi criado?
3. ✅ As regras foram publicadas?

### Debug:
- Abra o console do navegador (F12)
- Vá para a aba "Console"
- Tente fazer um upload
- Procure por mensagens de erro

## Estrutura Esperada do Firestore

```
Collection: documents
├── Document: {auto-generated-id}
│   ├── titulo: "string"
│   ├── tipo: "string"
│   ├── autor: "string"
│   ├── setor: "string"
│   ├── descricao: "string"
│   ├── nomeArquivo: "string"
│   ├── tamanhoArq: 300000
│   ├── urlArquivo: "string"
│   ├── status: "ativo"
│   └── versao: 1
```

---

**Depois que funcionar, teste:**
1. Acesse http://localhost:3001
2. Vá para "Upload de Documentos"
3. Selecione um arquivo PDF/DOCX/XLSX
4. Preencha os campos
5. Clique em "Enviar Documento"
