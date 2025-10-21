# API Reference - Sistema PROG

## 📌 Visão Geral

Esta documentação descreve as APIs do Sistema PROG quando integrado com o backend Supabase. As APIs seguem padrões REST e utilizam autenticação JWT.

## 🔐 Autenticação

### Base URL
```
https://[seu-projeto].supabase.co
```

### Headers Obrigatórios
```http
Authorization: Bearer [JWT_TOKEN]
apikey: [SUPABASE_ANON_KEY]
Content-Type: application/json
```

### Autenticação de Usuário

#### Login
```http
POST /auth/v1/token?grant_type=password
```

**Request Body:**
```json
{
  "email": "usuario@universidade.edu.br",
  "password": "senha123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "refresh_token_string",
  "user": {
    "id": "uuid",
    "email": "usuario@universidade.edu.br",
    "role": "authenticated"
  }
}
```

#### Logout
```http
POST /auth/v1/logout
```

#### Refresh Token
```http
POST /auth/v1/token?grant_type=refresh_token
```

**Request Body:**
```json
{
  "refresh_token": "refresh_token_string"
}
```

## 📄 Documentos

### Listar Documentos

```http
GET /rest/v1/documentos
```

**Query Parameters:**
- `tipo` (string): Filtrar por tipo de documento
- `status` (string): Filtrar por status
- `setor` (string): Filtrar por setor
- `limit` (number): Número de resultados (default: 50)
- `offset` (number): Paginação
- `order` (string): Ordenação (ex: `data_atualizacao.desc`)

**Exemplo:**
```http
GET /rest/v1/documentos?tipo=eq.PPC&status=eq.Aprovado&order=data_atualizacao.desc&limit=20
```

**Response:**
```json
[
  {
    "id": "uuid",
    "titulo": "PPC - Engenharia de Software 2024",
    "tipo": "PPC",
    "data_criacao": "2024-03-15T10:00:00Z",
    "data_atualizacao": "2024-03-15T10:00:00Z",
    "autor": "Prof. Maria Santos",
    "setor": "Coordenação de Engenharia",
    "versao": "3.2",
    "status": "Aprovado",
    "curso_id": "uuid",
    "arquivo_url": "https://...",
    "descricao": "Projeto Pedagógico atualizado..."
  }
]
```

### Buscar Documento por ID

```http
GET /rest/v1/documentos?id=eq.{id}
```

**Response:**
```json
{
  "id": "uuid",
  "titulo": "PPC - Engenharia de Software 2024",
  "tipo": "PPC",
  "data_criacao": "2024-03-15T10:00:00Z",
  "data_atualizacao": "2024-03-15T10:00:00Z",
  "autor": "Prof. Maria Santos",
  "setor": "Coordenação de Engenharia",
  "versao": "3.2",
  "status": "Aprovado",
  "curso_id": "uuid",
  "arquivo_url": "https://...",
  "descricao": "Projeto Pedagógico atualizado..."
}
```

### Criar Documento

```http
POST /rest/v1/documentos
```

**Request Body:**
```json
{
  "titulo": "PPC - Ciência da Computação 2024",
  "tipo": "PPC",
  "autor": "Prof. Carlos Oliveira",
  "setor": "Coordenação de Computação",
  "versao": "1.0",
  "status": "Em Revisão",
  "curso_id": "uuid",
  "descricao": "Nova versão do PPC"
}
```

**Response:**
```json
{
  "id": "uuid",
  "titulo": "PPC - Ciência da Computação 2024",
  "tipo": "PPC",
  "data_criacao": "2024-03-20T14:30:00Z",
  "data_atualizacao": "2024-03-20T14:30:00Z",
  "autor": "Prof. Carlos Oliveira",
  "setor": "Coordenação de Computação",
  "versao": "1.0",
  "status": "Em Revisão",
  "curso_id": "uuid",
  "arquivo_url": null,
  "descricao": "Nova versão do PPC"
}
```

### Atualizar Documento

```http
PATCH /rest/v1/documentos?id=eq.{id}
```

