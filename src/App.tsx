import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DocumentList } from './components/DocumentList';
import { DocumentUpload } from './components/DocumentUpload';
import { PPCManagement } from './components/PPCManagement';
import { SearchPanel } from './components/SearchPanel';
import { AccessControl } from './components/AccessControl';
import { UserProfile } from './components/UserProfile';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthPage } from './components/AuthPage';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const [currentView, setCurrentView] = useState<'documents' | 'upload' | 'ppc' | 'search' | 'access' | 'profile'>('documents');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated, user, logout, isLoading: authLoading } = useAuth();

  // Monitorar mudanças de view
  useEffect(() => {
    console.log('📄 View mudou para:', currentView);
  }, [currentView]);

  const handleLogout = async () => {
    await logout();
  };

  const handleProfileClick = () => {
    console.log('🔄 Mudando para view: profile');
    setCurrentView('profile');
  };

  // Tela de carregamento
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Tela de login/signup
  if (!isAuthenticated || !user) {
    return <AuthPage />;
  }

  return (
    <div className="flex h-screen bg-gray-50 flex-col md:flex-row">
      {/* Sidebar - Hidden on mobile, shown on md+ */}
      <Sidebar currentView={currentView} onViewChange={setCurrentView} userRole={user.role} />
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out z-40 md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <div className="text-white font-bold">PROG</div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 hover:bg-gray-800 rounded"
              aria-label="Fechar menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-1 p-2 overflow-y-auto">
            <ul className="space-y-1">
              {[
                { id: 'documents', label: 'Documentos', icon: '📄' },
                { id: 'search', label: 'Busca Avançada', icon: '🔍' },
                { id: 'ppc', label: 'Gestão de PPCs', icon: '📚' },
                { id: 'upload', label: 'Upload', icon: '⬆️' },
                { id: 'access', label: 'Controle de Acesso', icon: '🔐' },
                { id: 'profile', label: 'Meu Perfil', icon: '👤' },
              ].map((item) => {
                const hasAccess = 
                  (item.id === 'access' && user?.role === 'admin') ||
                  (item.id === 'upload' && ['admin', 'coordenador'].includes(user?.role || '')) ||
                  (item.id === 'ppc' && ['admin', 'coordenador'].includes(user?.role || '')) ||
                  ['documents', 'search', 'profile'].includes(item.id);
                
                if (!hasAccess) return null;
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setCurrentView(item.id as any);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                        currentView === item.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          user={{ name: user.name, role: user.role, email: user.email }} 
          onLogout={handleLogout}
          onProfileClick={handleProfileClick}
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        
        <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6">
          {currentView === 'documents' && <DocumentList />}
          {currentView === 'upload' && (
            <ProtectedRoute requiredRole={['admin', 'coordenador']}>
              <DocumentUpload />
            </ProtectedRoute>
          )}
          {currentView === 'ppc' && (
            <ProtectedRoute requiredRole={['admin', 'coordenador']}>
              <PPCManagement />
            </ProtectedRoute>
          )}
          {currentView === 'search' && <SearchPanel />}
          {currentView === 'access' && (
            <ProtectedRoute requiredRole="admin">
              <AccessControl />
            </ProtectedRoute>
          )}
          {currentView === 'profile' && <UserProfile />}
        </main>
      </div>
    </div>
  );
}
