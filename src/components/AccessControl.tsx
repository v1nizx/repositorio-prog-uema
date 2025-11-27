import { useState, useEffect } from 'react';
import { Shield, UserPlus, Eye, Lock, Activity, Loader } from 'lucide-react';
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
import { useAccessControl } from '@/hooks/useAccessControl';



export function AccessControl() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
    department: ''
  });

  const { users, isLoading, fetchUsers } = useAccessControl();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
      case 'Administrador':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'coordenador':
      case 'Editor':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'usuario':
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  // TODO: Criar usuário no backend
                  setNewUser({ name: '', email: '', role: '', department: '' });
                  setIsDialogOpen(false);
                }}
              >
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
              <p className="text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Administradores</p>
              <p className="text-gray-900">
                {users.filter(u => u.role === 'admin').length}
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
              <p className="text-sm text-gray-600">Coordenadores</p>
              <p className="text-gray-900">
                {users.filter(u => u.role === 'coordenador').length}
              </p>
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
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                Nenhum usuário encontrado.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <p className="text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">@{user.username}</p>
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
                        <p className="text-sm text-gray-600">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
                        </p>
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
            )}
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
