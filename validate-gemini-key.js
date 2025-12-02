#!/usr/bin/env node
/**
 * Script para validar a chave de API do Gemini listando modelos disponíveis
 */

const fs = require('fs');
const path = require('path');

async function validateGeminiKey() {
  // Ler .env.local manualmente
  const envPath = path.join(__dirname, '.env.local');
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf-8');
  }

  // Procurar pela linha GEMINI_API_KEY
  const lines = envContent.split('\n');
  const geminiLine = lines.find(line => line.startsWith('GEMINI_API_KEY'));
  
  if (!geminiLine) {
    console.error('❌ GEMINI_API_KEY não encontrada em .env.local');
    return;
  }

  const match = geminiLine.match(/GEMINI_API_KEY=(.+)/);
  if (!match) {
    console.error('❌ Formato de GEMINI_API_KEY inválido');
    return;
  }

  const apiKey = match[1].trim().replace(/^["']|["']$/g, '');

  console.log('🔐 Validando chave Gemini API...');
  console.log(`   Chave: ${apiKey.substring(0, 15)}...${apiKey.substring(apiKey.length - 10)}`);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
    );

    if (!response.ok) {
      console.error(`❌ Erro na validação: ${response.status} ${response.statusText}`);
      const error = await response.json();
      console.error('   Detalhes:', error);
      return;
    }

    const data = await response.json();
    console.log('✅ Chave válida!');
    console.log(`\n📋 Modelos disponíveis (${data.models?.length || 0}):\n`);
    
    if (data.models) {
      data.models.forEach(model => {
        const name = model.name.split('/')[1];
        console.log(`   - ${name}`);
      });
    }
  } catch (error) {
    console.error('❌ Erro ao validar chave:', error.message);
  }
}

validateGeminiKey();
