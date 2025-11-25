import { useState } from 'react';
import { BookOpen, GitCompare, FileText, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

const mockPPCs = [
  {
    id: 1,
    course: 'Engenharia da Computação',
    currentVersion: '3.2',
    lastUpdate: '2024-03-15',
    status: 'Atualizado',
    nextReview: '2025-03-15',
    versions: [
      { version: '3.2', date: '2024-03-15', author: 'Prof. Reinaldo', status: 'Aprovado' },
      { version: '3.1', date: '2023-09-10', author: 'Prof. Pedro Brandão', status: 'Aprovado' },
      { version: '3.0', date: '2023-03-01', author: 'Prof. Antonio Jacob', status: 'Aprovado' }
    ]
  },
  {
    id: 2,
    course: 'Engenharia Mecanica',
    currentVersion: '4.0',
    lastUpdate: '2024-03-10',
    status: 'Em Revisão',
    nextReview: '2025-03-10',
    versions: [
      { version: '4.0', date: '2024-03-10', author: 'Prof. Carlos Oliveira', status: 'Em Revisão' },
      { version: '3.5', date: '2023-08-20', author: 'Prof. Carlos Oliveira', status: 'Aprovado' },
      { version: '3.0', date: '2022-03-15', author: 'Prof. Ana Silva', status: 'Aprovado' }
    ]
  },
  {
    id: 3,
    course: 'Engenharia Civil',
    currentVersion: '2.8',
    lastUpdate: '2023-11-20',
    status: 'Pendente',
    nextReview: '2024-11-20',
    versions: [
      { version: '2.8', date: '2023-11-20', author: 'Prof. Roberto Lima', status: 'Aprovado' },
      { version: '2.5', date: '2023-03-10', author: 'Prof. Roberto Lima', status: 'Aprovado' }
    ]
  }
];

export function PPCManagement() {
  const [selectedPPC, setSelectedPPC] = useState(mockPPCs[0]);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Atualizado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Em Revisão':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Pendente':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleVersionSelect = (version: string) => {
    if (selectedVersions.includes(version)) {
      setSelectedVersions(selectedVersions.filter(v => v !== version));
    } else if (selectedVersions.length < 2) {
      setSelectedVersions([...selectedVersions, version]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900">Gestão de PPCs</h2>
        <p className="text-gray-600">Projetos Pedagógicos de Curso</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Total de PPCs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <span className="text-gray-900">{mockPPCs.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Atualizados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <span className="text-gray-900">
                {mockPPCs.filter(p => p.status === 'Atualizado').length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <span className="text-gray-900">
                {mockPPCs.filter(p => p.status === 'Pendente').length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Lista de PPCs</TabsTrigger>
          <TabsTrigger value="versions">Histórico de Versões</TabsTrigger>
          <TabsTrigger value="compare">Comparação</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Curso</TableHead>
                  <TableHead>Versão Atual</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Última Atualização</TableHead>
                  <TableHead>Próxima Revisão</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPPCs.map((ppc) => (
                  <TableRow key={ppc.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                        </div>
                        <p className="text-gray-900">{ppc.course}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">v{ppc.currentVersion}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(ppc.status)}>
                        {ppc.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {new Date(ppc.lastUpdate).toLocaleDateString('pt-BR')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {new Date(ppc.nextReview).toLocaleDateString('pt-BR')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPPC(ppc)}
                      >
                        Ver Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="versions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Versões - {selectedPPC.course}</CardTitle>
              <CardDescription>
                Todas as versões registradas do PPC
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedPPC.versions.map((version, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        {index !== selectedPPC.versions.length - 1 && (
                          <div className="w-0.5 h-8 bg-gray-200 mt-2"></div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <p className="text-gray-900">Versão {version.version}</p>
                          <Badge variant="outline" className={getStatusColor(version.status)}>
                            {version.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {version.author} · {new Date(version.date).toLocaleDateString('pt-BR')}
                        </p>
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
        </TabsContent>

        <TabsContent value="compare" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comparação de Versões - {selectedPPC.course}</CardTitle>
              <CardDescription>
                Selecione duas versões para comparar (máximo 2)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedPPC.versions.map((version, index) => (
                  <div
                    key={index}
                    onClick={() => handleVersionSelect(version.version)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedVersions.includes(version.version)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-900">Versão {version.version}</p>
                      {selectedVersions.includes(version.version) && (
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(version.date).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-sm text-gray-600">{version.author}</p>
                  </div>
                ))}
              </div>

              {selectedVersions.length === 2 && (
                <div className="pt-4 border-t border-gray-200">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <GitCompare className="w-4 h-4 mr-2" />
                    Comparar Versões {selectedVersions[0]} e {selectedVersions[1]}
                  </Button>
                </div>
              )}

              {selectedVersions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Selecione duas versões para comparar
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
