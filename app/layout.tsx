import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PROG - Sistema de Gestão de Documentos Acadêmicos',
  description: 'Sistema de gerenciamento de documentos acadêmicos da PROG/UEMA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
