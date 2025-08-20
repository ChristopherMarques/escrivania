# Configuração do Projeto - Sistema de Gerenciamento Literário

## Dependências Necessárias

Para completar a implementação do sistema, você precisa instalar as seguintes dependências:

```bash
npm install @supabase/supabase-js better-auth
```

## Passos de Configuração

### 1. Instalar Dependências
```bash
npm install @supabase/supabase-js better-auth
```

### 2. Configurar Supabase
1. Acesse [supabase.com](https://supabase.com) e crie um projeto
2. Execute o script SQL em `supabase/schema.sql` no SQL Editor do Supabase
3. Copie as credenciais do projeto (URL e anon key)
4. Atualize o arquivo `.env.local` com suas credenciais:
   ```
   NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
   ```

### 3. Configurar Google OAuth
1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um projeto ou selecione um existente
3. Ative a API do Google+
4. Crie credenciais OAuth 2.0
5. Configure as URLs de redirecionamento:
   - `http://localhost:3000/auth/callback`
6. Adicione as credenciais ao `.env.local`:
   ```
   GOOGLE_CLIENT_ID=seu_client_id_aqui
   GOOGLE_CLIENT_SECRET=seu_client_secret_aqui
   ```

### 4. Configurar Better Auth
1. Gere um secret para o Better Auth:
   ```bash
   openssl rand -base64 32
   ```
2. Adicione ao `.env.local`:
   ```
   BETTER_AUTH_SECRET=seu_secret_aqui
   BETTER_AUTH_URL=http://localhost:3000
   ```

### 5. Ativar as Configurações
Após instalar as dependências, descomente as linhas nos seguintes arquivos:

#### `lib/supabase.ts`
- Descomente a importação do `createClient`
- Descomente a criação do cliente Supabase
- Remova o placeholder temporário

#### `lib/auth.ts`
- Descomente todas as importações do Better Auth
- Descomente a configuração do `betterAuth`
- Descomente os tipos `Session` e `User`
- Remova os placeholders temporários

#### `contexts/AuthContext.tsx`
- Descomente as importações do Better Auth
- Descomente a criação do cliente de autenticação
- Descomente as implementações das funções `signIn` e `signOut`
- Remova os placeholders temporários

#### `contexts/ProjectContext.tsx`
- Descomente a importação do Supabase
- Substitua os tipos temporários pelos tipos do Supabase
- Implemente as funções CRUD com chamadas reais ao Supabase

### 6. Configurar Providers na Aplicação
Adicione os providers no arquivo `app/layout.tsx` ou `pages/_app.tsx`:

```tsx
import { AuthProvider } from '@/contexts/AuthContext'
import { ProjectProvider } from '@/contexts/ProjectContext'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          <ProjectProvider>
            {children}
          </ProjectProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
```

## Estrutura do Banco de Dados

O schema criado inclui as seguintes tabelas:
- `users` - Usuários do sistema
- `projects` - Projetos literários
- `chapters` - Capítulos dos projetos
- `scenes` - Cenas dos capítulos
- `characters` - Personagens dos projetos
- `synopses` - Sinopses dos projetos

Todas as tabelas incluem:
- Row Level Security (RLS) habilitado
- Políticas de segurança para CRUD
- Timestamps automáticos
- Relacionamentos com cascata

## Próximos Passos

Após completar a configuração:
1. Criar componentes de interface para CRUD
2. Implementar páginas de dashboard
3. Adicionar formulários de criação/edição
4. Implementar navegação entre projetos/capítulos/cenas
5. Adicionar funcionalidades de busca e filtros

## Troubleshooting

### Erro de Dependências
Se houver conflitos de dependências, tente:
```bash
npm install --legacy-peer-deps
```

### Erro de Autenticação
Verifique se:
- As URLs de callback estão corretas no Google Console
- As variáveis de ambiente estão definidas corretamente
- O Supabase está configurado para aceitar autenticação OAuth

### Erro de Banco de Dados
Verifique se:
- O schema SQL foi executado corretamente
- As políticas RLS estão ativas
- As credenciais do Supabase estão corretas