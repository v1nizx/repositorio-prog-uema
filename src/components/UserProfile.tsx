'use client';

import { useAuth } from '@/hooks/useAuth';

export function UserProfile() {
  const { user, isLoading } = useAuth();

  console.log('UserProfile - user:', user);
  console.log('UserProfile - isLoading:', isLoading);

  if (isLoading) {
    return <div className="p-6">Carregando perfil...</div>;
  }

  if (!user) {
    return <div className="p-6">Erro: Usuário não encontrado</div>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Meu Perfil</h2>
        <p className="text-gray-600 mt-2">Seus dados pessoais</p>
      </div>

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
    </div>
  );
}
