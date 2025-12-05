'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Alert, AlertDescription } from './ui/alert';
import { AlertTriangle, Trash2, Lock } from 'lucide-react';

export function UserProfile() {
  const { user, isLoading, error, deleteAccount, logout } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div 
        className="p-6"
        role="status"
        aria-live="polite"
      >
        Carregando perfil...
      </div>
    );
  }

  if (!user) {
    return (
      <div 
        className="p-6 text-red-600"
        role="alert"
      >
        Erro: Usuário não encontrado
      </div>
    );
  }

  const handleDeleteAccount = async () => {
    setDeleteError(null);

    if (!deletePassword.trim()) {
      setDeleteError('Digite sua senha para confirmar a exclusão');
      return;
    }

    setIsDeleting(true);
    const success = await deleteAccount(deletePassword);

    if (success) {
      await logout();
    } else {
      setIsDeleting(false);
      setDeletePassword('');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Meu Perfil</h2>
        <p className="text-gray-600 mt-2">Seus dados pessoais</p>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div>
          <p className="text-sm text-gray-600">Nome</p>
          <p className="text-lg font-semibold text-gray-900">{user.name}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Usuário</p>
          <p className="text-lg font-semibold text-gray-900">{user.username}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Email</p>
          <p className="text-lg font-semibold text-gray-900">{user.email}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Perfil</p>
          <p className="text-lg font-semibold text-gray-900">{user.role}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">ID</p>
          <p className="text-sm text-gray-600 break-all">{user.id}</p>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-600" aria-hidden="true" />
          <h3 className="text-lg font-semibold text-red-900">Zona de Perigo</h3>
        </div>

        <p className="text-sm text-red-800 mb-4">
          Ações irreversíveis relacionadas à sua conta
        </p>

        <Button
          onClick={() => setShowDeleteModal(true)}
          variant="destructive"
          className="bg-red-600 hover:bg-red-700 text-white gap-2"
          aria-label="Deletar minha conta"
        >
          <Trash2 className="w-4 h-4" aria-hidden="true" />
          Deletar Minha Conta
        </Button>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
        >
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
            <h2 
              id="delete-modal-title"
              className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2"
            >
              <AlertTriangle className="w-6 h-6 text-red-600" aria-hidden="true" />
              Deletar Conta
            </h2>

            <p className="text-gray-600 mb-4">
              Esta ação é irreversível. Sua conta e todos os dados associados serão removidos permanentemente.
            </p>

            {(deleteError || error) && (
              <Alert 
                className="bg-red-50 border-red-200 mb-4"
                role="alert"
                aria-live="polite"
              >
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {deleteError || error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label 
                  htmlFor="delete-password"
                  className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" aria-hidden="true" />
                  Digite sua senha para confirmar:
                </label>
                <Input
                  id="delete-password"
                  type="password"
                  placeholder="Sua senha"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  disabled={isDeleting}
                  aria-required="true"
                  aria-label="Senha para confirmar exclusão de conta"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword('');
                  setDeleteError(null);
                }}
                disabled={isDeleting}
                variant="outline"
                className="flex-1"
                aria-label="Cancelar exclusão de conta"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleDeleteAccount}
                disabled={isDeleting || !deletePassword.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                aria-busy={isDeleting}
                aria-label="Confirmar exclusão de conta"
              >
                {isDeleting ? 'Deletando...' : 'Deletar Conta'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
