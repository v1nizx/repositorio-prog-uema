# 🔧 Solução: Erro de Deploy na Vercel

## 🚨 Problema

```
Error: FIREBASE_SERVICE_ACCOUNT_JSON não está configurada na Vercel
Build error occurred
Error: Failed to collect page data for /api/auth/login
```

## 🎯 Causa

As variáveis de ambiente configuradas localmente no `.env.local` **NÃO são automaticamente sincronizadas** com a Vercel. Durante o build, a Vercel não conseguia inicializar o Firebase Admin porque a variável `FIREBASE_SERVICE_ACCOUNT_JSON` não estava definida.

## ✅ Soluções Implementadas

### 1. **Melhorada Inicialização do Firebase** 
   - Arquivo: `/src/config/firebase-admin.config.ts`
   - Agora não lança erro durante o build se Firebase não estiver configurado
   - Usa lazy loading com funções `getFirestoreDb()` e `getStorageBucket()`
   - Permite build em desenvolvimento sem configuração completa do Firebase

### 2. **Atualizada Rota de Login**
   - Arquivo: `/app/api/auth/login/route.ts`
   - Agora usa `getFirestoreDb()` para acessar o Firestore
   - Melhor tratamento de erros

### 3. **Criado Guia de Deploy**
   - Arquivo: `/VERCEL_SETUP.md`
   - Instruções passo a passo para configurar variáveis na Vercel
   - Checklist de todas as variáveis necessárias

### 4. **Script de Verificação**
   - Arquivo: `/check-env.sh`
   - Verifica se todas as variáveis estão configuradas
   - Uso: `bash check-env.sh`

## 🚀 Como Resolver

### Para Desenvolvimento Local ✅
Já está configurado em `.env.local`

### Para Deploy na Vercel 🔧

1. **Acesse o Dashboard da Vercel**
   ```
   https://vercel.com/dashboard
   ```

2. **Selecione seu projeto** `repositorio-prog-uema`

3. **Vá para Settings → Environment Variables**

4. **Adicione as seguintes variáveis:**

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSyCJjCYc-c6PaSsb7jOLeCgo8G26mEacZOY
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = repositorio-proguema.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID = repositorio-proguema
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = repositorio-proguema.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 92516090954
   NEXT_PUBLIC_FIREBASE_APP_ID = 1:92516090954:web:a2115a0188faeb790692b3
   FIREBASE_PROJECT_ID = repositorio-proguema
   FIREBASE_STORAGE_BUCKET = repositorio-proguema.appspot.com
   FIREBASE_SERVICE_ACCOUNT_JSON = [copie do .env.local]
   GEMINI_API_KEY = [sua chave]
   NEXT_PUBLIC_API_URL = https://seu-dominio.vercel.app
   ```

5. **Salve as alterações**

6. **Redeploy o projeto**
   - Vá para **Deployments**
   - Clique nos 3 pontos (...) do último deploy
   - Selecione **Redeploy**

Ou faça um novo commit:
```bash
git add .
git commit -m "fix: configure Firebase for production"
git push
```

## 📊 Status

- ✅ Firebase configurado para funcionar sem erros de build
- ✅ Gemini integrado e funcionando localmente
- ⏳ Pendente: Configurar variáveis na Vercel e fazer redeploy
- ⏳ Pendente: Testar deploy em produção

## 🔍 Próximos Passos

1. Configure as variáveis de ambiente na Vercel (veja instruções acima)
2. Faça um novo deploy
3. Teste a aplicação em produção
4. Valide o login e busca com Gemini

## 📞 Se tiver dúvidas

- Consulte `/VERCEL_SETUP.md` para instruções detalhadas
- Execute `bash check-env.sh` para verificar variáveis locais
- Verifique logs da Vercel: **Deployments → Função → Logs**
