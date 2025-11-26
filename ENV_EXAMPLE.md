# Exemplo de Configuração Firebase

Este arquivo mostra como preencher o `.env.local` com suas credenciais do Firebase.

## Passo 1: Acessar Firebase Console

1. Vá para https://console.firebase.google.com/
2. Selecione ou crie um novo projeto
3. Clique em "Configurações do projeto" (ícone de engrenagem)

## Passo 2: Obter Credenciais

Na aba "Aplicativos", clique em "Criar app" e escolha "Web".

Você receberá uma configuração assim:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnopqrst"
};
```

## Passo 3: Preencher .env.local

Crie ou edite o arquivo `.env.local` na raiz do projeto com:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdefghijklmnopqrst

# API Base URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Passo 4: Verificar Conectividade

Execute o projeto:

```bash
npm run dev
```

Se ver erros sobre Firebase, verifique:
1. Variáveis de ambiente preenchidas corretamente
2. Storage e Firestore criados no Firebase
3. Regras de segurança configuradas

## Dicas Importantes

- ⚠️ Estas são variáveis "públicas" (NEXT_PUBLIC_), portanto não incluem segredos sensíveis
- ✅ Safe para commitar no git (use .gitignore se quiser)
- 📝 Cada projeto Firebase tem suas próprias credenciais
- 🔐 As regras de segurança do Firebase protegem seus dados

## Exemplo Real

Se receber do Firebase algo como:

```javascript
{
  apiKey: "AIzaSyDKh1234567890abcdefg",
  authDomain: "meu-projeto-123.firebaseapp.com",
  projectId: "meu-projeto-123",
  storageBucket: "meu-projeto-123.appspot.com",
  messagingSenderId: "987654321098",
  appId: "1:987654321098:web:xyz123abc456def789"
}
```

Seu `.env.local` será:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDKh1234567890abcdefg
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=meu-projeto-123.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=meu-projeto-123
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=meu-projeto-123.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=987654321098
NEXT_PUBLIC_FIREBASE_APP_ID=1:987654321098:web:xyz123abc456def789
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Testes

Para testar a configuração:

```bash
# Verificar se Firebase carrega
npm run dev

# Abrir console (F12) e testar
# Tentar fazer upload de um documento
# Verificar se aparece no Firebase Console > Storage e Firestore
```

---

Após completar, seu sistema de upload estará totalmente funcional! 🎉
