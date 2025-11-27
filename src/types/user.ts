export type UserRole = 'admin' | 'coordenador' | 'usuario';

export interface User {
  id: string;
  username: string;
  password?: string; // Nunca enviar para o cliente
  role: UserRole;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}
