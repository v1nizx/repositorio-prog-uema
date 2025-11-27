'use client'

import App from '@/src/App'
import { AuthProvider } from '@/src/contexts/AuthContext'

export default function Home() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}
