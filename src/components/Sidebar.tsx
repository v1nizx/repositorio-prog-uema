import { FileText, Upload, BookOpen, Search, Shield, BarChart3 } from 'lucide-react';
import { cn } from './ui/utils';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: 'documents' | 'upload' | 'ppc' | 'search' | 'access') => void;
  userRole: string;
}

export function Sidebar({ currentView, onViewChange, userRole }: SidebarProps) {
  const menuItems = [
    { id: 'documents', label: 'Documentos', icon: FileText, roles: ['Administrador', 'Editor', 'Consultor'] },
    { id: 'search', label: 'Busca Avançada', icon: Search, roles: ['Administrador', 'Editor', 'Consultor'] },
    { id: 'ppc', label: 'Gestão de PPCs', icon: BookOpen, roles: ['Administrador', 'Editor'] },
    { id: 'upload', label: 'Upload', icon: Upload, roles: ['Administrador', 'Editor'] },
    { id: 'access', label: 'Controle de Acesso', icon: Shield, roles: ['Administrador'] },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-8 h-8 text-blue-400" />
          <div>
            <h2 className="text-white">PROG</h2>
            <p className="text-xs text-gray-400">Sistema de Gestão</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasAccess = item.roles.includes(userRole);
            
            if (!hasAccess) return null;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id as any)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    currentView === item.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="bg-gray-800 rounded-lg p-4">
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
