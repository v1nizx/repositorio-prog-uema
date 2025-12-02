#!/usr/bin/env node
/**
 * Script para testar a API de análise com Gemini
 * Execute: node test-gemini-api.js
 */

const fs = require('fs');
const path = require('path');

async function testGeminiAPI() {
  console.log('🧪 Testando API de análise com Gemini\n');
  
  const testQueries = [
    "Quais PPCs foram atualizados nos últimos 6 meses?",
    "Mostre as resoluções sobre TCC",
  ];
  
  const port = 3001; // Pode ser 3000 ou 3001 dependendo da disponibilidade
  const baseUrl = `http://localhost:${port}`;
  
  console.log(`📍 Testando contra: ${baseUrl}\n`);
  
  for (const query of testQueries) {
    console.log(`\n📝 Query: "${query}"`);
    console.log('🔄 Enviando requisição...');
    
    try {
      const response = await fetch(`${baseUrl}/api/ai/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      console.log(`   Status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const error = await response.json();
        console.log('❌ Erro:', error);
        continue;
      }
      
      const analysis = await response.json();
      console.log('✅ Análise recebida:');
      console.log(`   Interpretação: ${analysis.interpretation}`);
      console.log(`   Tipos de documento: ${analysis.entities?.documentTypes?.join(', ') || 'Nenhum'}`);
      console.log(`   Cursos: ${analysis.entities?.courses?.join(', ') || 'Nenhum'}`);
      console.log(`   SQL Query: ${analysis.sqlQuery?.substring(0, 100)}...`);
      
    } catch (error) {
      console.error('❌ Erro na requisição:', error.message);
    }
  }
  
  console.log('\n✨ Testes concluídos!\n');
}

testGeminiAPI().catch(console.error);
