'use client';

import { useState, FormEvent } from 'react';
import { LogIn, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from '@/hooks/useAuth';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    if (!username.trim() || !password.trim()) {
      return;
    }

    const success = await login({ username, password });

    if (success) {
      // O componente pai (App) será notificado e o redirecionará
      setUsername('');
      setPassword('');
    }
  };

  const handleClearStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="w-full max-w-md">
        {/* Card de Login */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <LogIn className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de PPCs</h1>
            <p className="text-gray-600 mt-2">Sistema Acadêmico da Universidade</p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert className="bg-red-50 border-red-200 mb-6">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="font-medium text-gray-700">
                Usuário
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Digite seu usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="w-full"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-medium text-gray-700">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !username.trim() || !password.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          {/* Footer Info */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p className="mb-2">Credenciais de teste:</p>
            <div className="bg-gray-50 rounded p-3 text-left space-y-1">
              <p>
                <strong>Admin:</strong> admin / admin123
              </p>
              <p>
                <strong>Coordenador:</strong> coordenador / coord123
              </p>
              <p>
                <strong>Usuário:</strong> usuario / user123
              </p>
            </div>
            <button
              onClick={handleClearStorage}
              className="mt-4 text-xs text-blue-600 hover:text-blue-700 underline"
            >
              Limpar dados de sessão
            </button>
          </div>
        </div>

        {/* Sistema Info */}
        <div className="text-center mt-6 text-white text-sm">
          <p>© 2024 - Sistema de Gestão Acadêmica</p>
          <p>Universidade Estadual do Maranhão</p>
        </div>
      </div>
    </div>
  );
}
