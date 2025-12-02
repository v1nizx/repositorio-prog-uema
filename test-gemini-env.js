#!/usr/bin/env node
/**
 * Script para testar se a variável de ambiente GEMINI_API_KEY está configurada corretamente
 * Execute: node test-gemini-env.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuração do Gemini API Key\n');

// Ler .env.local manualmente
const envPath = path.join(__dirname, '.env.local');
let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf-8');
}

// Procurar pela linha GEMINI_API_KEY
const lines = envContent.split('\n');
const geminiLine = lines.find(line => line.startsWith('GEMINI_API_KEY'));

console.log('📌 Arquivo .env.local encontrado:', fs.existsSync(envPath) ? '✅ Sim' : '❌ Não');

if (geminiLine) {
  console.log('📌 GEMINI_API_KEY encontrada em .env.local:', '✅ Sim');
  console.log('   Linha:', geminiLine.substring(0, 50) + '...');
  
  // Extrair o valor
  const match = geminiLine.match(/GEMINI_API_KEY=(.+)/);
  if (match) {
    const value = match[1].trim().replace(/^["']|["']$/g, '');
    console.log(`   Primeiros 10 caracteres: ${value.substring(0, 10)}...`);
    console.log(`   Tamanho total: ${value.length} caracteres`);
    console.log(`   Começa com 'AIza': ${value.startsWith('AIza') ? '✅ Sim' : '❌ Não'}`);
  }
} else {
  console.log('📌 GEMINI_API_KEY em .env.local:', '❌ Não encontrada');
  console.log('   Por favor, adicione a seguinte linha ao .env.local:');
  console.log('   GEMINI_API_KEY=sua_chave_aqui');
}

console.log('\n📦 Verificando instalação do @google/generative-ai...');

try {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  console.log('✅ Pacote @google/generative-ai está instalado');
} catch (error) {
  console.error('❌ Pacote não encontrado. Execute: npm install @google/generative-ai');
}

console.log('\n✨ Verificação concluída!\n');

