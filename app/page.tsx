'use client'

import { useState } from 'react'
import { Header } from '@/src/components/Header'
import { Sidebar } from '@/src/components/Sidebar'
import { DocumentList } from '@/src/components/DocumentList'
import { DocumentUpload } from '@/src/components/DocumentUpload'
import { PPCManagement } from '@/src/components/PPCManagement'
import { SearchPanel } from '@/src/components/SearchPanel'
import { AccessControl } from '@/src/components/AccessControl'

export default function Home() {
  const [currentView, setCurrentView] = useState<'documents' | 'upload' | 'ppc' | 'search' | 'access'>('documents')
  const [currentUser] = useState({
    name: 'João Silva',
    role: 'Administrador',
    email: 'joao.silva@universidade.edu.br'
  })

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
  )
}
