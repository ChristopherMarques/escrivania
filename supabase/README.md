# Configuração do Supabase

## Passos para configurar o banco de dados

### 1. Criar projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Escolha sua organização
5. Defina um nome para o projeto
6. Escolha uma senha forte para o banco de dados
7. Selecione a região mais próxima
8. Clique em "Create new project"

### 2. Obter as credenciais
Após criar o projeto:
1. Vá para Settings > API
2. Copie a **Project URL** e **anon public key**
3. Atualize o arquivo `.env.local` com essas informações:
   ```
   NEXT_PUBLIC_SUPABASE_URL=sua_project_url_aqui
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
   ```

### 3. Aplicar o schema do banco
1. No painel do Supabase, vá para "SQL Editor"
2. Clique em "New query"
3. Copie todo o conteúdo do arquivo `schema.sql`
4. Cole no editor SQL
5. Clique em "Run" para executar

### 4. Verificar as tabelas
Após executar o schema:
1. Vá para "Table Editor"
2. Verifique se as seguintes tabelas foram criadas:
   - users
   - projects
   - chapters
   - scenes
   - characters
   - synopses

### 5. Configurar autenticação
1. Vá para Authentication > Settings
2. Em "Site URL", adicione: `http://localhost:3000`
3. Em "Redirect URLs", adicione: `http://localhost:3000/auth/callback`
4. Configure o Google OAuth:
   - Vá para Authentication > Providers
   - Ative o Google
   - Adicione seu Client ID e Client Secret do Google

## Estrutura do Banco de Dados

### Relacionamentos
- **users** → **projects** (1:N)
- **projects** → **chapters** (1:N)
- **chapters** → **scenes** (1:N)
- **projects** → **characters** (1:N)
- **projects** → **synopses** (1:N)

### Segurança
- Row Level Security (RLS) habilitado em todas as tabelas
- Usuários só podem acessar seus próprios dados
- Políticas de segurança configuradas para CRUD completo

### Funcionalidades
- UUIDs como chaves primárias
- Timestamps automáticos (created_at, updated_at)
- Índices para melhor performance
- Cascata de exclusão para manter integridade