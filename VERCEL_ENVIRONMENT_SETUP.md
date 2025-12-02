# Configuração do Vercel - Gemini + Firebase

## Resumo das Correções

O projeto foi otimizado com **lazy initialization** para evitar erros durante o build quando variáveis de ambiente não estão disponíveis.

### ✅ Correções Implementadas

1. **Gemini API** (`/app/api/ai/analyze/route.ts`)
   - Implementado lazy initialization do `GoogleGenerativeAI`
   - Getter function `getGenAI()` que inicializa apenas quando necessário
   - Modelo atualizado para `gemini-2.5-flash` (último modelo disponível)

2. **Firebase Admin** (`/src/config/firebase-admin.config.ts`)
   - Refatorado para lazy initialization completa
   - Função `initializeFirebase()` é chamada apenas quando precisa acessar Firestore/Storage
   - Não tenta inicializar durante o build se as variáveis não existem

## Variáveis de Ambiente Necessárias

### No Vercel (Production)

Adicione as seguintes variáveis no Vercel Dashboard → Settings → Environment Variables:

```
GEMINI_API_KEY=AIzaSyByYEcwZOZRxhJzQ6te0W2i45X6kDtqGAQ

FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"repositorio-proguema",...}

FIREBASE_PROJECT_ID=repositorio-proguema

FIREBASE_STORAGE_BUCKET=repositorio-proguema.appspot.com
```

**Nota:** Remova as aspas duplas da chave Gemini ao copiar.

### Localmente (.env.local)

```
# API Key Gemini
GEMINI_API_KEY=AIzaSyByYEcwZOZRxhJzQ6te0W2i45X6kDtqGAQ

# Firebase Configuration (Client)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Firebase Admin Configuration (Server)
FIREBASE_PROJECT_ID=repositorio-proguema
FIREBASE_STORAGE_BUCKET=repositorio-proguema.appspot.com
FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'

# API Base URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Como Testar

### Teste Local

```bash
# Verificar configuração da chave
node test-gemini-env.js

# Validar chave com Google
node validate-gemini-key.js

# Testar API
node test-gemini-api.js
```

### Build de Produção

```bash
npm run build
# Deve completar sem erros mesmo com variáveis faltando
```

## Fluxo de Inicialização

### Desenvolvimento
1. Next.js inicia
2. Firebase Admin tenta inicializar se `FIREBASE_SERVICE_ACCOUNT_JSON` existe
3. API routes estão prontas
4. Gemini é inicializado apenas quando requisição chega ao `/api/ai/analyze`

### Produção (Vercel)
1. Build passa sem requerer Firebase/Gemini configuradas
2. Em runtime, quando precisa Firebase/Gemini, inicializa se variáveis existem
3. Se faltar variável, retorna erro claro ao usuário

## Modelos Gemini Disponíveis

Validado com a chave atual:
- `gemini-2.5-flash` ✅ (recomendado - mais rápido)
- `gemini-2.5-pro`
- `gemini-2.0-flash`
- `gemini-2.0-flash-001`

## Troubleshooting

### Build falha com "GEMINI_API_KEY não configurada"
- ❌ Não deve mais acontecer com as novas correções
- ✅ Build agora passa mesmo sem a chave

### API retorna "GEMINI_API_KEY não configurada no servidor"
- Verificar se a variável foi adicionada no Vercel Dashboard
- Verificar se o deploy foi refeito após adicionar a variável
- Usar `node test-gemini-env.js` para debugging

### Firebase retorna erro no deploy
- Adicionar `FIREBASE_SERVICE_ACCOUNT_JSON` no Vercel Dashboard
- Ou remover chamadas a Firebase se não será usado em produção
- Verificar formato do JSON (deve ser válido JSON)

## Status

✅ Build local: Funcionando
✅ API local: Funcionando
✅ Gemini API: Validada e funcionando
⏳ Deploy Vercel: Aguardando configuração das variáveis de ambiente
