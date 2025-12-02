#!/bin/bash
# Script para verificar variáveis de ambiente necessárias

echo "🔍 Verificando Variáveis de Ambiente"
echo "===================================="
echo ""

missing_vars=0

# Firebase Configuration (Client)
for var in "NEXT_PUBLIC_FIREBASE_API_KEY" "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" "NEXT_PUBLIC_FIREBASE_PROJECT_ID" "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"; do
    if [ -z "${!var}" ]; then
        echo "❌ Missing: $var"
        missing_vars=$((missing_vars + 1))
    else
        echo "✅ Configured: $var"
    fi
done

# Firebase Admin Configuration (Server)
for var in "FIREBASE_PROJECT_ID" "FIREBASE_STORAGE_BUCKET" "FIREBASE_SERVICE_ACCOUNT_JSON"; do
    if [ -z "${!var}" ]; then
        echo "❌ Missing: $var"
        missing_vars=$((missing_vars + 1))
    else
        echo "✅ Configured: $var"
    fi
done

# Gemini API
if [ -z "$GEMINI_API_KEY" ]; then
    echo "❌ Missing: GEMINI_API_KEY"
    missing_vars=$((missing_vars + 1))
else
    echo "✅ Configured: GEMINI_API_KEY"
fi

# API URL
if [ -z "$NEXT_PUBLIC_API_URL" ]; then
    echo "⚠️  Missing: NEXT_PUBLIC_API_URL (usando http://localhost:3000)"
else
    echo "✅ Configured: NEXT_PUBLIC_API_URL"
fi

echo ""
if [ $missing_vars -eq 0 ]; then
    echo "✅ Todas as variáveis necessárias estão configuradas!"
    exit 0
else
    echo "❌ $missing_vars variável(is) não configurada(s)"
    echo ""
    echo "📝 Configure as variáveis em:"
    echo "   - Desenvolvimento: .env.local"
    echo "   - Produção (Vercel): https://vercel.com/dashboard → Settings → Environment Variables"
    exit 1
fi
