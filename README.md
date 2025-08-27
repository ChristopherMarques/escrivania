# Escrivania Digital 📝

<div align="center">

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-orange?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-0.1.0-blue?style=for-the-badge)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

</div>

**Uma plataforma completa e moderna para escritores criarem, organizarem e gerenciarem seus projetos literários com eficiência e elegância.**

A Escrivania Digital é um ambiente profissional de escrita que combina um editor de texto avançado com ferramentas poderosas de organização narrativa, construção de universo e acompanhamento de produtividade.

## 📋 Índice

- [📸 Preview](#-preview)
- [🚀 Funcionalidades Principais](#-funcionalidades-principais)
- [✨ Destaques do Projeto](#-destaques-do-projeto)
- [🛠️ Stack Tecnológica](#️-stack-tecnológica)
- [🚀 Início Rápido](#-início-rápido)
- [🎯 Próximas Funcionalidades](#-próximas-funcionalidades)
- [🤝 Contribuição](#-contribuição)
- [📄 Licença](#-licença)

## 📸 Preview

> 🚧 **Em desenvolvimento** - Screenshots e demo em breve!

## 🚀 Funcionalidades Principais

### 📚 Gerenciamento de Projetos
- **Criação e organização de projetos literários**
- **Dashboard interativo** com estatísticas e progresso
- **Visão geral de projetos** com métricas detalhadas
- **Sistema de autenticação** integrado com Better Auth
- **Armazenamento seguro** com Supabase

### ✍️ Editor de Texto Avançado
- **Editor rico baseado em Tiptap** com formatação completa
- **Modo Foco** para escrita sem distrações
- **Salvamento automático** para nunca perder o trabalho
- **Contagem de palavras e estatísticas** em tempo real
- **Suporte a múltiplos formatos**: negrito, itálico, sublinhado, títulos, listas, etc.
- **Toolbar personalizável** com todas as ferramentas de formatação

### 📖 Estrutura Narrativa
- **Organização hierárquica** em capítulos e cenas
- **Sinopses e notas** para cada elemento da história
- **Reordenação por drag-and-drop** da estrutura
- **Status de progresso** para cada cena (rascunho, em progresso, completo, revisão)
- **Navegação lateral** intuitiva entre elementos

### 👥 Construção de Universo
- **Fichas de personagens** completas com:
  - Informações básicas (nome, idade, descrição física)
  - Biografia e histórico
  - Motivações e defeitos
  - Relacionamentos
- **Gerenciamento de locais** e ambientações
- **Sistema de tags** para organização
- **Editor dedicado** para cada tipo de elemento

### 📊 Metas e Produtividade
- **Metas de escrita personalizáveis**:
  - Metas diárias de palavras
  - Metas de projeto
  - Metas de sessão
- **Estatísticas detalhadas**:
  - Contagem de palavras e caracteres
  - Tempo de leitura estimado
  - Velocidade de escrita (palavras por minuto)
  - Progresso em relação às metas
- **Painel de estatísticas** em tempo real

### 🎨 Interface e Experiência
- **Design moderno e responsivo** com Tailwind CSS
- **Tema escuro/claro** adaptável
- **Interface mobile-friendly** para escrita em qualquer lugar
- **Componentes UI elegantes** com Shadcn/UI
- **Navegação intuitiva** e organizada

### 🔧 Funcionalidades Técnicas
- **Múltiplas visualizações**:
  - Modo de escrita tradicional
  - Quadro de cortiça (corkboard) para planejamento visual
  - Visão estrutural (outliner) para análise
- **Sistema de inspetor** para edição de metadados
- **Gerenciamento de estado** robusto com Context API
- **Integração com banco de dados** PostgreSQL via Supabase

## 🛠️ Stack Tecnológica

| Categoria | Tecnologia | Versão | Descrição |
|-----------|------------|--------|-----------|
| **Framework** | Next.js | 15.2.4 | Framework React com App Router e SSR |
| **Frontend** | React | 19.1 | Biblioteca de interface de usuário |
| **Linguagem** | TypeScript | 5.0+ | Tipagem estática para JavaScript |
| **Estilização** | Tailwind CSS | 3.4+ | Framework CSS utilitário |
| **Componentes** | Shadcn/UI | Latest | Componentes de interface modernos |
| **Editor** | Tiptap | Latest | Editor de texto rico e extensível |
| **Backend** | Supabase | Latest | BaaS com PostgreSQL e autenticação |
| **Autenticação** | Better Auth | Latest | Sistema de auth moderno e seguro |
| **Gerenciador** | pnpm | Latest | Gerenciador de pacotes eficiente |

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+
- pnpm
- Conta no Supabase

### Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd escrivania

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais do Supabase

# Configure o banco de dados
node setup-supabase-schema.js
node setup-better-auth-db.js

# Execute o projeto
pnpm dev
```

🌐 **Aplicação disponível em:** `http://localhost:3000`

## 🎯 Próximas Funcionalidades

### 📋 Em Desenvolvimento
- [ ] **Exportação de manuscritos** (PDF, DOCX)
- [ ] **Sistema de versões** para controle de mudanças
- [ ] **Templates de gêneros** literários
- [ ] **Cronologia de eventos** da história
- [ ] **Mapa de relacionamentos** entre personagens

### 🔧 Melhorias Técnicas
- [ ] **Otimização de performance** para projetos grandes
- [ ] **Modo offline** com sincronização
- [ ] **PWA** para instalação como app nativo
- [ ] **Testes automatizados** completos

## ✨ Destaques do Projeto

- 🎯 **Editor Otimizado**: TipTap com extensões personalizadas para escrita fluida
- 📊 **Estatísticas em Tempo Real**: Acompanhe seu progresso com métricas detalhadas
- 🏗️ **Organização Narrativa**: Estruture capítulos, cenas e elementos da história
- 👥 **Construção de Universo**: Gerencie personagens, locais e relacionamentos
- 💾 **Salvamento Automático**: Nunca perca seu trabalho
- 🎨 **Interface Moderna**: Design responsivo e intuitivo
- 🔒 **Segurança**: Autenticação robusta e proteção de dados

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:
- 🐛 Reportar bugs
- 💡 Sugerir novas funcionalidades
- 🔧 Enviar pull requests
- 📖 Melhorar a documentação

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

<div align="center">

**Escrivania Digital** - *Transformando ideias em histórias extraordinárias* ✨

[🌟 Dar uma estrela](https://github.com/seu-usuario/escrivania) • [🐛 Reportar Bug](https://github.com/seu-usuario/escrivania/issues) • [💡 Solicitar Feature](https://github.com/seu-usuario/escrivania/issues)

</div>