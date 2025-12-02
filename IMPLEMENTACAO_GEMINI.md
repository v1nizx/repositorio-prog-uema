# 🚀 Integração Gemini AI - Busca Avançada

## ✅ Implementação Concluída

### 📦 Pacotes Instalados
- ✅ `@google/generative-ai` - SDK do Google Generative AI

### 📝 Arquivos Criados
1. **`/app/api/ai/analyze/route.ts`** - Rota de API segura para análise com Gemini
2. **`/src/services/gemini.service.ts`** - Serviço de integração com Gemini
3. **`/src/config/ai.config.js`** - Configurações de IA
4. **`/.env.local.example`** - Exemplo de variáveis de ambiente
5. **`/GEMINI_SETUP.md`** - Guia de configuração completo

### 🔄 Arquivos Atualizados
- **`/src/components/AISearchAssistant.tsx`** - Componente refatorado para usar IA real

## 🔧 Como Configurar

### Passo 1: Obter a Chave de API
1. Acesse: https://makersuite.google.com/app/apikey
2. Faça login com sua conta Google
3. Clique em **"Create API Key"**
4. Copie a chave gerada

### Passo 2: Configurar Variáveis de Ambiente
1. Na raiz do projeto, crie/edite o arquivo `.env.local`
2. Adicione sua chave:
```env
GEMINI_API_KEY=sua_chave_aqui
```

### Passo 3: Reiniciar o Servidor
```bash
npm run dev
```

## 🎯 Funcionalidades

### Componente AISearchAssistant
- ✅ Entrada em linguagem natural
- ✅ Análise com Gemini AI
- ✅ Extração automática de entidades
- ✅ Geração de SQL otimizado
- ✅ Visualização de resultados
- ✅ Copiar SQL para clipboard
- ✅ Tratamento de erros

### Entidades Reconhecidas
- 📄 Tipos: PPC, Resolução, Relatório, Processo, Ofício, Memorando, Parecer
- 🎓 Cursos: Ciência da Computação, Engenharia de Software, Sistemas de Informação, etc.
- 🏢 Setores: Coordenação de Computação, Engenharia, Secretaria Geral, CPA, Reitoria
- 📅 Períodos: Últimos 6 meses, 2024, etc.
- ✔️ Status: Aprovado, Vigente, Publicado, Em Revisão, Pendente, Rascunho

## 📚 Exemplos de Consultas

```
"Quais PPCs foram atualizados nos últimos 6 meses?"
"Mostre todas as resoluções sobre TCC aprovadas em 2024"
"Quais documentos da Coordenação de Engenharia precisam de revisão?"
"Liste os relatórios de avaliação institucional dos últimos 2 anos"
"PPCs de cursos de computação com status pendente"
```

## 🔐 Segurança

✅ **Chave de API armazenada apenas no servidor** (não exposta ao cliente)
✅ **Requisições via rota de API protegida**
✅ **Nenhuma chave sensível no frontend**
✅ **Variáveis de ambiente isoladas**

## 📂 Estrutura de Arquivos

```
/app/api/ai/analyze/route.ts          # Rota de API
/src/services/gemini.service.ts       # Serviço Gemini
/src/config/ai.config.js              # Config de IA
/src/components/AISearchAssistant.tsx  # Componente UI
/.env.local.example                   # Exemplo de env
/GEMINI_SETUP.md                      # Guia de setup
```

## 🚨 Troubleshooting

### Erro: "Erro ao processar consulta"
- ✅ Verifique se `.env.local` contém `GEMINI_API_KEY`
- ✅ Confirme que a chave é válida
- ✅ Reinicie o servidor Next.js

### Erro: "Cannot find module '@google/generative-ai'"
- ✅ Execute: `npm install @google/generative-ai`

### Resposta da IA em formato inválido
- ✅ Tente formular a consulta de forma mais clara
- ✅ Ajuste o prompt do sistema em `/app/api/ai/analyze/route.ts`

## 📖 Documentação

Para mais detalhes, consulte:
- `/GEMINI_SETUP.md` - Guia completo de configuração
- [Google Generative AI SDK](https://github.com/google/generative-ai-js)
- [Documentação da API Gemini](https://ai.google.dev/docs)

---

**Status**: ✅ Implementação Completa
**Próximos Passos**: Configurar chave de API e testar
