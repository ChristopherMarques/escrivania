"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Tempo de cache padrão de 5 minutos
            staleTime: 1000 * 60 * 5,
            // Tempo de cache em background de 10 minutos
            gcTime: 1000 * 60 * 10,
            // Retry automático em caso de erro
            retry: 3,
            // Refetch quando a janela ganha foco
            refetchOnWindowFocus: false,
            // Refetch quando reconecta à internet
            refetchOnReconnect: true,
          },
          mutations: {
            // Retry automático para mutations em caso de erro de rede
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

// Hook para invalidar queries relacionadas a um projeto
export function useInvalidateProjectQueries() {
  const queryClient = new QueryClient();

  return {
    invalidateProject: (projectId: string) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
    invalidateChapters: (projectId: string) => {
      queryClient.invalidateQueries({ queryKey: ["chapters", projectId] });
    },
    invalidateScenes: (chapterId: string) => {
      queryClient.invalidateQueries({ queryKey: ["scenes", chapterId] });
    },
    invalidateCharacters: (projectId: string) => {
      queryClient.invalidateQueries({ queryKey: ["characters", projectId] });
    },
    invalidateSynopses: (projectId: string) => {
      queryClient.invalidateQueries({ queryKey: ["synopses", projectId] });
    },
    invalidateAll: () => {
      queryClient.invalidateQueries();
    },
  };
}
