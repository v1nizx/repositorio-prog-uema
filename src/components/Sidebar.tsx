import { FileText, Upload, BookOpen, Search, Shield, BarChart3 } from 'lucide-react';
import { cn } from './ui/utils';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: 'documents' | 'upload' | 'ppc' | 'search' | 'access' | 'profile') => void;
  userRole: string;
}

export function Sidebar({ currentView, onViewChange, userRole }: SidebarProps) {
  const menuItems = [
    { id: 'documents', label: 'Documentos', icon: FileText, roles: ['admin', 'coordenador', 'usuario'] },
    { id: 'search', label: 'Busca Avançada', icon: Search, roles: ['admin', 'coordenador', 'usuario'] },
    { id: 'ppc', label: 'Gestão de PPCs', icon: BookOpen, roles: ['admin', 'coordenador'] },
    { id: 'upload', label: 'Upload', icon: Upload, roles: ['admin', 'coordenador'] },
    { id: 'access', label: 'Controle de Acesso', icon: Shield, roles: ['admin'] },
    { id: 'profile', label: 'Meu Perfil', icon: FileText, roles: ['admin', 'coordenador', 'usuario'] },
  ];

  return (
    <aside className="w-64 hidden md:flex bg-gray-900 text-white flex-col md:relative fixed md:static inset-y-0 left-0 z-40 md:z-0">
      <div className="p-4 sm:p-6 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 sm:w-8 h-6 sm:h-8 text-blue-400" />
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white">PROG</h2>
            <p className="text-xs text-gray-400">Sistema de Gestão</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-2 sm:p-4 overflow-y-auto">
        <ul className="space-y-1 sm:space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasAccess = item.roles.includes(userRole);
            
            if (!hasAccess) return null;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id as any)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base",
                    currentView === item.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  )}
                  title={item.label}
                >
                  <Icon className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-2 sm:p-4 border-t border-gray-800">
        <div className="bg-gray-800 rounded-lg p-3 sm:p-4">
          <p className="text-xs text-gray-400 mb-2">Armazenamento</p>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 bg-gray-700 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '68%' }}></div>
            </div>
          </div>
          <p className="text-xs text-gray-400">6.8 GB de 10 GB usados</p>
        </div>
      </div>
    </aside>
  );
}
