interface QueryAnalysisResult {
  interpretation: string;
  entities: {
    courses?: string[];
    documentTypes?: string[];
    dateRange?: string;
    sectors?: string[];
    status?: string[];
    keywords?: string[];
  };
  filters: {
    label: string;
    value: string;
  }[];
  sqlQuery: string;
}

export async function analyzeQueryWithGemini(userQuery: string): Promise<QueryAnalysisResult> {
  try {
    console.log('🔍 Iniciando análise com Gemini para:', userQuery);
    
    const response = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: userQuery }),
    });

    console.log('📡 Resposta do servidor:', response.status, response.statusText);

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Erro retornado pela API:', error);
      throw new Error(error.error || error.details || 'Erro ao processar consulta');
    }

    const analysis: QueryAnalysisResult = await response.json();
    console.log('✅ Análise concluída com sucesso');
    return analysis;
  } catch (error) {
    console.error('❌ Erro ao analisar query com Gemini:', error);
    
    if (error instanceof Error) {
      console.error('   Mensagem:', error.message);
      console.error('   Stack:', error.stack);
    }
    
    throw error;
  }
}

export async function generateSearchResults(
  analysis: QueryAnalysisResult
): Promise<any[]> {
  // Para agora, vamos retornar um array vazio
  // Em produção, isso seria conectado a um banco de dados real
  return [];
}
