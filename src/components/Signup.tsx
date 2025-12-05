'use client';

import { useState, FormEvent } from 'react';
import { UserPlus, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from '@/hooks/useAuth';

interface SignupProps {
  onSignupSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export function Signup({ onSignupSuccess, onSwitchToLogin }: SignupProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { signup, isLoading, error, clearError } = useAuth();

  const validateForm = (): boolean => {
    setValidationError(null);

    if (!formData.name.trim()) {
      setValidationError('Nome é obrigatório');
      return false;
    }

    if (!formData.email.trim()) {
      setValidationError('Email é obrigatório');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setValidationError('Email inválido');
      return false;
    }

    if (!formData.username.trim()) {
      setValidationError('Username é obrigatório');
      return false;
    }

    if (formData.username.length < 3) {
      setValidationError('Username deve ter pelo menos 3 caracteres');
      return false;
    }

    if (!formData.password) {
      setValidationError('Senha é obrigatória');
      return false;
    }

    if (formData.password.length < 6) {
      setValidationError('Senha deve ter pelo menos 6 caracteres');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setValidationError('As senhas não correspondem');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    const success = await signup({
      name: formData.name,
      email: formData.email,
      username: formData.username,
      password: formData.password,
    });

    if (success) {
      setFormData({
        name: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
      });
      onSignupSuccess?.();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid =
    formData.name.trim() &&
    formData.email.trim() &&
    formData.username.trim() &&
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <UserPlus className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Criar Conta</h1>
            <p className="text-gray-600 mt-2">Registre-se no Sistema Acadêmico</p>
          </div>

          {/* Errors */}
          {(validationError || error) && (
            <Alert className="bg-red-50 border-red-200 mb-6">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {validationError || error}
              </AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="font-medium text-gray-700">
                Nome Completo
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Seu nome completo"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full"
                required
                aria-required="true"
                aria-label="Nome completo"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu.email@exemplo.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full"
                required
                aria-required="true"
                aria-label="Email"
              />
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="font-medium text-gray-700">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Digite seu username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full"
                minLength={3}
                required
                aria-required="true"
                aria-label="Username"
                aria-describedby="username-hint"
              />
              <p id="username-hint" className="text-xs text-gray-500">
                Mínimo 3 caracteres
              </p>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="font-medium text-gray-700">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite uma senha forte"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full pr-10"
                  minLength={6}
                  required
                  aria-required="true"
                  aria-label="Senha"
                  aria-describedby="password-hint"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p id="password-hint" className="text-xs text-gray-500">
                Mínimo 6 caracteres
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="font-medium text-gray-700">
                Confirmar Senha
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirme sua senha"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full pr-10"
                  required
                  aria-required="true"
                  aria-label="Confirmar senha"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showConfirmPassword ? 'Ocultar confirmação de senha' : 'Mostrar confirmação de senha'}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-busy={isLoading}
            >
              {isLoading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Já tem conta?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                aria-label="Ir para tela de login"
              >
                Faça login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
