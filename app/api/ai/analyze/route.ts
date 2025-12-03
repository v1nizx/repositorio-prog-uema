import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = 'force-dynamic';

// Validar que a chave existe no início
function validateApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error(
      'GEMINI_API_KEY não configurada. Configure em .env.local com uma chave válida de https://aistudio.google.com/apikey'
    );
  }
  
  // Validações básicas de segurança
  if (apiKey.includes('undefined') || apiKey.includes('null')) {
    throw new Error('GEMINI_API_KEY contém valor inválido');
  }
  
  return apiKey;
}

// Lazy initialization com validação
let genAI: GoogleGenerativeAI | null = null;

function getGenAI() {
  if (!genAI) {
    const apiKey = validateApiKey();
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

const systemPrompt = `Você é um assistente especializado em análise de consultas para um sistema de gestão de documentos acadêmicos da UEMA.

Sua tarefa é:
1. Interpretar consultas em linguagem natural sobre documentos
2. Extrair entidades relevantes (tipos de documentos, cursos, setores, períodos, status)
3. Gerar filtros aplicáveis
4. Gerar uma query SQL otimizada para PostgreSQL

Tipos de documentos válidos: PPC, Resolução, Relatório, Processo, Ofício, Memorando, Parecer
Cursos válidos: Ciência da Computação, Engenharia de Software, Sistemas de Informação, Engenharia Civil, Engenharia Mecânica, Engenharia Elétrica
Setores válidos: Coordenação de Computação, Coordenação de Engenharia, Secretaria Geral, CPA, Reitoria
Status válidos: Aprovado, Vigente, Publicado, Em Revisão, Pendente, Rascunho

Sempre retorne a resposta em JSON com a seguinte estrutura:
{
  "interpretation": "descrição clara da busca",
  "entities": {
    "courses": ["lista de cursos identificados"],
    "documentTypes": ["lista de tipos de documentos"],
    "dateRange": "período identificado",
    "sectors": ["lista de setores"],
    "status": ["lista de status"],
    "keywords": ["palavras-chave relevantes"]
  },
  "filters": [
    {"label": "nome do filtro", "value": "valor do filtro"}
  ],
  "sqlQuery": "SELECT ... FROM documentos WHERE ..."
}

Dicas para gerar SQL eficiente:
- Use ILIKE para buscas case-insensitive
- Aplique filtros DATE com CURRENT_DATE quando apropriado
- Ordene por relevância (data de atualização, status)
- Limite resultados a 50 registros
- Use JOINs com tabelas de cursos quando necessário`;

export async function POST(request: Request) {
  try {
    // Validar chave da API imediatamente
    const apiKey = validateApiKey();

    const body = await request.json();
    const { query } = body;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return Response.json(
        { error: 'Query inválida ou vazia' },
        { status: 400 }
      );
    }

    if (query.length > 1000) {
      return Response.json(
        { error: 'Query muito longa (máx 1000 caracteres)' },
        { status: 400 }
      );
    }

    const ai = getGenAI();
    const model = ai.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    const prompt = `${systemPrompt}

Consulta do usuário: "${query}"

Analise a consulta e retorne um JSON válido com a análise completa.`;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Extrair JSON da resposta
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return Response.json(
          { error: 'Não foi possível processar a resposta da IA' },
          { status: 500 }
        );
      }

      const analysis = JSON.parse(jsonMatch[0]);
      return Response.json(analysis);
    } catch (geminiError: any) {
      // Verificar se é erro de API key comprometida
      if (geminiError?.status === 403) {
        return Response.json(
          { 
            error: 'API Key comprometida. Gere uma nova chave em https://aistudio.google.com/apikey',
            code: 'API_KEY_COMPROMISED',
            action: 'Gere uma nova chave Gemini e configure em .env.local como GEMINI_API_KEY'
          },
          { status: 403 }
        );
      }
      
      throw geminiError;
    }
  } catch (error) {
    let errorMessage = 'Erro ao processar consulta';
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Mensagens de erro mais amigáveis
      if (errorMessage.includes('GEMINI_API_KEY')) {
        statusCode = 500;
        errorMessage = 'Configuração de API Key inválida. Verifique .env.local';
      }
    }
    
    return Response.json(
      { 
        error: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: statusCode }
    );
  }
}
