'use client';

import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Alert className="bg-red-50 border-red-200">
        <AlertCircle className="w-4 h-4 text-red-600" />
        <AlertDescription className="text-red-800">
          Você precisa estar autenticado para acessar esta página.
        </AlertDescription>
      </Alert>
    );
  }

  // Se não há role requerido, qualquer usuário autenticado pode acessar
  if (!requiredRole) {
    return <>{children}</>;
  }

  // Verificar se o usuário tem o role necessário
  const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  const hasAccess = allowedRoles.includes(user.role);

  if (!hasAccess) {
    return (
      <div className="space-y-6 max-w-3xl">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Acesso Negado</h2>
          <p className="text-gray-600 mt-2">Você não tem permissão para acessar esta página</p>
        </div>
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Apenas usuários com o perfil de <strong>{allowedRoles.join(', ')}</strong> podem acessar esta área.
            Seu perfil atual é: <strong>{user.role}</strong>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}
