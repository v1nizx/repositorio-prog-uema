import { useState, useCallback } from 'react';
import axios from 'axios';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AccessLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: Date;
  ip?: string;
}

/**
 * Hook para gerenciar usuários e logs de acesso
 */
export function useAccessControl() {
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Buscar usuários do Firestore via API
      const response = await axios.get('/api/users');
      const usersData = response.data as User[];
      
      setUsers(usersData);
      console.log('✅ Usuários carregados:', usersData.length);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao obter usuários');
      setError(error);
      console.error('❌ Erro ao buscar usuários:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createUser = useCallback(async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { password: string }) => {
    try {
      setIsLoading(true);
      const response = await axios.post('/api/users', userData);
      const newUser = response.data as User;
      
      setUsers(prev => [...prev, newUser]);
      console.log('✅ Usuário criado:', newUser.username);
      return newUser;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao criar usuário');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (id: string, updates: Partial<User>) => {
    try {
      setIsLoading(true);
      await axios.put(`/api/users/${id}`, updates);
      
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
      console.log('✅ Usuário atualizado:', id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao atualizar usuário');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/users/${id}`);
      
      setUsers(prev => prev.filter(u => u.id !== id));
      console.log('✅ Usuário deletado:', id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao deletar usuário');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    users,
    logs,
    isLoading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}
