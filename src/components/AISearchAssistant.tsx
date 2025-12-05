import { useState } from 'react';
import { Sparkles, Brain, Database, FileText, ArrowRight, Copy, Check, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { analyzeQueryWithGemini, generateSearchResults } from '@/services/gemini.service';

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
  const [error, setError] = useState<string | null>(null);

  const analyzeQuery = async () => {
    if (!query.trim()) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const analysisResult = await analyzeQueryWithGemini(query);
      const searchResults = await generateSearchResults(analysisResult);

      const finalAnalysis: QueryAnalysis = {
        interpretation: analysisResult.interpretation,
        entities: analysisResult.entities,
        filters: analysisResult.filters,
        sqlQuery: analysisResult.sqlQuery,
        results: searchResults || [],
      };

      setAnalysis(finalAnalysis);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao analisar consulta';
      setError(`Erro ao processar sua busca: ${errorMessage}`);
    } finally {
      setIsAnalyzing(false);
    }
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
            <Brain className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Assistente de Busca Inteligente</h2>
            <p className="text-sm text-gray-600">
              Faça perguntas em linguagem natural sobre documentos acadêmicos
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label 
              htmlFor="ai-search-textarea"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Sua Pergunta
            </label>
            <Textarea
              id="ai-search-textarea"
              placeholder="Ex: Quais PPCs foram atualizados nos últimos 6 meses?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={3}
              className="w-full resize-none"
              disabled={isAnalyzing}
              aria-required="true"
              aria-label="Digite sua pergunta sobre documentos acadêmicos"
              aria-describedby="ai-search-help"
            />
            <p 
              id="ai-search-help"
              className="text-xs text-gray-500 mt-1"
            >
              Use linguagem natural para fazer sua pergunta sobre documentos académicos.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={analyzeQuery}
              disabled={!query.trim() || isAnalyzing}
              className="bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              aria-busy={isAnalyzing}
              aria-label={isAnalyzing ? 'Analisando sua pergunta com IA' : 'Analisar pergunta com Gemini'}
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-pulse" aria-hidden="true" />
                  Analisando com IA...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" aria-hidden="true" />
                  Analisar com Gemini
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setQuery('');
                setAnalysis(null);
                setError(null);
              }}
              disabled={isAnalyzing}
              aria-label="Limpar consulta"
              className="focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Limpar
            </Button>
          </div>

          <div>
            <p 
              className="text-xs text-gray-600 mb-2"
              id="example-queries"
            >
              Exemplos de consultas:
            </p>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(example)}
                  className="text-xs bg-white border border-purple-200 px-3 py-1.5 rounded-full hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 transition-colors text-gray-700"
                  aria-label={`Usar exemplo: ${example}`}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <Alert 
          className="bg-red-50 border-red-200 animate-in fade-in slide-in-from-bottom-4 duration-500"
          role="alert"
          aria-live="polite"
          aria-atomic="true"
        >
          <AlertCircle className="w-4 h-4 text-red-600" aria-hidden="true" />
          <AlertDescription className="text-red-700">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {analysis && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" aria-hidden="true" />
                Interpretação da Consulta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="bg-purple-50 border-purple-200">
                <Sparkles className="w-4 h-4 text-purple-600" aria-hidden="true" />
                <AlertDescription className="text-purple-900">
                  {analysis.interpretation}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-blue-600" aria-hidden="true" />
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
                    <p className="text-sm font-medium text-gray-700 mb-2">Tipos de Documento:</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.entities.documentTypes.map((type, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="bg-blue-100 text-blue-800 border-blue-200"
                          role="status"
                          aria-label={`Tipo de documento: ${type}`}
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.entities.courses && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Cursos:</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.entities.courses.map((course, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="bg-green-100 text-green-800 border-green-200"
                          role="status"
                          aria-label={`Curso: ${course}`}
                        >
                          {course}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.entities.sectors && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Setores:</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.entities.sectors.map((sector, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="bg-orange-100 text-orange-800 border-orange-200"
                          role="status"
                          aria-label={`Setor: ${sector}`}
                        >
                          {sector}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.entities.status && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Status:</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.entities.status.map((status, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className={getStatusColor(status)}
                          role="status"
                          aria-label={`Status: ${status}`}
                        >
                          {status}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.entities.dateRange && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Período:</p>
                    <Badge 
                      variant="outline" 
                      className="bg-purple-100 text-purple-800 border-purple-200"
                      role="status"
                      aria-label={`Período: ${analysis.entities.dateRange}`}
                    >
                      {analysis.entities.dateRange}
                    </Badge>
                  </div>
                )}

                {analysis.entities.keywords && analysis.entities.keywords.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Palavras-chave:</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.entities.keywords.map((keyword, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="bg-gray-100 text-gray-800 border-gray-200"
                          role="status"
                          aria-label={`Palavra-chave: ${keyword}`}
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-green-600" aria-hidden="true" />
                Filtros Aplicados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysis.filters.map((filter, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                    role="status"
                    aria-label={`Filtro: ${filter.label} igual a ${filter.value}`}
                  >
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 font-medium">{filter.label}</p>
                      <p className="text-sm text-gray-900">{filter.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-600" aria-hidden="true" />
                  Query SQL Otimizada
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copySQL}
                  className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label={sqlCopied ? 'SQL copiado para a área de transferência' : 'Copiar SQL para a área de transferência'}
                >
                  {sqlCopied ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" aria-hidden="true" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" aria-hidden="true" />
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
                <pre 
                  className="text-sm text-green-400 font-mono whitespace-pre-wrap"
                  aria-label="SQL Query resultante"
                  role="region"
                >
                  {analysis.sqlQuery}
                </pre>
              </div>
            </CardContent>
          </Card>

          {analysis.results.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" aria-hidden="true" />
                  Resultados da Busca
                </CardTitle>
                <CardDescription>
                  {analysis.results.length} documento(s) encontrado(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4" role="region" aria-label="Resultados da busca">
                  {analysis.results.map((result) => (
                    <div
                      key={result.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-blue-500"
                      role="article"
                      aria-label={`Documento: ${result.title}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-gray-900 font-semibold">{result.title}</h3>
                            <Badge 
                              variant="outline" 
                              className="bg-blue-100 text-blue-800 border-blue-200"
                              role="status"
                              aria-label={`Tipo: ${result.type}`}
                            >
                              {result.type}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={getStatusColor(result.status)}
                              role="status"
                              aria-label={`Status: ${result.status}`}
                            >
                              {result.status}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                            {result.course && (
                              <span className="flex items-center gap-1">
                                <FileText className="w-3 h-3" aria-hidden="true" />
                                {result.course}
                              </span>
                            )}
                            <span aria-label={`Versão ${result.version}`}>v{result.version}</span>
                            <span aria-hidden="true">·</span>
                            <span aria-label={`Data: ${new Date(result.date).toLocaleDateString('pt-BR')}`}>
                              {new Date(result.date).toLocaleDateString('pt-BR')}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span aria-label={`Autor: ${result.author}`}>{result.author}</span>
                            <span aria-hidden="true">·</span>
                            <span className="text-xs" aria-label={`Setor: ${result.sector}`}>{result.sector}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          aria-label={`Visualizar documento: ${result.title}`}
                          className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Visualizar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          aria-label={`Baixar documento: ${result.title}`}
                          className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
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
            <Alert role="status" aria-live="polite">
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
