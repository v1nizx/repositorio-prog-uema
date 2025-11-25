import { useState } from 'react';
import { FileText, Download, Eye, MoreVertical, Clock, User, Tag } from 'lucide-react';
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

const mockDocuments = [
  {
    id: 1,
    title: 'PPC - Engenharia da Computação',
    type: 'PPC',
    date: '2024-03-15',
    author: 'Prof. Pedro Brandão',
    sector: 'Coordenação de Engenharia',
    version: '3.2',
    status: 'Aprovado',
    format: 'PDF'
  },
  {
    id: 2,
    title: 'Resolução 045/2024 - Normas de TCC',
    type: 'Resolução',
    date: '2024-02-20',
    author: 'Conselho Universitário',
    sector: 'Secretaria Geral',
    version: '1.0',
    status: 'Vigente',
    format: 'PDF'
  },
  {
    id: 3,
    title: 'Relatório de Avaliação Institucional 2023',
    type: 'Relatório',
    date: '2024-01-10',
    author: 'CPA',
    sector: 'Comissão Própria de Avaliação',
    version: '2.1',
    status: 'Publicado',
    format: 'XLSX'
  },
  {
    id: 4,
    title: 'Ata Reunião Colegiado - Janeiro 2024',
    type: 'Ata',
    date: '2024-01-30',
    author: 'Secretaria do Colegiado',
    sector: 'Colegiado de Curso',
    version: '1.0',
    status: 'Aprovado',
    format: 'DOCX'
  },
  {
    id: 5,
    title: 'PPC - Engenharia Mecanica',
    type: 'PPC',
    date: '2024-03-10',
    author: 'Prof. Carlos Oliveira',
    sector: 'Coordenação de Mecanica',
    version: '4.0',
    status: 'Em Revisão',
    format: 'PDF'
  },
  {
    id: 6,
    title: 'Dados Estatísticos - Matrículas 2023',
    type: 'Dados Estatísticos',
    date: '2023-12-15',
    author: 'Departamento de Registro',
    sector: 'Registro Acadêmico',
    version: '1.5',
    status: 'Publicado',
    format: 'XLSX'
  }
];

export function DocumentList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aprovado':
      case 'Vigente':
      case 'Publicado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Em Revisão':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PPC':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Resolução':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Relatório':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Ata':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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
            {filteredDocuments.length} documentos
          </Badge>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <Input
              placeholder="Buscar por título ou autor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Tipo de documento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="PPC">PPC</SelectItem>
              <SelectItem value="Resolução">Resolução</SelectItem>
              <SelectItem value="Relatório">Relatório</SelectItem>
              <SelectItem value="Ata">Ata</SelectItem>
              <SelectItem value="Dados Estatísticos">Dados Estatísticos</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="Aprovado">Aprovado</SelectItem>
              <SelectItem value="Em Revisão">Em Revisão</SelectItem>
              <SelectItem value="Vigente">Vigente</SelectItem>
              <SelectItem value="Publicado">Publicado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Documento</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Versão</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <FileText className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-gray-900">{doc.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {doc.sector}
                        </span>
                        <span className="text-xs text-gray-400">·</span>
                        <span className="text-xs text-gray-500">{doc.format}</span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getTypeColor(doc.type)}>
                    {doc.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(doc.status)}>
                    {doc.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    {new Date(doc.date).toLocaleDateString('pt-BR')}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    {doc.author}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">v{doc.version}</span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="w-4 h-4 mr-2" />
                        Baixar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Clock className="w-4 h-4 mr-2" />
                        Histórico de Versões
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
