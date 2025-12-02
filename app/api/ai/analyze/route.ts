import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const dynamic = 'force-dynamic';

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

    if (!query || typeof query !== 'string') {
      return Response.json(
        { error: 'Query inválida' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: 'GEMINI_API_KEY não configurada no servidor' },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-pro',
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
  } catch (error) {
    console.error('Erro ao analisar query:', error);
    return Response.json(
      { error: 'Erro ao processar consulta' },
      { status: 500 }
    );
  }
}
