# 🚀 GUIA RÁPIDO - FIREBASE STORAGE

## Erro Current
```
storage/unknown - 404
```

## ✅ Solução em 5 Minutos

### 1️⃣ Criar Storage no Firebase

- Abra: https://console.firebase.google.com/
- Projeto: **repositorio-proguema**
- Menu: **Build → Storage**
- Botão: **Começar**
- Modo: **Teste** (test mode)
- Região: **southamerica-east1** (Brasil)
- Clique: **Criado**

⏳ *Aguarde 1-2 minutos*

---

### 2️⃣ Configurar Regras (Rules)

Após criado, clique em **Regras** e cole isto:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /documents/{allPaths=**} {
      allow read: if true;
      allow write: if request.resource.size < 52428800;
    }
  }
}
```

Clique: **Publicar**

---

### 3️⃣ Voltar ao Projeto

```bash
# Pressione Ctrl+C
npm run dev
```

---

### 4️⃣ Testar Upload

1. Acesse: http://localhost:3001
2. Menu: **Upload de Documentos**
3. Selecione um **PDF** ou **DOCX**
4. Preencha os campos
5. Clique: **Enviar**

Se funcionar, você verá:
```
✅ Documento enviado com sucesso!
```

---

## 📋 Checklist

- [ ] Storage criado no Firebase?
- [ ] Regras publicadas?
- [ ] Esperou 1-2 minutos?
- [ ] Servidor rodando em `npm run dev`?
- [ ] Arquivo é PDF/DOCX/XLSX?
- [ ] Arquivo < 50MB?

---

## 🐛 Se Não Funcionar

**Abra o console do navegador (F12)** e procure por erros vermelho

Copie o erro completo e tente novamente

---

**Pronto? Bora testar! 🎉**
