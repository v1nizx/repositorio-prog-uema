# Guia de Configuração do Firebase para Upload de Documentos

## 1. Criar um Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Criar um novo projeto"
3. Preencha o nome do projeto (ex: "PROG-UEMA")
4. Clique em "Continuar"
5. Desabilite o Google Analytics (opcional)
6. Clique em "Criar projeto"

## 2. Configurar Firebase Storage

1. No console do Firebase, vá para "Build" → "Storage"
2. Clique em "Começar"
3. Escolha "Começar no modo de teste" (depois você configurará regras de segurança)
4. Selecione a região mais próxima (ex: `southamerica-east1` para Brasil)
5. Clique em "Criado"

### Regras de Segurança para o Storage

Substitua as regras padrão por:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /documents/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      request.resource.size < 52428800 &&
                      request.resource.contentType.matches('application/pdf|application/vnd\\..*|application/.*xml|text/.*');
    }
  }
}
```

## 3. Configurar Firestore Database

1. No console do Firebase, vá para "Build" → "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha a região (mesmo local do Storage)
4. Clique em "Próximo"
5. Escolha "Começar no modo de teste"
6. Clique em "Criar"

### Regras de Segurança para o Firestore

Substitua as regras padrão por:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /documents/{docId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null && 
                               request.resource.data.title is string &&
                               request.resource.data.type is string &&
                               request.resource.data.author is string &&
                               request.resource.data.sector is string;
      allow delete: if request.auth != null && 
                       request.auth.token.admin == true;
    }
  }
}
```

## 4. Obter as Credenciais do Firebase

1. No console do Firebase, clique no ícone de engrenagem (⚙️)
2. Selecione "Configurações do projeto"
3. Vá para a aba "Aplicativos"
4. Clique em "Criar app" → "Web" (escolher a plataforma web)
5. Siga o assistente e copie a configuração

## 5. Configurar as Variáveis de Ambiente

1. Abra o arquivo `.env.local` na raiz do projeto
2. Preencha com suas credenciais do Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdefghijklmnop
```

## 6. Estrutura de Dados no Firestore

### Coleção: `documents`

Cada documento terá a seguinte estrutura:

```json
{
  "id": "auto_generated_id",
  "title": "PPC - Engenharia da Computação",
  "type": "ppc",
  "author": "Prof. João Silva",
  "sector": "coordenacao-eng",
  "description": "Descrição do documento",
  "fileName": "ppc-eng-comp.pdf",
  "fileSize": 2097152,
  "fileUrl": "https://storage.googleapis.com/...",
  "uploadedAt": "2024-11-26T10:30:00Z",
  "updatedAt": "2024-11-26T10:30:00Z",
  "version": 1,
  "status": "active"
}
```

## 7. Executar o Projeto

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Fazer build
npm build

# Executar em produção
npm start
```

## 8. Usar o Sistema de Upload

### Para Enviadores (Frontend)

1. Navegue até a aba "Upload de Documentos"
2. Selecione um arquivo (PDF, DOCX ou XLSX)
3. Preencha os metadados obrigatórios
4. Clique em "Enviar Documento"

### Para Gerenciadores (API)

#### Upload via API

```bash
curl -X POST http://localhost:3000/api/documents/upload \
  -F "file=@documento.pdf" \
  -F "title=Meu Documento" \
  -F "type=ppc" \
  -F "author=João Silva" \
  -F "sector=coordenacao-eng" \
  -F "description=Uma descrição opcional"
```

#### Listar Documentos

```bash
GET http://localhost:3000/api/documents
```

#### Obter Documento por ID

```bash
GET http://localhost:3000/api/documents/[id]
```

#### Obter Documentos por Tipo

```bash
GET http://localhost:3000/api/documents/type/ppc
```

#### Obter Documentos por Setor

```bash
GET http://localhost:3000/api/documents/sector/coordenacao-eng
```

#### Buscar Documentos

```bash
POST http://localhost:3000/api/documents/search
Content-Type: application/json

{
  "query": "termo de busca"
}
```

#### Atualizar Documento

```bash
PUT http://localhost:3000/api/documents/[id]
Content-Type: application/json

{
  "title": "Novo título",
  "description": "Nova descrição"
}
```

#### Arquivar Documento

```bash
POST http://localhost:3000/api/documents/archive/[id]
```

#### Deletar Documento

```bash
DELETE http://localhost:3000/api/documents/[id]
Content-Type: application/json

{
  "fileUrl": "https://storage.googleapis.com/..."
}
```

## 9. Recursos do Sistema

✅ **Upload de Arquivos**
- Suporta: PDF, DOCX, XLSX
- Tamanho máximo: 50MB
- Validação de tipo e tamanho

✅ **Gerenciamento de Metadados**
- Título
- Tipo de Documento
- Autor
- Setor
- Descrição

✅ **Versionamento Automático**
- Mantém histórico de versões
- Incrementa versão automaticamente

✅ **Status de Documentos**
- Active (ativo)
- Archived (arquivado)

✅ **Busca e Filtros**
- Busca por título
- Busca por descrição
- Filtro por tipo
- Filtro por setor

✅ **Monitoramento de Upload**
- Barra de progresso
- Velocidade de upload
- Percentual de conclusão

## 10. Autenticação (Opcional)

Para implementar autenticação:

1. No console do Firebase, ative "Authentication"
2. Configure o método de login desejado (Email/Senha, Google, etc.)
3. Atualize as regras de segurança para incluir autenticação

## 11. Troubleshooting

### Erro: "Missing or insufficient permissions"

- Verifique se as regras de segurança estão configuradas corretamente
- Certifique-se de que a autenticação está ativada

### Erro: "File is too large"

- O tamanho máximo é 50MB
- Reduza o tamanho do arquivo e tente novamente

### Erro: "Invalid file type"

- Apenas PDF, DOCX e XLSX são aceitos
- Verifique o tipo de arquivo

### Arquivo não aparece no Firestore

- Verifique a conexão com a internet
- Verifique as variáveis de ambiente
- Verifique os logs do navegador (F12)

## 12. Backup e Segurança

Para fazer backup dos seus documentos:

1. Acesse o Firebase Console
2. Vá para "Storage"
3. Exporte todos os arquivos regularmente

Para restaurar:

1. Upload manual dos arquivos
2. Recrie os metadados no Firestore

---

**Desenvolvido para PROG-UEMA**
**Data: 2024-11-26**
