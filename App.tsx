import { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DocumentList } from './components/DocumentList';
import { DocumentUpload } from './components/DocumentUpload';
import { PPCManagement } from './components/PPCManagement';
import { SearchPanel } from './components/SearchPanel';
import { AccessControl } from './components/AccessControl';

export default function App() {
  const [currentView, setCurrentView] = useState<'documents' | 'upload' | 'ppc' | 'search' | 'access'>('documents');
  const [currentUser] = useState({
    name: 'João Silva',
    role: 'Administrador',
    email: 'joao.silva@universidade.edu.br'
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} userRole={currentUser.role} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={currentUser} />
        
        <main className="flex-1 overflow-auto p-6">
          {currentView === 'documents' && <DocumentList />}
          {currentView === 'upload' && <DocumentUpload />}
          {currentView === 'ppc' && <PPCManagement />}
          {currentView === 'search' && <SearchPanel />}
          {currentView === 'access' && <AccessControl />}
        </main>
      </div>
    </div>
  );
}