**Request Body:**
```json
{
  "status": "Aprovado",
  "data_aprovacao": "2024-03-21T10:00:00Z"
}
```

**Response:**
```json
{
  "id": "uuid",
  "titulo": "PPC - Ciência da Computação 2024",
  "status": "Aprovado",
  "data_aprovacao": "2024-03-21T10:00:00Z",
  "data_atualizacao": "2024-03-21T10:00:00Z"
}
```

### Excluir Documento

```http
DELETE /rest/v1/documentos?id=eq.{id}
```

**Response:**
```
204 No Content
```

### Busca Full-Text

```http
POST /rest/v1/rpc/search_documents
```

**Request Body:**
```json
{
  "search_query": "engenharia software",
  "document_type": "PPC",
  "limit_results": 20
}
```

**Response:**
```json
[
  {
    "id": "uuid",
    "titulo": "PPC - Engenharia de Software 2024",
    "tipo": "PPC",
    "rank": 0.982,
    "excerpt": "...Engenharia de Software contempla disciplinas...",
    "data_atualizacao": "2024-03-15T10:00:00Z"
  }
]
```

## 📚 Cursos

### Listar Cursos

```http
GET /rest/v1/cursos
```

**Response:**
```json
[
  {
    "id": "uuid",
    "nome_curso": "Engenharia de Software",
    "area": "Computação",
    "coordenador": "Prof. Maria Santos",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### Criar Curso

```http
POST /rest/v1/cursos
```

**Request Body:**
```json
{
  "nome_curso": "Sistemas de Informação",
  "area": "Computação",
  "coordenador": "Prof. Roberto Lima"
}
```

## 📝 Versões de Documentos

### Listar Versões de um Documento

```http
GET /rest/v1/versoes_documento?documento_id=eq.{id}&order=data_versao.desc
```

**Response:**
```json
[
  {
    "id": "uuid",
    "documento_id": "uuid",
    "versao": "3.1",
    "autor": "Prof. Maria Santos",
    "data_versao": "2023-09-10T10:00:00Z",
    "arquivo_url": "https://...",
    "comentario": "Atualização de matriz curricular"
  },
  {
    "id": "uuid",
    "documento_id": "uuid",
    "versao": "3.0",
    "autor": "Prof. João Costa",
    "data_versao": "2023-03-01T10:00:00Z",
    "arquivo_url": "https://...",
    "comentario": "Revisão completa do PPC"
  }
]
```

### Criar Nova Versão

```http
POST /rest/v1/versoes_documento
```

**Request Body:**
```json
{
  "documento_id": "uuid",
  "versao": "3.2",
  "autor": "Prof. Maria Santos",
  "arquivo_url": "https://...",
  "comentario": "Inclusão de novas disciplinas"
}
```

## 👥 Perfis de Usuário

### Obter Perfil do Usuário Logado

```http
GET /rest/v1/perfis_usuario?id=eq.{user_id}
```

**Response:**
```json
{
  "id": "uuid",
  "nome": "João Silva",
  "email": "joao.silva@universidade.edu.br",
  "perfil": "Administrador",
  "departamento": "TI",
  "status": "Ativo",
  "ultimo_acesso": "2024-03-20T14:30:00Z",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Listar Usuários (Admin)

```http
GET /rest/v1/perfis_usuario
```

**Query Parameters:**
- `perfil` (string): Filtrar por perfil
- `status` (string): Filtrar por status
- `departamento` (string): Filtrar por departamento

**Response:**
```json
[
  {
    "id": "uuid",
    "nome": "João Silva",
    "email": "joao.silva@universidade.edu.br",
    "perfil": "Administrador",
    "departamento": "TI",
    "status": "Ativo",
    "ultimo_acesso": "2024-03-20T14:30:00Z"
  }
]
```

### Criar Usuário (Admin)

```http
POST /rest/v1/perfis_usuario
```

**Request Body:**
```json
{
  "nome": "Ana Costa",
  "email": "ana.costa@universidade.edu.br",
  "perfil": "Editor",
  "departamento": "Coordenação de Engenharia",
  "status": "Ativo"
}
```

### Atualizar Perfil (Admin)

```http
PATCH /rest/v1/perfis_usuario?id=eq.{id}
```

**Request Body:**
```json
{
  "perfil": "Administrador",
  "departamento": "Secretaria Geral"
}
```

## 📊 Logs de Acesso

### Listar Logs

```http
GET /rest/v1/logs_acesso?order=timestamp.desc&limit=100
```

**Query Parameters:**
- `usuario_id` (uuid): Filtrar por usuário
- `acao` (string): Filtrar por tipo de ação
- `documento_id` (uuid): Filtrar por documento

**Response:**
```json
[
  {
    "id": "uuid",
    "usuario_id": "uuid",
    "usuario_nome": "João Silva",
    "acao": "Visualizou",
    "documento_id": "uuid",
    "documento_titulo": "PPC - Engenharia de Software 2024",
    "ip_address": "192.168.1.100",
    "timestamp": "2024-03-20T14:30:25Z"
  }
]
```

### Criar Log

```http
POST /rest/v1/logs_acesso
```

**Request Body:**
```json
{
  "usuario_id": "uuid",
  "usuario_nome": "João Silva",
  "acao": "Baixou",
  "documento_id": "uuid",
  "documento_titulo": "PPC - Engenharia de Software 2024",
  "ip_address": "192.168.1.100"
}
```

## 📁 Storage (Arquivos)

### Upload de Arquivo

```http
POST /storage/v1/object/documents/{path}
```

**Headers:**
```http
Authorization: Bearer [JWT_TOKEN]
Content-Type: [MIME_TYPE]
```

**Body:** Binary file data

**Response:**
```json
{
  "Key": "documents/ppcs/uuid/documento.pdf",
  "Id": "uuid",
  "FullPath": "https://[projeto].supabase.co/storage/v1/object/public/documents/ppcs/uuid/documento.pdf"
}
```

### Download de Arquivo

```http
GET /storage/v1/object/public/documents/{path}
```

**Response:** Binary file data

### Listar Arquivos

```http
POST /storage/v1/object/list/documents
```

**Request Body:**
```json
{
  "prefix": "ppcs/",
  "limit": 100,
  "offset": 0
}
```

**Response:**
```json
[
  {
    "name": "documento.pdf",
    "id": "uuid",
    "updated_at": "2024-03-20T14:30:00Z",
    "created_at": "2024-03-20T14:30:00Z",
    "last_accessed_at": "2024-03-20T14:30:00Z",
    "metadata": {
      "mimetype": "application/pdf",
      "size": 1024000
    }
  }
]
```

### Excluir Arquivo

```http
DELETE /storage/v1/object/documents/{path}
```

**Response:**
```json
{
  "message": "Successfully deleted"
}
```

## 🔍 RPC Functions (Funções Customizadas)

### Busca Inteligente

```http
POST /rest/v1/rpc/search_documents
```

**Request Body:**
```json
{
  "search_query": "engenharia",
  "document_type": "PPC",
  "limit_results": 20
}
```

**SQL Function:**
```sql
CREATE OR REPLACE FUNCTION search_documents(
  search_query TEXT,
  document_type TEXT DEFAULT NULL,
  limit_results INT DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  titulo VARCHAR,
  tipo VARCHAR,
  rank REAL,
  excerpt TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id,
    d.titulo,
    d.tipo,
    ts_rank(d.search_vector, plainto_tsquery('portuguese', search_query))::REAL AS rank,
    ts_headline(
      'portuguese',
      d.descricao,
      plainto_tsquery('portuguese', search_query),
      'MaxWords=50, MinWords=25'
    ) AS excerpt
  FROM documentos d
  WHERE d.search_vector @@ plainto_tsquery('portuguese', search_query)
    AND (document_type IS NULL OR d.tipo = document_type)
  ORDER BY rank DESC
  LIMIT limit_results;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Estatísticas de PPCs

```http
POST /rest/v1/rpc/get_ppc_statistics
```

**Response:**
```json
{
  "total_ppcs": 45,
  "ppcs_atualizados": 30,
  "ppcs_pendentes": 5,
  "ppcs_em_revisao": 10,
  "por_area": {
    "Computação": 15,
    "Engenharia": 20,
    "Saúde": 10
  }
}
```

### Documentos Próximos ao Vencimento

```http
POST /rest/v1/rpc/get_expiring_documents
```

**Request Body:**
```json
{
  "days_threshold": 30
}
```

**Response:**
```json
[
  {
    "id": "uuid",
    "titulo": "PPC - Sistemas de Informação",
    "tipo": "PPC",
    "prazo_revisao": "2024-04-15",
    "dias_restantes": 25
  }
]
```

## 📡 Real-time Subscriptions

### Assinar Mudanças em Documentos

```javascript
const subscription = supabase
  .channel('documents-channel')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'documentos'
    },
    (payload) => {
      console.log('Mudança detectada:', payload);
    }
  )
  .subscribe();
