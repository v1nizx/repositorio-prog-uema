# 📚 Repositório Institucional PROG/UEMA

<div align="center">

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![PostgreSQL](https://img.shields.io/badge/postgresql-%3E%3D15.0-blue)
![React](https://img.shields.io/badge/react-18.2.0-61dafb)
![License](https://img.shields.io/badge/license-MIT-green)

**Sistema de Gerenciamento Digital de Documentos Acadêmicos**

[Funcionalidades](#-funcionalidades) • [Instalação](#-instalação) • [Documentação](#-documentação) • [Contribuir](#-como-contribuir)

</div>

---

## 📖 Sobre o Projeto

O **Repositório Institucional PROG/UEMA** é uma solução digital desenvolvida para a Pró-Reitoria de Graduação da Universidade Estadual do Maranhão, com o objetivo de centralizar, organizar e facilitar o acesso a documentos acadêmicos institucionais[web:21][web:22].

O sistema oferece uma plataforma moderna e intuitiva para gerenciamento de **Projetos Pedagógicos de Curso (PPCs)**, resoluções, portarias, relatórios e demais documentos administrativos, incorporando recursos de **Inteligência Artificial** para busca semântica e recuperação inteligente de informações[web:13][web:22].

### 🎯 Objetivos

- Centralizar documentos acadêmicos em ambiente digital seguro
- Facilitar consultas rápidas através de busca inteligente com IA
- Implementar versionamento automático de documentos
- Garantir rastreabilidade com controle de acesso e logs de auditoria
- Promover transparência e conformidade com a Lei de Acesso à Informação[web:21][web:22]

---

## ✨ Funcionalidades

### Gerenciamento de Documentos
- 📤 **Upload e armazenamento** de múltiplos formatos (PDF, DOCX, XLSX)
- 🏷️ **Classificação automática** com metadados estruturados
- 📋 **Versionamento inteligente** com histórico completo de alterações
- 🔍 **Sistema de busca avançada** com filtros personalizados[web:22][web:29]

### Busca Inteligente com IA
- 🤖 **Processamento de linguagem natural** para consultas em português
- 💡 **Sugestões contextuais** baseadas no histórico de buscas
- 🎯 **Busca semântica** que compreende a intenção do usuário
- 📊 **Relevância automática** dos resultados[web:13][web:29]

### Gestão de PPCs
- 📘 **Repositório específico** para Projetos Pedagógicos de Curso
- 🔄 **Comparação entre versões** de PPCs
- 📈 **Relatórios de status** de atualização por curso
- 🎓 **Vinculação com dados** de graduação[web:22][web:29]

### Controle e Segurança
- 🔐 **Autenticação integrada** (LDAP/Active Directory)
- 👥 **Perfis de acesso** diferenciados (Administrador, Editor, Consultor)
- 📝 **Logs de auditoria** completos
- ✅ **Fluxo de aprovação** configurável[web:21][web:29]

---

## 🛠️ Tecnologias

### Backend
- **Node.js** (v18+) - Runtime JavaScript
- **Express.js** - Framework web minimalista
- **PostgreSQL** (v15+) - Banco de dados relacional
- **Sequelize** - ORM para Node.js
- **JWT** - Autenticação e autorização[web:26][web:29][web:38]

### Frontend
- **React** (v18.2) - Biblioteca para interfaces
- **React Router** - Roteamento SPA
- **Axios** - Cliente HTTP
- **TailwindCSS** - Framework CSS utilitário
- **React Query** - Gerenciamento de estado servidor[web:26][web:29][web:40]

### Inteligência Artificial
- **OpenAI API** / **Hugging Face** - Modelos de linguagem
- **Pinecone** / **Weaviate** - Banco vetorial para embeddings
- **LangChain** - Framework para aplicações com LLMs[web:13][web:29]

### DevOps
- **Docker** - Containerização
- **GitHub Actions** - CI/CD
- **Nginx** - Servidor web e proxy reverso[web:21][web:26]

---

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina[web:26][web:38]:

