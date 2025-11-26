'use client';

import { useEffect } from 'react';
import { FileText, Download, Eye, MoreVertical, Clock, User, Tag, Trash2, Archive, Loader } from 'lucide-react';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useDocuments } from '@/hooks/useDocumentUpload';
import { Button } from './ui/button';

export function DocumentList() {
  const { documents, isLoading, error, fetchDocuments, deleteDocument, archiveDocument } = useDocuments();

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDelete = async (id: string, fileUrl?: string) => {
    if (confirm('Tem certeza que deseja deletar este documento?')) {
      try {
        await deleteDocument(id, fileUrl);
      } catch (err) {
        console.error('Erro ao deletar:', err);
      }
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await archiveDocument(id);
    } catch (err) {
      console.error('Erro ao arquivar:', err);
    }
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.click();
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando documentos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Erro ao carregar documentos: {error.message}</p>
        <Button
          onClick={fetchDocuments}
          className="mt-4"
          variant="outline"
        >
          Tentar Novamente
        </Button>
      </div>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ppc':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolucao':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'relatorio':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ata':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'dados':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const typeLabels: Record<string, string> = {
    ppc: 'PPC',
    resolucao: 'Resolução',
    relatorio: 'Relatório',
    ata: 'Ata',
    dados: 'Dados Estatísticos',
    processo: 'Processo'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Documentos</h2>
          <p className="text-gray-600">Gerenciamento de documentos acadêmicos</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1">
            {documents.length} documentos
          </Badge>
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Nenhum documento foi enviado ainda</p>
          <p className="text-sm text-gray-500">Comece enviando um documento na seção de upload</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Documento</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Data de Upload</TableHead>
                <TableHead>Versão</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <FileText className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium">{doc.titulo}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-gray-500">{doc.nomeArquivo}</span>
                          <span className="text-xs text-gray-400">·</span>
                          <span className="text-xs text-gray-500">{(doc.tamanhoArq / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getTypeColor(doc.tipo)}>
                      {typeLabels[doc.tipo] || doc.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{doc.setor}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      {doc.autor}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {formatDate(doc.uploadedAt || new Date())}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">v{doc.versao}</span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {doc.urlArquivo && (
                          <DropdownMenuItem onClick={() => handleDownload(doc.urlArquivo || '', doc.nomeArquivo)}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleArchive(doc.id || '')}>
                          <Archive className="w-4 h-4 mr-2" />
                          Arquivar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(doc.id || '', doc.urlArquivo)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Deletar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
