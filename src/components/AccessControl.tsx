import { useState, useEffect } from 'react';
import { Shield, UserPlus, Eye, Lock, Activity, Loader, Edit2, Trash2, AlertTriangle } from 'lucide-react';
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
import { Alert, AlertDescription } from './ui/alert';
import { useAccessControl } from '@/hooks/useAccessControl';



export function AccessControl() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
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

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    
    try {
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingUser.name,
          email: editingUser.email,
          role: editingUser.role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Usuário atualizado com sucesso:', data);
        setIsEditDialogOpen(false);
        setEditingUser(null);
        await fetchUsers();
      } else {
        console.error('❌ Erro ao atualizar usuário:', data.error);
        alert(`Erro ao atualizar usuário: ${data.error}`);
      }
    } catch (err) {
      console.error('❌ Erro ao salvar usuário:', err);
      alert('Erro ao salvar usuário');
    }
  };

  const handleDeleteUser = async () => {
    if (!showDeleteConfirm) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/users/${showDeleteConfirm}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Usuário deletado com sucesso:', data);
        setShowDeleteConfirm(null);
        await fetchUsers();
      } else {
        console.error('❌ Erro ao deletar usuário:', data.error);
        alert(`Erro ao deletar usuário: ${data.error}`);
      }
    } catch (err) {
      console.error('❌ Erro ao deletar usuário:', err);
      alert('Erro ao deletar usuário');
    } finally {
      setIsDeleting(false);
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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Controle de Acesso</h2>
          <p className="text-sm sm:text-base text-gray-600">Gerenciamento de usuários e permissões</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-sm sm:text-base w-full sm:w-auto">
              <UserPlus className="w-4 h-4 mr-2" />
              Adicionar Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Adicionar Novo Usuário</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                Configure o acesso e permissões do novo usuário
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 sm:space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-name" className="text-xs sm:text-sm">Nome Completo</Label>
                <Input
                  id="new-name"
                  placeholder="Digite o nome"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-email" className="text-xs sm:text-sm">Email</Label>
                <Input
                  id="new-email"
                  type="email"
                  placeholder="email@universidade.edu.br"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-role" className="text-xs sm:text-sm">Perfil de Acesso</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger id="new-role" className="text-sm">
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
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditUser(user)}
                            className="flex items-center gap-1"
                          >
                            <Edit2 className="w-4 h-4" />
                            Editar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowDeleteConfirm(user.id)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            Deletar
                          </Button>
                        </div>
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

      {/* Modal de Edição de Usuário */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Modifique as informações e permissões do usuário
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome Completo</Label>
                <Input
                  id="edit-name"
                  placeholder="Digite o nome"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="email@universidade.edu.br"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Perfil de Acesso</Label>
                <Select value={editingUser.role} onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}>
                  <SelectTrigger id="edit-role">
                    <SelectValue placeholder="Selecione o perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="coordenador">Coordenador</SelectItem>
                    <SelectItem value="usuario">Usuário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={handleSaveEdit}
                >
                  Salvar Alterações
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Deleção */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Deletar Usuário</h3>
            </div>

            <p className="text-gray-600 mb-4">
              Tem certeza que deseja deletar este usuário? Esta ação é irreversível e o usuário perderá acesso ao sistema.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-red-800">
                <strong>Aviso:</strong> Todos os dados e permissões associados a este usuário serão removidos.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(null)}
                disabled={isDeleting}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDeleteUser}
                disabled={isDeleting}
                aria-busy={isDeleting}
              >
                {isDeleting ? 'Deletando...' : 'Deletar Usuário'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
