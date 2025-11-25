import { useState } from 'react';
import { Shield, UserPlus, Eye, Lock, Activity } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Label } from './ui/label';

const mockUsers = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao.silva@universidade.edu.br',
    role: 'Administrador',
    department: 'TI',
    lastAccess: '2024-03-20 14:30',
    status: 'Ativo'
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria.santos@universidade.edu.br',
    role: 'Editor',
    department: 'Coordenação de Engenharia',
    lastAccess: '2024-03-20 10:15',
    status: 'Ativo'
  },
  {
    id: 3,
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@universidade.edu.br',
    role: 'Editor',
    department: 'Coordenação de Computação',
    lastAccess: '2024-03-19 16:45',
    status: 'Ativo'
  },
  {
    id: 4,
    name: 'Ana Costa',
    email: 'ana.costa@universidade.edu.br',
    role: 'Consultor',
    department: 'Secretaria Geral',
    lastAccess: '2024-03-18 09:20',
    status: 'Ativo'
  },
  {
    id: 5,
    name: 'Pedro Lima',
    email: 'pedro.lima@universidade.edu.br',
    role: 'Consultor',
    department: 'CPA',
    lastAccess: '2024-03-15 11:00',
    status: 'Inativo'
  }
];

const mockAccessLogs = [
  {
    id: 1,
    user: 'João Silva',
    action: 'Visualizou',
    document: 'PPC - Engenharia de Software 2024',
    timestamp: '2024-03-20 14:30:25',
    ip: '192.168.1.100'
  },
  {
    id: 2,
    user: 'Maria Santos',
    action: 'Editou',
    document: 'PPC - Engenharia de Software 2024',
    timestamp: '2024-03-20 10:15:42',
    ip: '192.168.1.101'
  },
  {
    id: 3,
    user: 'Carlos Oliveira',
    action: 'Upload',
    document: 'PPC - Ciência da Computação 2024',
    timestamp: '2024-03-19 16:45:18',
    ip: '192.168.1.102'
  },
  {
    id: 4,
    user: 'Ana Costa',
    action: 'Baixou',
    document: 'Resolução 045/2024',
    timestamp: '2024-03-18 09:20:33',
    ip: '192.168.1.103'
  },
  {
    id: 5,
    user: 'João Silva',
    action: 'Excluiu',
    document: 'Ata Rascunho - Janeiro 2024',
    timestamp: '2024-03-17 15:10:05',
    ip: '192.168.1.100'
  }
];

export function AccessControl() {
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
    department: ''
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Administrador':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Editor':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Consultor':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Excluiu':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Editou':
      case 'Upload':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Visualizou':
      case 'Baixou':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Controle de Acesso</h2>
          <p className="text-gray-600">Gerenciamento de usuários e permissões</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Adicionar Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Usuário</DialogTitle>
              <DialogDescription>
                Configure o acesso e permissões do novo usuário
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-name">Nome Completo</Label>
                <Input
                  id="new-name"
                  placeholder="Digite o nome"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-email">Email</Label>
                <Input
                  id="new-email"
                  type="email"
                  placeholder="email@universidade.edu.br"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-role">Perfil de Acesso</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger id="new-role">
                    <SelectValue placeholder="Selecione o perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="consultor">Consultor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-department">Departamento</Label>
                <Input
                  id="new-department"
                  placeholder="Digite o departamento"
                  value={newUser.department}
                  onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                />
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Criar Usuário
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total de Usuários</p>
              <p className="text-gray-900">{mockUsers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Usuários Ativos</p>
              <p className="text-gray-900">
                {mockUsers.filter(u => u.status === 'Ativo').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Ações Hoje</p>
              <p className="text-gray-900">{mockAccessLogs.length}</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="logs">Logs de Acesso</TabsTrigger>
          <TabsTrigger value="permissions">Permissões</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <p className="text-gray-900">{user.name}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600">{user.department}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600">{user.lastAccess}</p>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.status === 'Ativo'
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : 'bg-gray-100 text-gray-800 border-gray-200'
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAccessLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <p className="text-gray-900">{log.user}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getActionColor(log.action)}>
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600">{log.document}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600">{log.timestamp}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600">{log.ip}</p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="permissions">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4">Matriz de Permissões</h3>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Badge className="bg-red-100 text-red-800 border-red-200">
                    Administrador
                  </Badge>
                  <p className="text-sm text-gray-600">Acesso total ao sistema</p>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-green-600" />
                    Upload, edição e exclusão de documentos
                  </li>
                  <li className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-green-600" />
                    Gestão completa de PPCs
                  </li>
                  <li className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-green-600" />
                    Gerenciamento de usuários e permissões
                  </li>
                  <li className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-green-600" />
                    Acesso a todos os logs e relatórios
                  </li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    Editor
                  </Badge>
                  <p className="text-sm text-gray-600">Pode criar e modificar documentos</p>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-green-600" />
                    Upload e edição de documentos
                  </li>
                  <li className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-green-600" />
                    Gestão de PPCs do seu departamento
                  </li>
                  <li className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-red-600" />
                    Sem acesso ao controle de usuários
                  </li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Consultor
                  </Badge>
                  <p className="text-sm text-gray-600">Apenas leitura</p>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-green-600" />
                    Visualização e download de documentos
                  </li>
                  <li className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-green-600" />
                    Busca e consulta de PPCs
                  </li>
                  <li className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-red-600" />
                    Sem permissão de upload ou edição
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
