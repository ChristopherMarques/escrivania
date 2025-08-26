import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tables, Inserts, Updates } from "@/lib/supabase";

type Synopsis = Tables<"synopses">;
type SynopsisInsert = Inserts<"synopses">;
type SynopsisUpdate = Updates<"synopses">;

interface SynopsesResponse {
  synopses: Synopsis[];
}

interface SynopsisResponse {
  synopsis: Synopsis;
}

// Hook para listar sinopses de um projeto
export function useSynopses(projectId: string, userId: string) {
  return useQuery({
    queryKey: ["synopses", projectId],
    queryFn: async (): Promise<Synopsis[]> => {
      const response = await fetch(
        `/api/synopses?projectId=${projectId}&userId=${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch synopses");
      }
      const data: SynopsesResponse = await response.json();
      return data.synopses;
    },
    enabled: !!projectId && !!userId,
    // Cache por 5 minutos
    staleTime: 1000 * 60 * 5,
    // Manter em cache por 15 minutos
    gcTime: 1000 * 60 * 15,
    // Não refetch automaticamente
    refetchOnWindowFocus: false,
  });
}

// Hook para buscar sinopse específica
export function useSynopsis(synopsisId: string, userId: string) {
  return useQuery({
    queryKey: ["synopsis", synopsisId],
    queryFn: async (): Promise<Synopsis> => {
      const response = await fetch(
        `/api/synopses/${synopsisId}?userId=${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch synopsis");
      }
      const data: SynopsisResponse = await response.json();
      return data.synopsis;
    },
    enabled: !!synopsisId && !!userId,
  });
}

// Hook para criar sinopse
export function useCreateSynopsis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: SynopsisInsert & { userId: string }
    ): Promise<Synopsis> => {
      const response = await fetch("/api/synopses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          projectId: data.project_id,
          userId: data.userId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create synopsis");
      }

      const result: SynopsisResponse = await response.json();
      return result.synopsis;
    },
    onSuccess: (newSynopsis) => {
      // Invalidar a lista de sinopses do projeto
      queryClient.invalidateQueries({
        queryKey: ["synopses", newSynopsis.project_id],
      });
      // Adicionar a nova sinopse ao cache
      queryClient.setQueryData(["synopsis", newSynopsis.id], newSynopsis);
    },
  });
}

// Hook para atualizar sinopse
export function useUpdateSynopsis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
      userId,
    }: {
      id: string;
      data: SynopsisUpdate;
      userId: string;
    }): Promise<Synopsis> => {
      const response = await fetch(`/api/synopses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          userId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update synopsis");
      }

      const result: SynopsisResponse = await response.json();
      return result.synopsis;
    },
    onSuccess: (updatedSynopsis) => {
      // Atualizar o cache da sinopse específica
      queryClient.setQueryData(
        ["synopsis", updatedSynopsis.id],
        updatedSynopsis
      );
      // Invalidar a lista de sinopses do projeto
      queryClient.invalidateQueries({
        queryKey: ["synopses", updatedSynopsis.project_id],
      });
    },
  });
}

// Hook para deletar sinopse
export function useDeleteSynopsis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      userId,
    }: {
      id: string;
      userId: string;
    }): Promise<{ projectId: string }> => {
      // Primeiro, buscar a sinopse para obter o project_id
      const synopsisResponse = await fetch(
        `/api/synopses/${id}?userId=${userId}`
      );
      if (!synopsisResponse.ok) {
        throw new Error("Failed to fetch synopsis");
      }
      const synopsisData: SynopsisResponse = await synopsisResponse.json();
      const projectId = synopsisData.synopsis.project_id;

      const response = await fetch(`/api/synopses/${id}?userId=${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete synopsis");
      }

      return { projectId };
    },
    onSuccess: (_, { id }) => {
      // Buscar a sinopse do cache para obter o project_id
      const cachedSynopsis = queryClient.getQueryData<Synopsis>([
        "synopsis",
        id,
      ]);

      // Remover a sinopse do cache
      queryClient.removeQueries({ queryKey: ["synopsis", id] });

      if (cachedSynopsis) {
        // Invalidar a lista de sinopses do projeto
        queryClient.invalidateQueries({
          queryKey: ["synopses", cachedSynopsis.project_id],
        });
      }
    },
  });
}

// Hook para buscar sinopses com filtro de busca
export function useSearchSynopses(
  projectId: string,
  userId: string,
  searchTerm: string = ""
) {
  return useQuery({
    queryKey: ["synopses", projectId, "search", searchTerm],
    queryFn: async (): Promise<Synopsis[]> => {
      const response = await fetch(
        `/api/synopses?projectId=${projectId}&userId=${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch synopses");
      }
      const data: SynopsesResponse = await response.json();

      // Filtrar sinopses localmente se houver termo de busca
      if (searchTerm.trim()) {
        return data.synopses.filter(
          (synopsis) =>
            synopsis.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            synopsis.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      return data.synopses;
    },
    enabled: !!projectId && !!userId,
  });
}

// Hook para estatísticas de sinopses
export function useSynopsisStats(projectId: string, userId: string) {
  return useQuery({
    queryKey: ["synopsis-stats", projectId],
    queryFn: async () => {
      const response = await fetch(
        `/api/synopses?projectId=${projectId}&userId=${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch synopses");
      }
      const data: SynopsesResponse = await response.json();
      const synopses = data.synopses;

      return {
        total: synopses.length,
        totalWords: synopses.reduce((acc, s) => {
          return acc + (s.content ? s.content.split(/\s+/).length : 0);
        }, 0),
        averageLength:
          synopses.reduce((acc, s) => {
            return acc + (s.content ? s.content.length : 0);
          }, 0) / synopses.length || 0,
        longestSynopsis: synopses.reduce((longest, current) => {
          return (current.content?.length || 0) > (longest.content?.length || 0)
            ? current
            : longest;
        }, synopses[0] || null),
        shortestSynopsis: synopses.reduce((shortest, current) => {
          return (current.content?.length || 0) <
            (shortest.content?.length || 0)
            ? current
            : shortest;
        }, synopses[0] || null),
      };
    },
    enabled: !!projectId && !!userId,
  });
}

// Hook para sinopse principal do projeto (primeira sinopse ou mais recente)
export function useMainSynopsis(projectId: string, userId: string) {
  return useQuery({
    queryKey: ["main-synopsis", projectId],
    queryFn: async (): Promise<Synopsis | null> => {
      const response = await fetch(
        `/api/synopses?projectId=${projectId}&userId=${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch synopses");
      }
      const data: SynopsesResponse = await response.json();

      // Retornar a primeira sinopse ou null se não houver nenhuma
      return data.synopses.length > 0 ? data.synopses[0] : null;
    },
    enabled: !!projectId && !!userId,
  });
}
