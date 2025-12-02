# 🚀 Guia de Deploy na Vercel - Configuração de Variáveis de Ambiente

## ⚠️ Problema Atual

O deploy está falhando com o erro:
```
Error: FIREBASE_SERVICE_ACCOUNT_JSON não está configurada na Vercel
```

Isso ocorre porque as variáveis de ambiente locais (`.env.local`) **não são automaticamente sincronizadas** com a Vercel.

## ✅ Solução: Configurar Variáveis na Vercel

### Passo 1: Acessar o Dashboard da Vercel

1. Vá para https://vercel.com/dashboard
2. Selecione seu projeto: **repositorio-prog-uema**
3. Clique em **Settings** → **Environment Variables**

### Passo 2: Adicionar Variáveis de Ambiente

Copie todas as variáveis do seu `.env.local` para a Vercel:

#### Firebase Configuration (Client)
```
NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSyCJjCYc-c6PaSsb7jOLeCgo8G26mEacZOY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = repositorio-proguema.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = repositorio-proguema
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = repositorio-proguema.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 92516090954
NEXT_PUBLIC_FIREBASE_APP_ID = 1:92516090954:web:a2115a0188faeb790692b3
```

#### Firebase Admin Configuration (Server)
```
FIREBASE_PROJECT_ID = repositorio-proguema
FIREBASE_STORAGE_BUCKET = repositorio-proguema.appspot.com
FIREBASE_SERVICE_ACCOUNT_JSON = [copie o valor completo do .env.local]
```

#### Gemini API
```
GEMINI_API_KEY = [sua chave de API]
```

#### API URL
```
NEXT_PUBLIC_API_URL = https://seu-dominio.vercel.app
```

### Passo 3: Adicionar Variáveis na Vercel UI

1. **Environment**: Selecione **Production**, **Preview** e **Development**
2. **Name**: Digite o nome da variável (ex: `FIREBASE_SERVICE_ACCOUNT_JSON`)
3. **Value**: Cole o valor completo

⚠️ **IMPORTANTE**: Para `FIREBASE_SERVICE_ACCOUNT_JSON`, copie o JSON completo do seu `.env.local`

### Passo 4: Deploy

Após adicionar as variáveis:

1. Clique em **Save** para cada variável
2. Vá para **Deployments**
3. Clique nos 3 pontos (...) do deployment mais recente
4. Selecione **Redeploy** para forçar um novo build com as novas variáveis

Ou faça um novo commit no repositório:
```bash
git add .
git commit -m "chore: update environment variables"
git push
```

## 📝 Checklist de Variáveis

- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] `FIREBASE_PROJECT_ID`
- [ ] `FIREBASE_STORAGE_BUCKET`
- [ ] `FIREBASE_SERVICE_ACCOUNT_JSON`
- [ ] `GEMINI_API_KEY`
- [ ] `NEXT_PUBLIC_API_URL`

## 🔐 Segurança

✅ **Variáveis sensíveis (sem `NEXT_PUBLIC_`)** são privadas do servidor
✅ **Variáveis com `NEXT_PUBLIC_`** podem ser expostas ao cliente
✅ **Nunca** adicione `.env.local` ao git (já está em `.gitignore`)

## 🚨 Troubleshooting

### Erro: "Cannot find module 'firebase-service-account.json'"
- Certifique-se de que `FIREBASE_SERVICE_ACCOUNT_JSON` está configurada na Vercel
- Verifique que o JSON é válido (sem quebras de linha indevidas)

### Erro: "Erro ao fazer parse do JSON"
- O JSON pode estar malformado
- Copie exatamente como está no `.env.local`
- Remova aspas extras ou caracteres especiais

### Deploy ainda falhando após configurar variáveis
- Aguarde 5 minutos para a Vercel processar as mudanças
- Tente fazer um novo commit para disparar um novo build
- Verifique os logs: **Deployments** → **função** → **Logs**

## 📚 Referências

- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Firebase Admin SDK Setup](https://firebase.google.com/docs/admin/setup)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

**Status**: 🔧 Configuração de Deploy
**Próximos Passos**: Adicionar variáveis na Vercel e fazer redeploy