```

### Assinar Logs de Acesso

```javascript
const subscription = supabase
  .channel('logs-channel')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'logs_acesso'
    },
    (payload) => {
      console.log('Nova ação registrada:', payload);
    }
  )
  .subscribe();
```

## ⚠️ Códigos de Erro

### HTTP Status Codes

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 204 | Sucesso sem conteúdo |
| 400 | Requisição inválida |
| 401 | Não autenticado |
| 403 | Sem permissão |
| 404 | Recurso não encontrado |
| 409 | Conflito (ex: duplicata) |
| 422 | Entidade não processável |
| 500 | Erro interno do servidor |

### Formato de Erro

```json
{
  "code": "PGRST116",
  "message": "The result contains 0 rows",
  "details": null,
  "hint": null
}
```

## 🔒 Rate Limiting

- **Autenticado**: 100 requests/minuto
- **Não autenticado**: 30 requests/minuto
- **Upload**: 10 MB/minuto

## 📝 Exemplos de Uso

### JavaScript/TypeScript (Supabase Client)

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://[projeto].supabase.co',
  '[SUPABASE_ANON_KEY]'
);

// Listar documentos
const { data, error } = await supabase
  .from('documentos')
  .select('*')
  .eq('tipo', 'PPC')
  .order('data_atualizacao', { ascending: false })
  .limit(20);

// Criar documento
const { data: newDoc, error } = await supabase
  .from('documentos')
  .insert({
    titulo: 'Novo PPC',
    tipo: 'PPC',
    autor: 'Prof. Silva'
  })
  .select()
  .single();

// Upload de arquivo
const { data: uploadData, error } = await supabase
  .storage
  .from('documents')
  .upload('ppcs/uuid/arquivo.pdf', file);

// Busca full-text
const { data: results, error } = await supabase
  .rpc('search_documents', {
    search_query: 'engenharia',
    document_type: 'PPC',
    limit_results: 20
  });
```

### cURL

```bash
# Listar documentos
curl -X GET 'https://[projeto].supabase.co/rest/v1/documentos?tipo=eq.PPC' \
  -H "apikey: [SUPABASE_ANON_KEY]" \
  -H "Authorization: Bearer [JWT_TOKEN]"

# Criar documento
curl -X POST 'https://[projeto].supabase.co/rest/v1/documentos' \
  -H "apikey: [SUPABASE_ANON_KEY]" \
  -H "Authorization: Bearer [JWT_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Novo PPC",
    "tipo": "PPC",
    "autor": "Prof. Silva"
  }'

# Upload arquivo
curl -X POST 'https://[projeto].supabase.co/storage/v1/object/documents/arquivo.pdf' \
  -H "apikey: [SUPABASE_ANON_KEY]" \
  -H "Authorization: Bearer [JWT_TOKEN]" \
  -H "Content-Type: application/pdf" \
  --data-binary @arquivo.pdf
```

---

**Versão**: 1.0.0  
**Última Atualização**: Março 2024
