import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Como o servidor está na mesma origem, não precisamos especificar baseURL
});

// Exportar hooks e métodos específicos para facilitar o uso
export const {
  useSession,
  signIn,
  signUp,
  signOut,
} = authClient;

// Tipos para TypeScript
export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user;