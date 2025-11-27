import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DocumentList } from './components/DocumentList';
import { DocumentUpload } from './components/DocumentUpload';
import { PPCManagement } from './components/PPCManagement';
import { SearchPanel } from './components/SearchPanel';
import { AccessControl } from './components/AccessControl';
import { UserProfile } from './components/UserProfile';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './components/Login';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const [currentView, setCurrentView] = useState<'documents' | 'upload' | 'ppc' | 'search' | 'access' | 'profile'>('documents');
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

  // Tela de login
  if (!isAuthenticated || !user) {
    return <Login />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} userRole={user.role} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          user={{ name: user.name, role: user.role, email: user.email }} 
          onLogout={handleLogout}
          onProfileClick={handleProfileClick}
        />
        
        <main className="flex-1 overflow-auto p-6">
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
