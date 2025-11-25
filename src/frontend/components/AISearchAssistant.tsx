import { useState } from 'react';
import { Sparkles, Brain, Database, FileText, ArrowRight, Copy, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';

interface QueryAnalysis {
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
  results: {
    id: number;
    title: string;
    type: string;
    course?: string;
    date: string;
    author: string;
    sector: string;
    version: string;
    status: string;
  }[];
}

const exampleQueries = [
  "Quais PPCs foram atualizados nos últimos 6 meses?",
  "Mostre todas as resoluções sobre TCC aprovadas em 2024",
  "Quais documentos da Coordenação de Engenharia precisam de revisão?",
  "Liste os relatórios de avaliação institucional dos últimos 2 anos",
  "PPCs de cursos de computação com status pendente"
];

export function AISearchAssistant() {
  const [query, setQuery] = useState('');
  const [analysis, setAnalysis] = useState<QueryAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);

  const analyzeQuery = async () => {
    if (!query.trim()) return;

    setIsAnalyzing(true);

    // Simular processamento de IA
    setTimeout(() => {
      const mockAnalysis = generateMockAnalysis(query);
      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 1500);
  };

  const generateMockAnalysis = (userQuery: string): QueryAnalysis => {
    const lowerQuery = userQuery.toLowerCase();

    // Análise baseada em padrões comuns
    if (lowerQuery.includes('últimos 6 meses') || lowerQuery.includes('6 meses')) {
      return {
        interpretation: 'Busca por Projetos Pedagógicos de Curso (PPCs) que foram atualizados nos últimos 6 meses, considerando a data atual como referência.',
        entities: {
          documentTypes: ['PPC'],
          dateRange: 'Últimos 6 meses',
          keywords: ['atualizados', 'PPCs']
        },
        filters: [
          { label: 'Tipo de Documento', value: 'PPC' },
          { label: 'Período', value: 'Últimos 6 meses (Set 2024 - Mar 2025)' },
          { label: 'Ordenação', value: 'Data de atualização (mais recente)' }
        ],
        sqlQuery: `SELECT 
  d.id,
  d.titulo,
  d.tipo,
  d.data_atualizacao,
  d.autor,
  d.setor,
  d.versao,
  d.status,
  c.nome_curso
FROM documentos d
LEFT JOIN cursos c ON d.curso_id = c.id
WHERE d.tipo = 'PPC'
  AND d.data_atualizacao >= CURRENT_DATE - INTERVAL '6 months'
ORDER BY d.data_atualizacao DESC;`,
        results: [
          {
            id: 1,
            title: 'PPC - Engenharia de Software 2024',
            type: 'PPC',
            course: 'Engenharia de Software',
            date: '2024-03-15',
            author: 'Prof. Maria Santos',
            sector: 'Coordenação de Engenharia',
            version: '3.2',
            status: 'Aprovado'
          },
          {
            id: 2,
            title: 'PPC - Ciência da Computação 2024',
            type: 'PPC',
            course: 'Ciência da Computação',
            date: '2024-03-10',
            author: 'Prof. Carlos Oliveira',
            sector: 'Coordenação de Computação',
            version: '4.0',
            status: 'Em Revisão'
          },
          {
            id: 3,
            title: 'PPC - Sistemas de Informação 2023',
            type: 'PPC',
            course: 'Sistemas de Informação',
            date: '2023-11-20',
            author: 'Prof. Roberto Lima',
            sector: 'Coordenação de Computação',
            version: '2.8',
            status: 'Aprovado'
          }
        ]
      };
    }

    if (lowerQuery.includes('resolução') && lowerQuery.includes('tcc')) {
      return {
        interpretation: 'Busca por documentos do tipo Resolução relacionados a Trabalhos de Conclusão de Curso (TCC) que foram aprovados durante o ano de 2024.',
        entities: {
          documentTypes: ['Resolução'],
          keywords: ['TCC', 'Trabalho de Conclusão'],
          status: ['Aprovado', 'Vigente'],
          dateRange: '2024'
        },
        filters: [
          { label: 'Tipo de Documento', value: 'Resolução' },
          { label: 'Assunto', value: 'TCC (Trabalho de Conclusão)' },
          { label: 'Status', value: 'Aprovado / Vigente' },
          { label: 'Ano', value: '2024' }
        ],
        sqlQuery: `SELECT 
  d.id,
  d.titulo,
  d.tipo,
  d.data_aprovacao,
  d.autor,
  d.setor,
  d.versao,
  d.status
FROM documentos d
WHERE d.tipo = 'Resolução'
  AND (d.titulo ILIKE '%TCC%' OR d.titulo ILIKE '%Trabalho de Conclusão%')
  AND d.status IN ('Aprovado', 'Vigente')
  AND EXTRACT(YEAR FROM d.data_aprovacao) = 2024
ORDER BY d.data_aprovacao DESC;`,
        results: [
          {
            id: 1,
            title: 'Resolução 045/2024 - Normas de TCC',
            type: 'Resolução',
            date: '2024-02-20',
            author: 'Conselho Universitário',
            sector: 'Secretaria Geral',
            version: '1.0',
            status: 'Vigente'
          },
          {
            id: 2,
            title: 'Resolução 023/2024 - Prazos de TCC',
            type: 'Resolução',
            date: '2024-01-15',
            author: 'Conselho Universitário',
            sector: 'Secretaria Geral',
            version: '1.0',
            status: 'Aprovado'
          }
        ]
      };
    }

    if (lowerQuery.includes('coordenação de engenharia') || lowerQuery.includes('engenharia')) {
      return {
        interpretation: 'Busca por documentos vinculados à Coordenação de Engenharia que possuem status indicando necessidade de revisão ou atualização.',
        entities: {
          sectors: ['Coordenação de Engenharia'],
          status: ['Em Revisão', 'Pendente'],
          keywords: ['revisão', 'engenharia']
        },
        filters: [
          { label: 'Setor', value: 'Coordenação de Engenharia' },
          { label: 'Status', value: 'Em Revisão / Pendente' },
          { label: 'Prioridade', value: 'Documentos que precisam de ação' }
        ],
        sqlQuery: `SELECT 
  d.id,
  d.titulo,
  d.tipo,
  d.data_atualizacao,
  d.autor,
  d.setor,
  d.versao,
  d.status,
  d.prazo_revisao
FROM documentos d
WHERE d.setor = 'Coordenação de Engenharia'
  AND d.status IN ('Em Revisão', 'Pendente')
ORDER BY d.prazo_revisao ASC NULLS LAST, d.data_atualizacao DESC;`,
        results: [
          {
            id: 1,
            title: 'PPC - Engenharia Civil 2023',
            type: 'PPC',
            date: '2023-08-10',
            author: 'Prof. Ana Silva',
            sector: 'Coordenação de Engenharia',
            version: '2.5',
            status: 'Pendente'
          },
          {
            id: 2,
            title: 'Relatório de Reconhecimento - Eng. Mecânica',
            type: 'Processo',
            date: '2024-01-20',
            author: 'Comissão de Reconhecimento',
            sector: 'Coordenação de Engenharia',
            version: '1.3',
            status: 'Em Revisão'
          }
        ]
      };
    }

    if (lowerQuery.includes('relatório') && (lowerQuery.includes('avaliação') || lowerQuery.includes('institucional'))) {
      return {
        interpretation: 'Busca por relatórios de avaliação institucional publicados nos últimos 2 anos (2023-2024).',
        entities: {
          documentTypes: ['Relatório'],
          keywords: ['avaliação institucional', 'CPA'],
          dateRange: 'Últimos 2 anos',
          status: ['Publicado', 'Aprovado']
        },
        filters: [
          { label: 'Tipo de Documento', value: 'Relatório' },
          { label: 'Categoria', value: 'Avaliação Institucional' },
          { label: 'Período', value: '2023-2024' },
          { label: 'Status', value: 'Publicado' }
        ],
        sqlQuery: `SELECT 
  d.id,
  d.titulo,
  d.tipo,
  d.data_publicacao,
  d.autor,
  d.setor,
  d.versao,
  d.status
FROM documentos d
WHERE d.tipo = 'Relatório'
  AND (d.titulo ILIKE '%avaliação institucional%' OR d.setor = 'CPA')
  AND d.data_publicacao >= CURRENT_DATE - INTERVAL '2 years'
  AND d.status IN ('Publicado', 'Aprovado')
ORDER BY d.data_publicacao DESC;`,
        results: [
          {
            id: 1,
            title: 'Relatório de Avaliação Institucional 2023',
            type: 'Relatório',
            date: '2024-01-10',
            author: 'CPA',
            sector: 'Comissão Própria de Avaliação',
            version: '2.1',
            status: 'Publicado'
          },
          {
            id: 2,
            title: 'Relatório de Avaliação Institucional 2022',
            type: 'Relatório',
            date: '2023-02-15',
            author: 'CPA',
            sector: 'Comissão Própria de Avaliação',
            version: '2.0',
            status: 'Publicado'
          }
        ]
      };
    }

    if (lowerQuery.includes('computação') && lowerQuery.includes('pendente')) {
      return {
        interpretation: 'Busca por PPCs de cursos relacionados à área de Computação (Ciência da Computação, Sistemas de Informação, etc.) com status pendente de aprovação ou atualização.',
        entities: {
          documentTypes: ['PPC'],
          courses: ['Ciência da Computação', 'Sistemas de Informação', 'Engenharia de Computação'],
          status: ['Pendente'],
          keywords: ['computação', 'pendente']
        },
        filters: [
          { label: 'Tipo de Documento', value: 'PPC' },
          { label: 'Área', value: 'Computação' },
          { label: 'Status', value: 'Pendente' },
          { label: 'Ordenação', value: 'Mais urgentes primeiro' }
        ],
        sqlQuery: `SELECT 
  d.id,
  d.titulo,
  d.tipo,
  d.data_atualizacao,
  d.autor,
  d.setor,
  d.versao,
  d.status,
  c.nome_curso,
  c.area
FROM documentos d
JOIN cursos c ON d.curso_id = c.id
WHERE d.tipo = 'PPC'
  AND c.area = 'Computação'
  AND d.status = 'Pendente'
ORDER BY d.prazo_revisao ASC, d.data_atualizacao ASC;`,
        results: [
          {
            id: 1,
            title: 'PPC - Sistemas de Informação 2023',
            type: 'PPC',
            course: 'Sistemas de Informação',
            date: '2023-11-20',
            author: 'Prof. Roberto Lima',
            sector: 'Coordenação de Computação',
            version: '2.8',
            status: 'Pendente'
          }
        ]
      };
    }

    // Resposta genérica
    return {
      interpretation: `Busca geral por documentos relacionados a: "${userQuery}". O sistema irá procurar correspondências no título, conteúdo e metadados.`,
      entities: {
        keywords: userQuery.split(' ').filter(w => w.length > 3)
      },
      filters: [
        { label: 'Tipo de Busca', value: 'Texto completo' },
        { label: 'Campos', value: 'Título, Conteúdo, Metadados' }
      ],
      sqlQuery: `SELECT 
  d.id,
  d.titulo,
  d.tipo,
  d.data_atualizacao,
  d.autor,
  d.setor,
  d.versao,
  d.status,
  ts_rank(d.search_vector, plainto_tsquery('portuguese', $1)) AS relevancia
FROM documentos d
WHERE d.search_vector @@ plainto_tsquery('portuguese', $1)
ORDER BY relevancia DESC, d.data_atualizacao DESC
LIMIT 50;`,
      results: []
    };
  };

  const copySQL = () => {
    if (analysis?.sqlQuery) {
      navigator.clipboard.writeText(analysis.sqlQuery);
      setSqlCopied(true);
      setTimeout(() => setSqlCopied(false), 2000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aprovado':
      case 'Vigente':
      case 'Publicado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Em Revisão':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Pendente':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-600 rounded-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-gray-900">Assistente de Busca Inteligente</h3>
            <p className="text-sm text-gray-600">
              Faça perguntas em linguagem natural sobre documentos acadêmicos
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Textarea
              placeholder="Ex: Quais PPCs foram atualizados nos últimos 6 meses?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={3}
              className="w-full resize-none"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={analyzeQuery}
              disabled={!query.trim() || isAnalyzing}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                  Analisando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analisar Consulta
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setQuery('');
                setAnalysis(null);
              }}
            >
              Limpar
            </Button>
          </div>

          <div>
            <p className="text-xs text-gray-600 mb-2">Exemplos de consultas:</p>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(example)}
                  className="text-xs bg-white border border-purple-200 px-3 py-1.5 rounded-full hover:bg-purple-50 transition-colors text-gray-700"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {analysis && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Interpretação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                Interpretação da Consulta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="bg-purple-50 border-purple-200">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <AlertDescription className="text-purple-900">
                  {analysis.interpretation}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Entidades Identificadas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-blue-600" />
                Entidades Identificadas
              </CardTitle>
              <CardDescription>
                Elementos extraídos automaticamente da sua consulta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.entities.documentTypes && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Tipos de Documento:</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.entities.documentTypes.map((type, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.entities.courses && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Cursos:</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.entities.courses.map((course, index) => (
                        <Badge key={index} variant="outline" className="bg-green-100 text-green-800 border-green-200">
                          {course}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.entities.sectors && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Setores:</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.entities.sectors.map((sector, index) => (
                        <Badge key={index} variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                          {sector}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.entities.status && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Status:</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.entities.status.map((status, index) => (
                        <Badge key={index} variant="outline" className={getStatusColor(status)}>
                          {status}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.entities.dateRange && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Período:</p>
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                      {analysis.entities.dateRange}
                    </Badge>
                  </div>
                )}

                {analysis.entities.keywords && analysis.entities.keywords.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Palavras-chave:</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.entities.keywords.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Filtros Aplicados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-green-600" />
                Filtros Aplicados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysis.filters.map((filter, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">{filter.label}</p>
                      <p className="text-sm text-gray-900">{filter.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Query SQL Gerada */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  Query SQL Otimizada
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copySQL}
                  className="flex items-center gap-2"
                >
                  {sqlCopied ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copiar SQL
                    </>
                  )}
                </Button>
              </div>
              <CardDescription>
                Query gerada automaticamente baseada na sua consulta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                  {analysis.sqlQuery}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Resultados */}
          {analysis.results.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Resultados da Busca
                </CardTitle>
                <CardDescription>
                  {analysis.results.length} documento(s) encontrado(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.results.map((result) => (
                    <div
                      key={result.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-gray-900">{result.title}</h4>
                            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                              {result.type}
                            </Badge>
                            <Badge variant="outline" className={getStatusColor(result.status)}>
                              {result.status}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                            {result.course && (
                              <span className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                {result.course}
                              </span>
                            )}
                            <span>v{result.version}</span>
                            <span>·</span>
                            <span>{new Date(result.date).toLocaleDateString('pt-BR')}</span>
                            <span>·</span>
                            <span>{result.author}</span>
                            <span>·</span>
                            <span className="text-xs">{result.sector}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Visualizar
                        </Button>
                        <Button variant="outline" size="sm">
                          Baixar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {analysis.results.length === 0 && (
            <Alert>
              <AlertDescription>
                Nenhum resultado encontrado com os critérios especificados. Tente ajustar sua consulta.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}
