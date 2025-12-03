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
    const response = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: userQuery }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.details || 'Erro ao processar consulta');
    }

    const analysis: QueryAnalysisResult = await response.json();
    return analysis;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Erro ao analisar query com Gemini');
  }
}

export async function generateSearchResults(
  analysis: QueryAnalysisResult
): Promise<any[]> {
  // Para agora, vamos retornar um array vazio
  // Em produção, isso seria conectado a um banco de dados real
  return [];
}
