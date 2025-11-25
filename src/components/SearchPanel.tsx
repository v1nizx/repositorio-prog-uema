import { useState } from 'react';
import { Search, Sparkles, Filter, FileText, Calendar, User, Tag } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AISearchAssistant } from './AISearchAssistant';

const mockSearchResults = [
  {
    id: 1,
    title: 'PPC - Engenharia de Software 2024',
    excerpt: 'Projeto Pedagógico do Curso de Engenharia de Software, contemplando a nova matriz curricular com disciplinas de IA e Machine Learning...',
    type: 'PPC',
    date: '2024-03-15',
    author: 'Prof. Maria Santos',
    sector: 'Coordenação de Engenharia',
    relevance: 98
  },
  {
    id: 2,
    title: 'Resolução 045/2024 - Normas de TCC',
    excerpt: 'Estabelece normas para elaboração e apresentação de Trabalhos de Conclusão de Curso nos cursos de graduação...',
    type: 'Resolução',
    date: '2024-02-20',
    author: 'Conselho Universitário',
    sector: 'Secretaria Geral',
    relevance: 87
  },
  {
    id: 3,
    title: 'PPC - Ciência da Computação 2024',
    excerpt: 'Atualização do Projeto Pedagógico com ênfase em computação distribuída e cloud computing...',
    type: 'PPC',
    date: '2024-03-10',
    author: 'Prof. Carlos Oliveira',
    sector: 'Coordenação de Computação',
    relevance: 85
  }
];

export function SearchPanel() {
  const [searchMode, setSearchMode] = useState<'simple' | 'ai'>('simple');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    types: [] as string[],
    dateRange: 'all',
    sectors: [] as string[]
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock search - in real app would query backend
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900">Busca Avançada</h2>
        <p className="text-gray-600">Encontre documentos com busca textual ou IA</p>
      </div>

      <Tabs defaultValue="assistant" className="space-y-6">
        <TabsList>
          <TabsTrigger value="assistant">
            <Sparkles className="w-4 h-4 mr-2" />
            Assistente IA
          </TabsTrigger>
          <TabsTrigger value="traditional">
            <Search className="w-4 h-4 mr-2" />
            Busca Tradicional
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assistant" className="space-y-4">
          <AISearchAssistant />
        </TabsContent>

        <TabsContent value="traditional" className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="flex gap-2 mb-4">
          <Button
            variant={searchMode === 'simple' ? 'default' : 'outline'}
            onClick={() => setSearchMode('simple')}
            className={searchMode === 'simple' ? 'bg-blue-600' : ''}
          >
            <Search className="w-4 h-4 mr-2" />
            Busca Textual
          </Button>
          <Button
            variant={searchMode === 'ai' ? 'default' : 'outline'}
            onClick={() => setSearchMode('ai')}
            className={searchMode === 'ai' ? 'bg-purple-600 hover:bg-purple-700' : ''}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Busca com IA
          </Button>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder={
                  searchMode === 'ai'
                    ? 'Ex: Mostre-me os PPCs atualizados em 2024 com foco em tecnologias emergentes'
                    : 'Digite sua busca...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {searchMode === 'ai' ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Buscar com IA
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>

          {searchMode === 'ai' && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="text-purple-900 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Busca Inteligente
              </h4>
              <p className="text-sm text-purple-800">
                Use linguagem natural para fazer perguntas complexas. O sistema compreenderá o contexto e retornará resultados relevantes.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="text-xs bg-white border border-purple-200 px-3 py-1 rounded-full hover:bg-purple-100 transition-colors"
                  onClick={() => setSearchQuery('PPCs aprovados em 2024')}
                >
                  PPCs aprovados em 2024
                </button>
                <button
                  type="button"
                  className="text-xs bg-white border border-purple-200 px-3 py-1 rounded-full hover:bg-purple-100 transition-colors"
                  onClick={() => setSearchQuery('Resoluções sobre TCC')}
                >
                  Resoluções sobre TCC
                </button>
                <button
                  type="button"
                  className="text-xs bg-white border border-purple-200 px-3 py-1 rounded-full hover:bg-purple-100 transition-colors"
                  onClick={() => setSearchQuery('Relatórios de avaliação institucional')}
                >
                  Relatórios de avaliação institucional
                </button>
              </div>
            </div>
          )}

          {showFilters && (
            <div className="border border-gray-200 rounded-lg p-4 space-y-4">
              <h4 className="text-gray-900">Filtros Avançados</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Documento</Label>
                  <div className="space-y-2">
                    {['PPC', 'Resolução', 'Relatório', 'Ata', 'Dados Estatísticos'].map((type) => (
                      <div key={type} className="flex items-center gap-2">
                        <Checkbox id={`type-${type}`} />
                        <label htmlFor={`type-${type}`} className="text-sm text-gray-700">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-range">Período</Label>
                  <Select value={filters.dateRange} onValueChange={(value) => setFilters({ ...filters, dateRange: value })}>
                    <SelectTrigger id="date-range">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todo o período</SelectItem>
                      <SelectItem value="last-month">Último mês</SelectItem>
                      <SelectItem value="last-3-months">Últimos 3 meses</SelectItem>
                      <SelectItem value="last-6-months">Últimos 6 meses</SelectItem>
                      <SelectItem value="last-year">Último ano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Setor</Label>
                  <div className="space-y-2">
                    {['Coordenação de Engenharia', 'Coordenação de Computação', 'Secretaria Geral'].map((sector) => (
                      <div key={sector} className="flex items-center gap-2">
                        <Checkbox id={`sector-${sector}`} />
                        <label htmlFor={`sector-${sector}`} className="text-sm text-gray-700">
                          {sector}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-900">Resultados da Busca</h3>
          <Badge variant="outline" className="px-3 py-1">
            {mockSearchResults.length} resultados
          </Badge>
        </div>

        {mockSearchResults.map((result) => (
          <div key={result.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 bg-blue-100 rounded-lg mt-1">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-gray-900 mb-2">{result.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{result.excerpt}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                      {result.type}
                    </Badge>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(result.date).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {result.author}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {result.sector}
                    </span>
                  </div>
                </div>
              </div>
              {searchMode === 'ai' && (
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Relevância</span>
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                      {result.relevance}%
                    </Badge>
                  </div>
                </div>
              )}
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
