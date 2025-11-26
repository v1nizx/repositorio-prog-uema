# 🔴 ERRO: Firebase Storage 404

## Problema
```
Firebase Storage: An unknown error occurred
Status: 404
```

Isso significa que o **Firebase Storage não foi criado** ou as **regras de segurança estão incorretas**.

## Solução Completa

### PASSO 1: Criar o Firebase Storage

1. Acesse: https://console.firebase.google.com/
2. Selecione: **repositorio-proguema**
3. No menu esquerdo, vá para: **Build → Storage**
4. Clique em: **Começar** (Get Started)
5. Na janela que aparecer:
   - Modo: **Começar no modo de teste** (Start in test mode)
   - Clique: **Próximo**
6. Localização: **southamerica-east1** (São Paulo - mais próximo do Brasil)
7. Clique: **Criado** (Done/Create)

Aguarde 1-2 minutos para o Storage ser criado.

---

### PASSO 2: Configurar as Regras de Segurança do Storage

Após criar o Storage:

1. Clique na aba: **Regras** (Rules)
2. Apague tudo que estiver lá
3. Cole EXATAMENTE isto:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /documents/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null &&
                      request.resource.size < 52428800 &&
                      (request.resource.contentType.matches('application/pdf') ||
                       request.resource.contentType.matches('application/vnd\\..*') ||
                       request.resource.contentType.matches('application/.*xml'));
    }
  }
}
```

4. Clique: **Publicar** (Publish)

Aguarde a confirmação.

---

### PASSO 3: Verificar as Credenciais

Seu `.env.local` deve ter:

```env
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=repositorio-proguema.firebasestorage.app
```

✅ Verifique se está **exatamente assim** (com `.firebasestorage.app` no final)

---

### PASSO 4: Testar

1. Volte ao terminal
2. Pressione `Ctrl+C` para parar o servidor
3. Execute:
   ```bash
   npm run dev
   ```
4. Acesse: http://localhost:3001
5. Vá para: **Upload de Documentos**
6. Selecione um arquivo PDF/DOCX/XLSX
7. Preencha os campos
8. Clique: **Enviar Documento**

---

## Checklist de Verificação

- [ ] Firebase Storage foi criado?
- [ ] Regras de Storage foram publicadas?
- [ ] `.env.local` tem `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` correto?
- [ ] Você aguardou 1-2 minutos após criar o Storage?
- [ ] Seu arquivo é PDF, DOCX ou XLSX?
- [ ] Seu arquivo tem menos de 50MB?

---

## Se Ainda Não Funcionar

### Debug no Console do Navegador (F12):

1. Abra: http://localhost:3001
2. Pressione: **F12** (abrir console)
3. Vá para aba: **Console**
4. Tente fazer um upload
5. Procure por erros (devem ser vermelhos)
6. Copie o erro completo

### Erros Comuns:

| Erro | Causa | Solução |
|------|-------|---------|
| `storage/bucket-not-found` | Storage não criado | Criar Storage no Firebase Console |
| `storage/unauthorized` | Regras muito restritivas | Atualizar regras conforme acima |
| `storage/object-not-found` | Caminho errado | Verificar se `documents/` existe |
| `storage/invalid-argument` | Tipo de arquivo não suportado | Usar PDF, DOCX ou XLSX |

---

## Arquivo Mínimo para Teste

Use este arquivo PDF simples para testar:

1. Crie um arquivo vazio chamado `teste.pdf`
2. Ou use um PDF que já tenha
3. Tamanho: qualquer coisa menor que 50MB
4. Nome: qualquer coisa

Depois de fazer upload com sucesso, você verá:
- ✅ Mensagem de sucesso no navegador
- ✅ Arquivo no Firebase Storage Console
- ✅ Documento no Firestore Console
- ✅ Download funcionando

---

**Próximo passo após isso funcionar:**
- Testar listagem de documentos
- Testar download
- Testar arquivamento e exclusão
