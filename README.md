# 📚 Sistema PROG - Gestão de Documentos Acadêmicos

> Uma plataforma moderna e robusta para gerenciamento centralizado de documentos acadêmicos da PROG/UEMA

![Status](https://img.shields.io/badge/status-production--ready-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Sobre o Projeto

O **Sistema PROG** é uma aplicação web de ponta construída com as tecnologias mais modernas para gestão centralizada de documentos acadêmicos. O sistema oferece:

✨ **Funcionalidades Principais:**
- 🔍 Busca inteligente com assistente IA
- 📄 Upload e versionamento automático de documentos
- 🔐 Controle granular de acesso por perfis
- 📊 Logs detalhados de auditoria
- 📱 Interface responsiva e acessível
- ⚡ Performance otimizada com Next.js

## 📊 Estado Atual do Projeto

**Versão:** 1.0.0  
**Status:** ✅ Production Ready  
**Última Atualização:** Novembro 2025

### 📦 Componentes Implementados
- ✅ 49 Componentes React (incluindo 40 componentes UI reutilizáveis)
- ✅ 4 Custom Hooks para lógica de negócio
- ✅ 2 Serviços principais (Upload e Admin)
- ✅ Autenticação com Firebase
- ✅ Integração com Firestore
- ✅ Sistema de logs e auditoria

## 🎯 Requisitos Funcionais

### RF01 - Cadastro e Armazenamento
- Upload de documentos em múltiplos formatos (PDF, DOCX, XLSX)
- Metadados obrigatórios: título, tipo, data, autor, setor
- Versionamento automático de documentos

### RF02 - Busca e Recuperação
- Busca textual avançada com filtros
- Busca por IA com processamento de linguagem natural
- Sugestões inteligentes baseadas em contexto

### RF03 - Gestão de PPCs
- Armazenamento estruturado de PPCs por curso
- Comparação entre versões de PPCs
- Relatórios de status de atualização

### RF04 - Controle de Acesso
- Autenticação integrada (preparado para LDAP/AD)
- Perfis: Administrador, Editor, Consultor
- Logs de acesso e modificações

## 🔧 Requisitos Não-Funcionais

- **RNF01 - Performance**: Tempo de resposta < 3s para buscas
- **RNF02 - Segurança**: Preparado para criptografia TLS 1.3, backup diário
- **RNF03 - Usabilidade**: Interface responsiva, acessibilidade WCAG 2.1
- **RNF04 - Escalabilidade**: Suporte a 10.000 documentos iniciais, escalável a 100.000

## 📁 Tipos de Documentos Suportados

1. **PPCs (Projetos Pedagógicos de Curso)**
2. **Resoluções e Portarias de Graduação**
3. **Dados Estatísticos de Cursos e Matrículas**
4. **Relatórios de Avaliação Institucional**
5. **Atas de Reuniões de Colegiados**
6. **Processos de Reconhecimento e Renovação de Cursos**

## 🏗️ Arquitetura e Estrutura do Projeto

### Organização de Diretórios

```
repositorio-prog-uema/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Layout raiz com AuthProvider
│   ├── page.tsx                      # Página inicial (rota /)
│   ├── globals.css                   # Estilos globais (Tailwind)
│   └── api/                          # API Routes Next.js
│       ├── auth/                     # Autenticação
│       │   ├── login/
│       │   └── logout/
│       ├── documents/                # Gerenciamento de documentos
│       │   ├── route.ts
│       │   ├── [id]/
│       │   ├── upload/
│       │   ├── search/
│       │   ├── sector/
│       │   ├── type/
│       │   └── archive/
│       ├── users/                    # Gerenciamento de usuários
│       ├── init/                     # Inicialização
│       └── ...
│
├── src/
│   ├── components/                   # 49 Componentes React
│   │   ├── Header.tsx               # Cabeçalho com perfil
│   │   ├── Sidebar.tsx              # Menu lateral
│   │   ├── DocumentList.tsx         # Lista de documentos
│   │   ├── DocumentUpload.tsx       # Upload de arquivos
│   │   ├── SearchPanel.tsx          # Busca com tabs
│   │   ├── AISearchAssistant.tsx    # Assistente IA
│   │   ├── AccessControl.tsx        # Controle de acesso
│   │   ├── PPCManagement.tsx        # Gestão de PPCs
│   │   ├── UserProfile.tsx          # Perfil do usuário
│   │   ├── Login.tsx                # Tela de login
│   │   ├── ProtectedRoute.tsx       # Rota protegida
│   │   └── ui/                      # 40 Componentes UI (ShadCN)
│   │       ├── button.tsx
│   │       ├── dialog.tsx
│   │       ├── table.tsx
│   │       ├── badge.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── select.tsx
│   │       ├── input.tsx
│   │       ├── alert.tsx
│   │       ├── tabs.tsx
│   │       ├── chart.tsx
│   │       └── ... (40 componentes)
│   │
│   ├── hooks/                        # 4 Custom Hooks
│   │   ├── useAuth.ts               # Gerenciamento de autenticação
│   │   ├── useAccessControl.ts      # Controle de acesso
│   │   ├── useDocumentUpload.ts     # Upload de documentos
│   │   └── usePPCManagement.ts      # Gestão de PPCs
│   │
│   ├── services/                     # Serviços de negócio
│   │   ├── uploadService.ts         # Serviço de upload
│   │   └── admin-upload.service.ts  # Serviço admin
│   │
│   ├── contexts/                     # React Contexts
│   │   └── AuthContext.tsx          # Context de autenticação
│   │
│   ├── types/                        # Tipos TypeScript
│   │   ├── document.ts              # Tipos de documentos
│   │   └── user.ts                  # Tipos de usuários
│   │
│   ├── config/                       # Configurações
│   │   ├── firebase.config.ts       # Firebase client
│   │   ├── firebase-admin.config.ts # Firebase admin
│   │   ├── database.config.js       # Database config
│   │   └── ai.config.js             # AI config
│   │
│   └── db/                           # Scripts de banco de dados
│       └── scripts/
│
├── public/                           # Arquivos estáticos
├── package.json                      # Dependências do projeto
├── tsconfig.json                     # Configuração TypeScript
├── tailwind.config.js                # Configuração Tailwind CSS
├── postcss.config.js                 # Configuração PostCSS
└── next.config.ts                    # Configuração Next.js
```

## 🚀 Tecnologias Utilizadas

### Frontend
| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| **React** | 18.x | Biblioteca de UI |
| **Next.js** | 14.x | Framework React |
| **TypeScript** | 5.x | Tipagem estática |
| **Tailwind CSS** | 4.x | Estilização |
| **ShadCN/UI** | Latest | Componentes reutilizáveis |
| **Lucide React** | 0.365 | Ícones vetoriais |
| **Recharts** | Latest | Gráficos e charts |

### Backend & Serviços
| Serviço | Uso |
|---------|-----|
| **Firebase Authentication** | Autenticação de usuários |
| **Firestore** | Banco de dados em tempo real |
| **Firebase Storage** | Armazenamento de arquivos |
| **Firebase Security Rules** | Segurança de dados |

### Ferramentas & Dependências
- **Axios** - Client HTTP
- **class-variance-authority** - CSS utilities
- **embla-carousel** - Carrosel
- **firebase-admin** - Firebase server SDK
- **next-themes** - Tema da aplicação
- **sonner** - Toast notifications

## 👥 Perfis e Controle de Acesso

### Matriz de Permissões

| Funcionalidade | Admin | Editor | Consultor |
|---------------|-------|--------|-----------|
| **Upload de documentos** | ✅ | ✅ | ❌ |
| **Editar documentos** | ✅ | ✅ | ❌ |
| **Deletar documentos** | ✅ | ❌ | ❌ |
| **Visualizar documentos** | ✅ | ✅ | ✅ |
| **Buscar documentos** | ✅ | ✅ | ✅ |
| **Gerenciar PPCs** | ✅ | ✅* | ❌ |
| **Controle de usuários** | ✅ | ❌ | ❌ |
| **Acesso a logs** | ✅ | ❌ | ❌ |
| **Relatórios** | ✅ | Limitado | Limitado |

*Editor pode gerenciar PPCs do seu departamento

### 1. Administrador
**Visão:** Acesso total ao sistema

**Funcionalidades:**
- 🔑 Gerenciamento completo de usuários
- 📋 Gestão de todos os documentos
- 📊 Acesso a logs detalhados
- ⚙️ Configurações do sistema
- 📈 Relatórios administrativos

### 2. Editor
**Visão:** Criação e edição de conteúdo

**Funcionalidades:**
- 📄 Upload de novos documentos
- ✏️ Edição de documentos próprios
- 📁 Gestão de PPCs do departamento
- 🔍 Busca avançada
- 📥 Download de documentos

### 3. Consultor
**Visão:** Apenas visualização

**Funcionalidades:**
- 👁️ Visualização de documentos
- 🔍 Busca e filtros
- 📥 Download de documentos
- 📖 Leitura de PPCs

## 🔍 Funcionalidades Principais

### 1. Gestão de Documentos
- Lista completa com filtros por tipo, status e setor
- Visualização de metadados
- Download de arquivos
- Histórico de versões
- Busca rápida

### 2. Upload de Documentos
- Drag & drop de arquivos
- Formulário com metadados obrigatórios
- Validação de formatos (PDF, DOCX, XLSX)
- Versionamento automático

### 3. Busca Inteligente com IA

#### Assistente de Busca
O sistema inclui um assistente especializado que:

1. **Interpreta consultas em linguagem natural**
   ```
   Exemplo: "Quais PPCs foram atualizados nos últimos 6 meses?"
   ```

2. **Identifica entidades relevantes**
   - Tipos de documento (PPC, Resolução, etc.)
   - Cursos
   - Períodos (datas)
   - Setores
   - Status

3. **Gera queries SQL otimizadas**
   ```sql
   SELECT d.id, d.titulo, d.tipo, d.data_atualizacao
   FROM documentos d
   WHERE d.tipo = 'PPC'
     AND d.data_atualizacao >= CURRENT_DATE - INTERVAL '6 months'
   ORDER BY d.data_atualizacao DESC;
   ```

4. **Apresenta resultados estruturados**
   - Interpretação da consulta
   - Entidades identificadas
   - Filtros aplicados
   - Query SQL gerada
   - Resultados com relevância

#### Exemplos de Consultas Suportadas
- "Quais PPCs foram atualizados nos últimos 6 meses?"
- "Mostre todas as resoluções sobre TCC aprovadas em 2024"
- "Quais documentos da Coordenação de Engenharia precisam de revisão?"
- "Liste os relatórios de avaliação institucional dos últimos 2 anos"
- "PPCs de cursos de computação com status pendente"

### 4. Gestão de PPCs

#### Visão Geral
- Dashboard com estatísticas
- Total de PPCs
- PPCs atualizados
- PPCs pendentes

#### Histórico de Versões
- Timeline com todas as versões
- Informações de autor e data
- Status de cada versão
- Download de versões anteriores

#### Comparação de Versões
- Seleção de até 2 versões
- Comparação lado a lado
- Identificação de mudanças

### 5. Controle de Acesso

#### Gestão de Usuários
- Lista completa de usuários
- Filtros por perfil e status
- Último acesso
- Edição de permissões

#### Logs de Auditoria
- Registro de todas as ações
- Usuário, ação, documento
- Data/hora e IP
- Exportação de logs

#### Matriz de Permissões
- Visualização clara de permissões por perfil
- Documentação de cada nível de acesso

## 💾 Modelo de Dados (Preparado para Backend)

### Tabela: documentos
```sql
CREATE TABLE documentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo VARCHAR(500) NOT NULL,
  tipo VARCHAR(100) NOT NULL,
  data_criacao TIMESTAMP DEFAULT NOW(),
  data_atualizacao TIMESTAMP DEFAULT NOW(),
  data_aprovacao TIMESTAMP,
  data_publicacao TIMESTAMP,
  autor VARCHAR(200) NOT NULL,
  setor VARCHAR(200) NOT NULL,
  versao VARCHAR(20),
  status VARCHAR(50),
  curso_id UUID REFERENCES cursos(id),
  arquivo_url TEXT,
  descricao TEXT,
  prazo_revisao DATE,
  search_vector TSVECTOR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tabela: cursos
```sql
CREATE TABLE cursos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome_curso VARCHAR(200) NOT NULL,
  area VARCHAR(100),
  coordenador VARCHAR(200),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Tabela: versoes_documento
```sql
CREATE TABLE versoes_documento (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  documento_id UUID REFERENCES documentos(id),
  versao VARCHAR(20),
  autor VARCHAR(200),
  data_versao TIMESTAMP DEFAULT NOW(),
  arquivo_url TEXT,
  comentario TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Tabela: logs_acesso
```sql
CREATE TABLE logs_acesso (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES auth.users(id),
  usuario_nome VARCHAR(200),
  acao VARCHAR(50),
  documento_id UUID REFERENCES documentos(id),
  documento_titulo VARCHAR(500),
  ip_address INET,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

### Tabela: usuarios (via Supabase Auth)
```sql
-- Gerenciado pelo Supabase Auth
-- Perfil estendido em:
CREATE TABLE perfis_usuario (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  nome VARCHAR(200),
  email VARCHAR(200) UNIQUE,
## 🚀 Como Começar

### Pré-requisitos
- **Node.js** 18+ 
- **npm** ou **yarn**
- Chave do **Firebase** (configurada)

### Instalação Rápida

```bash
# 1. Clonar o repositório
git clone <URL_DO_REPOSITORIO>
cd repositorio-prog-uema

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com suas credenciais Firebase

# 4. Iniciar servidor de desenvolvimento
npm run dev

# 5. Abrir no navegador
# http://localhost:3000
```

### Build para Produção

```bash
# Compilar para produção
npm run build

# Iniciar servidor de produção
npm start
```

### Lint de Código

```bash
npm run lint
```

## 🔑 Configuração do Firebase

### Variáveis de Ambiente Necessárias

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Firebase Client Config
NEXT_PUBLIC_FIREBASE_API_KEY=seu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id

# Firebase Admin Config (Backend)
FIREBASE_ADMIN_SDK_KEY=sua_chave_admin_json
```

## ✨ Funcionalidades Implementadas

### ✅ Completamente Funcional
- 📄 **Upload de documentos** com validação
- 🔍 **Busca e filtros** avançados
- 👤 **Autenticação** com Firebase
- 🔐 **Controle de acesso** por perfis
- 📋 **Lista de documentos** com paginação
- 💾 **Versionamento** automático
- 👥 **Gerenciamento de usuários** (admin)
- 📊 **Logs de auditoria**
- 🎨 **Interface responsiva** (mobile/tablet/desktop)
- ⚡ **Performance otimizada**

### 🚧 Em Desenvolvimento
- 🤖 Integração com IA para buscas inteligentes
- 📈 Dashboard de estatísticas avançadas
- 📧 Notificações por email
- 🔄 Sincronização em tempo real

### 📋 Planejado para Futuro
- LDAP/AD integration
- Multi-tenancy
- Mobile app (React Native)
- API GraphQL
- Análise de dados

## 🧹 Limpeza Recente (Novembro 2025)

### Arquivos Removidos
- ✅ Arquivos CSS duplicados (3 arquivos não utilizados)
- ✅ Componentes UI não utilizados (9 componentes)
- ✅ Diretórios vazios removidos

### Correções Aplicadas
- ✅ Erros de tipo TypeScript corrigidos
- ✅ Imports mal formatados corrigidos
- ✅ Dependências faltantes instaladas

**Resultado:** Build passa com sucesso ✨

## 📊 Estatísticas do Projeto

```
📦 Dependências Principais: 35+
📝 Componentes Desenvolvidos: 49
🎨 Componentes UI (ShadCN): 40
🔧 Custom Hooks: 4
🛠️ Serviços: 2
📚 Tipos TypeScript: 5+
🔌 API Routes: 11+
```

## 🔐 Segurança & Conformidade

### Implementado
- ✅ Autenticação por JWT
- ✅ Controle de acesso baseado em papéis (RBAC)
- ✅ Validação de entrada em formulários
- ✅ Proteção contra XSS/CSRF
- ✅ Logs de auditoria completos
- ✅ Criptografia em trânsito (HTTPS)

### Recomendações
- 🔒 Implementar CORS adequadamente
- 🔒 Usar HTTPS em produção
- 🔒 Realizar auditorias de segurança
- 🔒 Implementar rate limiting
- 🔒 Backup regular de dados

## 📚 Documentação Adiciononal

- 📖 [Guia de Setup Firebase](./FIREBASE_SETUP.md)
- 🔑 [Autenticação](./AUTH_SETUP.md)
- 📦 [Upload de Arquivos](./UPLOAD_SYSTEM_README.md)
- 💾 [Armazenamento](./STORAGE_SETUP.md)
- 🏛️ [Arquitetura do Sistema](./ARCHITECTURE.md)

## 🤝 Como Contribuir

1. Fazer um fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](./LICENSE) para detalhes.

## 👨‍💻 Autor

Desenvolvido pela equipe de desenvolvimento da PROG/UEMA

---

**Última atualização:** Novembro 2025  
**Versão:** 1.0.0  
**Status:** ✅ Production Ready
3. Configurar variáveis de ambiente:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
4. Configurar Storage buckets
5. Configurar RLS policies

## 📱 Responsividade

O sistema é totalmente responsivo:
- **Desktop**: Layout completo com sidebar
- **Tablet**: Layout adaptado com menu colapsável
- **Mobile**: Interface otimizada touch-first

### Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🧪 Testes (Recomendados)

### Unitários
- Jest + React Testing Library
- Cobertura mínima: 80%

### Integração
- Cypress para E2E
- Testes de fluxos críticos

### Acessibilidade
- axe-core para testes automatizados
- Testes manuais com leitores de tela

## 🔄 CI/CD (Recomendado)

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm test
      # Deploy steps
```

## 📈 Métricas e Monitoramento (Recomendado)

- **Sentry** - Error tracking
- **Google Analytics** - Uso e comportamento
- **Supabase Analytics** - Performance do backend
- **Lighthouse** - Performance e SEO

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é proprietário da UEMA - Universidade Estadual do Maranhão.

## 👨‍💻 Autores

- **PROG/UEMA** - Sistema de Gestão de Documentos Acadêmicos

## 📞 Suporte

Para suporte, entre em contato com a equipe PROG/UEMA.

## 🗺️ Roadmap

### Fase 1 - MVP (✅ Completo)
- ✅ Interface frontend completa
- ✅ Componentes de UI
- ✅ Assistente de busca IA
- ✅ Gestão de PPCs
- ✅ Controle de acesso (frontend)
- ✅ Autenticação Firebase

### Fase 2 - Backend (🚧 Em Progresso)
- ⏳ Integração com Supabase completa
- ⏳ Autenticação LDAP/AD
- ⏳ Upload real de arquivos com chunks
- ⏳ Busca full-text otimizada

### Fase 3 - Avançado (📋 Planejado)
- ⏳ OCR de documentos
- ⏳ Assinaturas digitais
- ⏳ Workflow de aprovação
- ⏳ Notificações por email
- ⏳ API REST pública

### Fase 4 - Inteligência (🔮 Futuro)
- ⏳ Análise de sentimento em atas
- ⏳ Extração automática de metadados
- ⏳ Sugestões de atualização de PPCs
- ⏳ Chatbot para consultas
- ⏳ Mobile App (React Native)

## 📚 Documentação Adicional

- 📖 [Guia de Setup Firebase](./FIREBASE_SETUP.md)
- 🔑 [Configuração de Autenticação](./AUTH_SETUP.md)
- 📦 [Sistema de Upload](./UPLOAD_SYSTEM_README.md)
- 💾 [Configuração de Armazenamento](./STORAGE_SETUP.md)
- 📊 [Análise de Viabilidade](./docs/01-planejamento/analise-viabilidade.md)

---

**Versão:** 1.0.0  
**Última Atualização:** Novembro 2025  
**Status:** ✅ Production Ready
