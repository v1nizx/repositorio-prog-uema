# Sistema PROG - Gestão de Documentos Acadêmicos

Sistema de gerenciamento de documentos acadêmicos desenvolvido para a PROG/UEMA, com funcionalidades avançadas de busca, versionamento automático e controle de acesso baseado em perfis.

## 📋 Visão Geral

O Sistema PROG é uma aplicação web moderna para gestão de documentos acadêmicos, incluindo PPCs (Projetos Pedagógicos de Curso), resoluções, relatórios e atas. O sistema oferece busca inteligente com IA, versionamento automático e controle granular de permissões.

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

## 🏗️ Arquitetura

### Estrutura de Componentes

```
/components
├── Header.tsx              # Cabeçalho com perfil do usuário
├── Sidebar.tsx             # Menu lateral com navegação
├── DocumentList.tsx        # Lista de documentos com filtros
├── DocumentUpload.tsx      # Upload de documentos com metadados
├── PPCManagement.tsx       # Gestão específica de PPCs
├── SearchPanel.tsx         # Painel de busca com tabs
├── AISearchAssistant.tsx   # Assistente IA para buscas
└── AccessControl.tsx       # Controle de usuários e permissões
```

### Componentes UI (ShadCN)

Utiliza componentes pré-construídos do ShadCN/UI para garantir consistência e acessibilidade:
- Tabelas, Cards, Badges
- Dialogs, Dropdowns, Tabs
- Forms, Inputs, Selects
- Alerts, Tooltips, etc.

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS v4** - Estilização
- **ShadCN/UI** - Componentes acessíveis

### Ícones e UI
- **Lucide React** - Biblioteca de ícones
- **Recharts** - Gráficos (pronto para uso)

### Backend (Preparado)
- **Supabase** - Backend as a Service
  - PostgreSQL - Banco de dados
  - Storage - Armazenamento de arquivos
  - Auth - Autenticação
  - Row Level Security - Segurança

## 👥 Perfis de Usuário

### 1. Administrador
**Permissões:**
- ✅ Upload, edição e exclusão de documentos
- ✅ Gestão completa de PPCs
- ✅ Gerenciamento de usuários e permissões
- ✅ Acesso a todos os logs e relatórios

### 2. Editor
**Permissões:**
- ✅ Upload e edição de documentos
- ✅ Gestão de PPCs do seu departamento
- ❌ Sem acesso ao controle de usuários

### 3. Consultor
**Permissões:**
- ✅ Visualização e download de documentos
- ✅ Busca e consulta de PPCs
- ❌ Sem permissão de upload ou edição

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
  perfil VARCHAR(50) CHECK (perfil IN ('Administrador', 'Editor', 'Consultor')),
  departamento VARCHAR(200),
  status VARCHAR(20) DEFAULT 'Ativo',
  ultimo_acesso TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🎨 Design System

### Cores Principais
- **Primary**: Blue 600 (#2563eb)
- **Secondary**: Purple 600 (#9333ea)
- **Success**: Green 600 (#16a34a)
- **Warning**: Yellow 600 (#ca8a04)
- **Danger**: Red 600 (#dc2626)

### Tipografia
Definida em `styles/globals.css`:
- Sistema de fonte padrão otimizado
- Escalas de tamanho responsivas
- Hierarquia visual clara

### Espaçamento
- Base: 0.25rem (4px)
- Escala: 1, 2, 3, 4, 6, 8, 12, 16, 24, 32

## 🔐 Segurança

### Autenticação
- Preparado para integração LDAP/AD
- Supabase Auth para alternativa moderna
- JWT tokens para sessões

### Autorização
- Row Level Security (RLS) no Supabase
- Verificação de permissões em nível de componente
- Logs de auditoria completos

### Proteção de Dados
- Criptografia em trânsito (TLS 1.3)
- Criptografia em repouso (Supabase)
- Backup automático diário

## 📊 Performance

### Otimizações Frontend
- Code splitting por rota
- Lazy loading de componentes
- Memoização de cálculos pesados
- Virtual scrolling para listas grandes

### Otimizações Backend (Recomendadas)
- Índices em campos de busca
- Full-text search com PostgreSQL
- Cache de queries frequentes
- CDN para arquivos estáticos

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação Local
```bash
# Clonar o repositório
git clone [URL_DO_REPOSITORIO]

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

### Configuração do Supabase (Quando conectado)
1. Criar projeto no Supabase
2. Executar migrations do schema
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

### Fase 1 - MVP (Atual)
- ✅ Interface frontend completa
- ✅ Componentes de UI
- ✅ Assistente de busca IA
- ✅ Gestão de PPCs
- ✅ Controle de acesso (frontend)

### Fase 2 - Backend
- ⏳ Integração com Supabase
- ⏳ Autenticação LDAP/AD
- ⏳ Upload real de arquivos
- ⏳ Busca full-text

### Fase 3 - Avançado
- ⏳ OCR de documentos
- ⏳ Assinaturas digitais
- ⏳ Workflow de aprovação
- ⏳ Notificações automáticas
- ⏳ API pública

### Fase 4 - Inteligência
- ⏳ Análise de sentimento em atas
- ⏳ Extração automática de metadados
- ⏳ Sugestões de atualização de PPCs
- ⏳ Chatbot para consultas

## 📚 Documentação Adicional

- [Guia de Estilo](./docs/STYLE_GUIDE.md) _(a criar)_
- [API Reference](./docs/API.md) _(a criar)_
- [Deployment Guide](./docs/DEPLOYMENT.md) _(a criar)_
- [User Manual](./docs/USER_MANUAL.md) _(a criar)_

---

**Versão**: 1.0.0  
**Última Atualização**: Março 2024  
**Status**: MVP - Frontend Completo
