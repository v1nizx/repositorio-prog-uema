'use client';

import { useState, FormEvent } from 'react';
import { LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from '@/hooks/useAuth';

interface LoginProps {
  onLoginSuccess?: () => void;
  onSwitchToSignup?: () => void;
}

export function Login({ onLoginSuccess, onSwitchToSignup }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    if (!username.trim() || !password.trim()) {
      return;
    }

    const success = await login({ username, password });

    if (success) {
      setUsername('');
      setPassword('');
      onLoginSuccess?.();
    }
  };

  const handleClearStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  const isFormValid = username.trim() && password.trim();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Card de Login */}
        <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="bg-blue-100 p-2 sm:p-3 rounded-lg">
                <LogIn className="w-6 sm:w-8 h-6 sm:h-8 text-blue-600" aria-hidden="true" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestão de PPCs</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Sistema Acadêmico da Universidade</p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert 
              className="bg-red-50 border-red-200 mb-6"
              role="alert"
              aria-live="polite"
              aria-atomic="true"
            >
              <AlertCircle className="w-4 h-4 text-red-600" aria-hidden="true" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label 
                htmlFor="username" 
                className="font-medium text-gray-700"
              >
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
                aria-required="true"
                aria-label="Usuário"
              />
            </div>

            <div className="space-y-2">
              <Label 
                htmlFor="password" 
                className="font-medium text-gray-700"
              >
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full pr-10"
                  aria-required="true"
                  aria-label="Senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  aria-pressed={showPassword}
                  tabIndex={0}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Eye className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-busy={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center border-t pt-6">
            <p className="text-gray-600 mb-3">
              Não tem conta?{' '}
              <button
                onClick={onSwitchToSignup}
                className="text-blue-600 hover:text-blue-800 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                aria-label="Ir para tela de registro"
              >
                Registre-se
              </button>
            </p>
          </div>


        </div>

        {/* Sistema Info */}
        <div className="text-center mt-4 sm:mt-6 text-white text-xs sm:text-sm">
          <p>© 2025 - Sistema de Gestão Acadêmica</p>
          <p>Universidade Estadual do Maranhão</p>
        </div>
      </div>
    </div>
  );
}
