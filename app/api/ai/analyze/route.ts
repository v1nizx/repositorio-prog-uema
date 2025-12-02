import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = 'force-dynamic';

// Lazy initialization - não inicializa no build
let genAI: GoogleGenerativeAI | null = null;

function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY não configurada no servidor');
    }
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
    const body = await request.json();
    const { query } = body;

    console.log('📥 Recebida query:', query);

    if (!query || typeof query !== 'string') {
      console.warn('⚠️ Query inválida recebida');
      return Response.json(
        { error: 'Query inválida' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY não disponível em process.env');
      return Response.json(
        { 
          error: 'GEMINI_API_KEY não configurada no servidor',
          details: 'Por favor, configure a variável de ambiente GEMINI_API_KEY'
        },
        { status: 500 }
      );
    }

    console.log('✅ GEMINI_API_KEY encontrada');

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

    console.log('🤖 Enviando para Gemini...');
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    console.log('📝 Resposta recebida do Gemini');

    // Extrair JSON da resposta
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('❌ JSON não encontrado na resposta:', text.substring(0, 200));
      return Response.json(
        { error: 'Não foi possível processar a resposta da IA' },
        { status: 500 }
      );
    }

    const analysis = JSON.parse(jsonMatch[0]);
    console.log('✅ Análise completa:', analysis.interpretation);

    return Response.json(analysis);
  } catch (error) {
    console.error('❌ Erro ao analisar query:', error);
    
    let errorMessage = 'Erro ao processar consulta';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return Response.json(
      { 
        error: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
