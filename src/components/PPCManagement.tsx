'use client';

import { useEffect } from 'react';
import { FileText, Download, Trash2, Archive, Loader } from 'lucide-react';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { usePPCManagement } from '@/hooks/usePPCManagement';

export function PPCManagement() {
  const { ppcs, isLoading, error, fetchPPCs, deletePPC, archivePPC } = usePPCManagement();

  useEffect(() => {
    fetchPPCs();
  }, [fetchPPCs]);

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este PPC?')) {
      try {
        await deletePPC(id);
      } catch (err) {
        console.error('Erro ao deletar:', err);
      }
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await archivePPC(id);
    } catch (err) {
      console.error('Erro ao arquivar:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Gestão de PPCs</h2>
        <p className="text-gray-600">Projetos Pedagógicos de Curso</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Total de PPCs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileText className="w-8 h-8 text-blue-600" />
              <span className="text-3xl font-bold text-gray-900">{ppcs.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileText className="w-8 h-8 text-green-600" />
              <span className="text-3xl font-bold text-gray-900">
                {ppcs.filter(p => p.status === 'ativo').length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Arquivados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Archive className="w-8 h-8 text-gray-600" />
              <span className="text-3xl font-bold text-gray-900">
                {ppcs.filter(p => p.status === 'arquivado').length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de PPCs */}
      <Card>
        <CardHeader>
          <CardTitle>PPCs Registrados</CardTitle>
          <CardDescription>
            Lista de todos os Projetos Pedagógicos de Curso
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error.message}
            </div>
          ) : ppcs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Nenhum PPC registrado. Faça upload de um arquivo de tipo "PPC" para começar.
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome do Arquivo</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Setor</TableHead>
                    <TableHead>Autor</TableHead>
                    <TableHead>Data de Upload</TableHead>
                    <TableHead>Versão</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ppcs.map((ppc) => (
                    <TableRow key={ppc.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900 font-medium truncate max-w-xs">
                            {ppc.nomeArquivo}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">{ppc.titulo}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{ppc.setor}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">{ppc.autor}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {ppc.uploadedAt
                            ? new Date(ppc.uploadedAt).toLocaleDateString('pt-BR')
                            : '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium text-gray-900">
                          v{ppc.versao}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            ppc.status === 'ativo'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-gray-50 text-gray-700 border-gray-200'
                          }
                        >
                          {ppc.status === 'ativo' ? 'Ativo' : 'Arquivado'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {ppc.status === 'ativo' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleArchive(ppc.id!)}
                                title="Arquivar"
                              >
                                <Archive className="w-4 h-4 text-gray-500" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(ppc.id!)}
                            title="Deletar"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
