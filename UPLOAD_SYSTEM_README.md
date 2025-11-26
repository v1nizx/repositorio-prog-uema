# Sistema de Upload de Documentos com Firebase

## Resumo da Implementação

Este documento descreve a implementação completa do sistema de upload de documentos usando Firebase Storage e Firestore.

## Arquivos Criados/Modificados

### 1. **Configuração Firebase**
- `src/config/firebase.config.ts` - Inicialização do Firebase
- `.env.local` - Variáveis de ambiente (preencher com suas credenciais)

### 2. **Serviços**
- `src/services/uploadService.ts` - Lógica de upload e gerenciamento de documentos
  - Upload de arquivos
  - Listagem de documentos
  - Busca e filtros
  - Atualização de metadados
  - Arquivamento e exclusão
  - Incremento de versão

### 3. **Hooks React**
- `src/hooks/useDocumentUpload.ts`
  - `useDocumentUpload()` - Hook para fazer upload
  - `useDocuments()` - Hook para gerenciar documentos

### 4. **Rotas API (Next.js)**
- `app/api/documents/upload/route.ts` - POST para fazer upload
- `app/api/documents/route.ts` - GET para listar documentos
- `app/api/documents/[id]/route.ts` - GET, PUT, DELETE para um documento
- `app/api/documents/type/[type]/route.ts` - GET documentos por tipo
- `app/api/documents/sector/[sector]/route.ts` - GET documentos por setor
- `app/api/documents/search/route.ts` - POST para buscar documentos
- `app/api/documents/archive/[id]/route.ts` - POST para arquivar documento

### 5. **Componentes**
- `src/components/DocumentUpload.tsx` - Componente de upload (atualizado)
- `src/components/DocumentList.tsx` - Listagem de documentos (atualizado)

### 6. **Tipos**
- `src/types/document.ts` - Tipos TypeScript para documentos

### 7. **Documentação**
- `FIREBASE_SETUP.md` - Guia completo de configuração do Firebase

## Fluxo de Funcionamento

### 1. Upload de Documento

```
Usuário seleciona arquivo
        ↓
Preenche metadados
        ↓
Clica em "Enviar"
        ↓
Hook useDocumentUpload chama upload()
        ↓
Arquivo enviado para Firebase Storage
        ↓
URL do arquivo obtida
        ↓
Metadados salvos em Firestore
        ↓
Documento criado com versão 1
        ↓
Sucesso notificado ao usuário
```

### 2. Listagem de Documentos

```
Componente DocumentList monta
        ↓
useDocuments().fetchDocuments() chamado
        ↓
GET /api/documents/route.ts
        ↓
uploadService.getAllDocuments()
        ↓
Query ao Firestore (status = 'active')
        ↓
Documentos retornados
        ↓
Renderizados na tabela
```

### 3. Download de Documento

```
Usuário clica em "Download"
        ↓
fileUrl do Firebase Storage obtida
        ↓
Navegador baixa o arquivo
```

### 4. Exclusão de Documento

```
Usuário clica em "Deletar"
        ↓
Confirmação solicitada
        ↓
DELETE /api/documents/[id]
        ↓
Arquivo removido do Storage
        ↓
Documento removido do Firestore
        ↓
Lista atualizada
```

## Recursos Implementados

### ✅ Upload de Arquivos
- Validação de tipo (PDF, DOCX, XLSX)
- Validação de tamanho (máx 50MB)
- Barra de progresso de upload
- Suporte a drag-and-drop
- Tratamento de erros

### ✅ Gerenciamento de Metadados
- Título (obrigatório)
- Tipo de Documento (obrigatório)
- Autor (obrigatório)
- Setor (obrigatório)
- Descrição (opcional)

### ✅ Listagem de Documentos
- Tabela com informações principais
- Download direto
- Arquivamento soft-delete
- Exclusão permanente
- Informações de versão

### ✅ Busca e Filtros
- Busca por título
- Busca por descrição
- Endpoint de busca dedicado
- Filtros por tipo e setor

### ✅ Versionamento
- Versão automática (começando em 1)
- Endpoint para incrementar versão
- Histórico mantido no banco de dados

### ✅ Status de Documento
- Ativo (padrão)
- Arquivado (soft delete)

## Variáveis de Ambiente

Preencha `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Como Começar

1. **Configurar Firebase** (ver `FIREBASE_SETUP.md`)
2. **Preencher `.env.local` com credenciais**
3. **Instalar dependências**
   ```bash
   npm install
   ```
4. **Executar em desenvolvimento**
   ```bash
   npm run dev
   ```
5. **Acessar** http://localhost:3000

## Endpoints da API

### Upload
```
POST /api/documents/upload
Content-Type: multipart/form-data

Parâmetros:
- file: File
- title: string
- type: string
- author: string
- sector: string
- description: string (opcional)

Resposta: Document
```

### Listar Documentos
```
GET /api/documents

Resposta: Document[]
```

### Obter Documento
```
GET /api/documents/[id]

Resposta: Document
```

### Atualizar Documento
```
PUT /api/documents/[id]
Content-Type: application/json

Body: Partial<Document>

Resposta: { success: true }
```

### Deletar Documento
```
DELETE /api/documents/[id]
Content-Type: application/json

Body: { fileUrl?: string }

Resposta: { success: true }
```

### Documentos por Tipo
```
GET /api/documents/type/[type]

Resposta: Document[]
```

### Documentos por Setor
```
GET /api/documents/sector/[sector]

Resposta: Document[]
```

### Buscar
```
POST /api/documents/search
Content-Type: application/json

Body: { query: string }

Resposta: Document[]
```

### Arquivar
```
POST /api/documents/archive/[id]

Resposta: { success: true }
```

## Estrutura de Dados (Firestore)

### Coleção: `documents`

```json
{
  "title": "string",
  "type": "ppc|resolucao|relatorio|ata|dados|processo",
  "author": "string",
  "sector": "coordenacao-eng|coordenacao-comp|secretaria|colegiado|cpa|registro",
  "description": "string",
  "fileName": "string",
  "fileSize": "number",
  "fileUrl": "string",
  "uploadedAt": "timestamp",
  "updatedAt": "timestamp",
  "version": "number",
  "status": "active|archived"
}
```

## Segurança

### Regras do Firebase Storage
- Apenas usuários autenticados podem ler/escrever
- Tamanho máximo: 50MB
- Apenas tipos MIME permitidos

### Regras do Firestore
- Leitura: usuários autenticados
- Escrita: usuários autenticados com validação
- Exclusão: apenas administradores

## Performance

- ✅ Upload com monitoramento de progresso
- ✅ Lazy loading de documentos
- ✅ Cache de metadados
- ✅ Queries otimizadas no Firestore
- ✅ Nomes de arquivo com timestamp para evitar conflitos

## Próximas Melhorias

- [ ] Autenticação via Firebase Auth
- [ ] Paginação de documentos
- [ ] Visualização de preview de PDFs
- [ ] Histórico completo de versões
- [ ] Controle de permissões por usuário
- [ ] Notificações de novo upload
- [ ] Exportar lista de documentos (CSV/Excel)
- [ ] Análise de uso de documentos
- [ ] Integração com antivírus
- [ ] OCR para busca dentro de documentos

## Suporte

Para problemas ou dúvidas:
1. Consulte `FIREBASE_SETUP.md`
2. Verifique os logs do navegador (F12)
3. Verifique os logs do servidor
4. Verifique as regras de segurança do Firebase

---

**Desenvolvido para PROG-UEMA**
**Data: 26 de novembro de 2024**
