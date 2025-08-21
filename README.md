# Escrivania Digital 📝

Uma aplicação moderna e completa para escritores de ficção brasileira, desenvolvida com Next.js, React e TypeScript. A Escrivania Digital oferece um ambiente profissional e intuitivo para criação, organização e gerenciamento de projetos literários.

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

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 14** - Framework React com App Router
- **React 18** - Biblioteca de interface de usuário
- **TypeScript** - Tipagem estática para JavaScript
- **Tailwind CSS** - Framework de CSS utilitário
- **Shadcn/UI** - Componentes de interface modernos

### Editor
- **Tiptap** - Editor de texto rico e extensível
- **Extensões personalizadas** para funcionalidades específicas
- **Suporte a markdown** e formatação avançada

### Backend e Dados
- **Supabase** - Backend-as-a-Service com PostgreSQL
- **Better Auth** - Sistema de autenticação moderno
- **Row Level Security (RLS)** para segurança de dados

### Ferramentas de Desenvolvimento
- **pnpm** - Gerenciador de pacotes eficiente
- **ESLint** - Linting de código
- **PostCSS** - Processamento de CSS

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- pnpm
- Conta no Supabase

### Passos de Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd escrivania
```

2. **Instale as dependências**
```bash
pnpm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com suas credenciais do Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico
DATABASE_URL=sua_url_do_banco_postgresql
```

4. **Configure o banco de dados**
```bash
node setup-supabase-schema.js
node setup-better-auth-db.js
```

5. **Execute o projeto**
```bash
pnpm dev
```

O aplicativo estará disponível em `http://localhost:3000`

## 🎯 Roadmap

### Funcionalidades Planejadas
- [ ] **Exportação de manuscritos** (PDF, DOCX, EPUB)
- [ ] **Sistema de versões** (snapshots) para controle de mudanças
- [ ] **Colaboração em tempo real** entre escritores
- [ ] **Integração com serviços de nuvem** para backup
- [ ] **Análise de texto** com IA para sugestões de melhoria
- [ ] **Templates de gêneros** literários
- [ ] **Sistema de comentários** e revisões
- [ ] **Cronologia de eventos** da história
- [ ] **Mapa de relacionamentos** entre personagens
- [ ] **Gerador de nomes** e características

### Melhorias Técnicas
- [ ] **Integração completa** Better Auth + Supabase RLS
- [ ] **Otimização de performance** para projetos grandes
- [ ] **Modo offline** com sincronização
- [ ] **Testes automatizados** completos
- [ ] **PWA** para instalação como app nativo

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas, sugestões ou problemas:
- Abra uma issue no GitHub
- Entre em contato através do email de suporte

---

**Escrivania Digital** - Transformando ideias em histórias extraordinárias ✨