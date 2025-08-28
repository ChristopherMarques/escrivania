"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FullPageBookLoader } from "@/components/ui/book-loader";

function HomeContent() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Se o usuário estiver autenticado, redirecionar para o dashboard
    if (user && !loading) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return <FullPageBookLoader text="Verificando autenticação..." />;
  }

  // Se não estiver autenticado, mostrar landing page
  if (!user) {
    return <MainLayout />;
  }

  // Fallback durante redirecionamento
  return <FullPageBookLoader text="Redirecionando..." />;
}

export default function Home() {
  return (
    <AuthProvider>
      <HomeContent />
    </AuthProvider>
  );
}
