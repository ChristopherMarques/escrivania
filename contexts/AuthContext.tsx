'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useSession, signIn as betterAuthSignIn, signOut as betterAuthSignOut } from '@/lib/auth-client';
import type { Session, User } from '@/lib/auth-client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending: loading } = useSession();
  const user = session?.user || null;



  const signIn = () => {
    betterAuthSignIn.social({
      provider: 'google',
    });
  };

  const signOut = async () => {
    await betterAuthSignOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}