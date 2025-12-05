import { Bell, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback } from './ui/avatar';

interface HeaderProps {
  user: {
    name: string;
    role: string;
    email: string;
  };
  onLogout?: () => void;
  onProfileClick?: () => void;
}

export function Header({ user, onLogout, onProfileClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleProfileClick = () => {
    console.log('📝 Clique em Perfil');
    setIsMenuOpen(false);
    setTimeout(() => {
      onProfileClick?.();
    }, 0);
  };

  const handleLogout = () => {
    console.log('🔓 Clique em Sair');
    setIsMenuOpen(false);
    setTimeout(() => {
      onLogout?.();
    }, 0);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Sistema PROG</h1>
          <p className="text-gray-500 text-sm">Gestão de Documentos Acadêmicos</p>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Avatar>
                <AvatarFallback className="bg-blue-600 text-white">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">
                  {user.role === 'admin' ? 'Administrador' : 
                   user.role === 'coordenador' ? 'Coordenador' : 
                   user.role === 'usuario' ? 'Usuário' : user.role}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">Minha Conta</p>
                </div>
                
                <button
                  onClick={handleProfileClick}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">Perfil</span>
                </button>

                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Configurações</span>
                </button>

                <div className="border-t border-gray-200"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Sair</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
