'use client';

import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { User, LoginCredentials, AuthState } from '@/types/user';

const STORAGE_KEY = 'app_user';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<boolean>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null,
  });

  // Restaurar usuário do localStorage no mount
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        console.log('✅ Usuário restaurado do localStorage:', user.username);
        setAuthState({
          isAuthenticated: true,
          user,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        console.error('❌ Erro ao restaurar usuário:', err);
        localStorage.removeItem(STORAGE_KEY);
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: null,
        });
      }
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Sincronizar localStorage com mudanças de autenticação
  useEffect(() => {
    if (authState.user && authState.isAuthenticated) {
      console.log('💾 Sincronizando user no localStorage:', authState.user.username);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authState.user));
    }
  }, [authState.user?.id, authState.isAuthenticated]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      console.log('🔐 Iniciando login para:', credentials.username);
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      console.log('📡 Enviando requisição para /api/auth/login...');
      const response = await axios.post('/api/auth/login', credentials);

      console.log('📦 Resposta recebida:', response.data);
      console.log('✅ response.data.success:', response.data.success);
      console.log('👤 response.data.user:', response.data.user);

      if (response.data.success && response.data.user) {
        const user = response.data.user as User;
        console.log('🔄 Atualizando estado de autenticação...');

        // Atualizar estado - vai disparar o useEffect de sincronização
        setAuthState({
          isAuthenticated: true,
          user,
          isLoading: false,
          error: null,
        });

        console.log('✅ Login bem-sucedido:', user.username);
        console.log('✅ Nome do usuário:', user.name);
        return true;
      }

      throw new Error(response.data.error || 'Erro ao fazer login');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login';
      console.error('❌ Erro completo no login:', err);
      console.error('❌ Mensagem de erro:', errorMessage);
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await axios.post('/api/auth/logout');

      // Limpar estado e localStorage
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('app_user_old');

      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      });

      console.log('🔓 Logout bem-sucedido');
      return true;
    } catch (err) {
      console.error('❌ Erro no logout:', err);
      // Mesmo com erro, limpar o estado local
      localStorage.removeItem(STORAGE_KEY);
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      });
      return false;
    }
  }, []);

  const clearError = useCallback(() => {
    setAuthState((prev) => ({ ...prev, error: null }));
  }, []);

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
