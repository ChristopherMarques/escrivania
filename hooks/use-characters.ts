import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tables, Inserts, Updates } from "@/lib/supabase";

type Character = Tables<"characters">;
type CharacterInsert = Inserts<"characters">;
type CharacterUpdate = Updates<"characters">;

interface CharactersResponse {
  characters: Character[];
}

interface CharacterResponse {
  character: Character;
}

// Hook para listar personagens de um projeto
export function useCharacters(projectId: string, userId: string) {
  return useQuery({
    queryKey: ["characters", projectId],
    queryFn: async (): Promise<Character[]> => {
      const response = await fetch(
        `/api/characters?projectId=${projectId}&userId=${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch characters");
      }
      const data: CharactersResponse = await response.json();
      return data.characters;
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

// Hook para buscar personagem específico
export function useCharacter(characterId: string, userId: string) {
  return useQuery({
    queryKey: ["character", characterId],
    queryFn: async (): Promise<Character> => {
      const response = await fetch(
        `/api/characters/${characterId}?userId=${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch character");
      }
      const data: CharacterResponse = await response.json();
      return data.character;
    },
    enabled: !!characterId && !!userId,
  });
}

// Hook para criar personagem
export function useCreateCharacter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: CharacterInsert & { userId: string }
    ): Promise<Character> => {
      const response = await fetch("/api/characters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          projectId: data.project_id,
          userId: data.userId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create character");
      }

      const result: CharacterResponse = await response.json();
      return result.character;
    },
    onSuccess: (newCharacter) => {
      // Invalidar a lista de personagens do projeto
      queryClient.invalidateQueries({
        queryKey: ["characters", newCharacter.project_id],
      });
      // Adicionar o novo personagem ao cache
      queryClient.setQueryData(["character", newCharacter.id], newCharacter);
    },
  });
}

// Hook para atualizar personagem
export function useUpdateCharacter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
      userId,
    }: {
      id: string;
      data: CharacterUpdate;
      userId: string;
    }): Promise<Character> => {
      const response = await fetch(`/api/characters/${id}`, {
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
        throw new Error(error.error || "Failed to update character");
      }

      const result: CharacterResponse = await response.json();
      return result.character;
    },
    onSuccess: (updatedCharacter) => {
      // Atualizar o cache do personagem específico
      queryClient.setQueryData(
        ["character", updatedCharacter.id],
        updatedCharacter
      );
      // Invalidar a lista de personagens do projeto
      queryClient.invalidateQueries({
        queryKey: ["characters", updatedCharacter.project_id],
      });
    },
  });
}

// Hook para deletar personagem
export function useDeleteCharacter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      userId,
    }: {
      id: string;
      userId: string;
    }): Promise<{ projectId: string }> => {
      // Primeiro, buscar o personagem para obter o project_id
      const characterResponse = await fetch(
        `/api/characters/${id}?userId=${userId}`
      );
      if (!characterResponse.ok) {
        throw new Error("Failed to fetch character");
      }
      const characterData: CharacterResponse = await characterResponse.json();
      const projectId = characterData.character.project_id;

      const response = await fetch(`/api/characters/${id}?userId=${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete character");
      }

      return { projectId };
    },
    onSuccess: (_, { id }) => {
      // Buscar o personagem do cache para obter o project_id
      const cachedCharacter = queryClient.getQueryData<Character>([
        "character",
        id,
      ]);

      // Remover o personagem do cache
      queryClient.removeQueries({ queryKey: ["character", id] });

      if (cachedCharacter) {
        // Invalidar a lista de personagens do projeto
        queryClient.invalidateQueries({
          queryKey: ["characters", cachedCharacter.project_id],
        });
      }
    },
  });
}

// Hook para buscar personagens com filtro de busca
export function useSearchCharacters(
  projectId: string,
  userId: string,
  searchTerm: string = ""
) {
  return useQuery({
    queryKey: ["characters", projectId, "search", searchTerm],
    queryFn: async (): Promise<Character[]> => {
      const response = await fetch(
        `/api/characters?projectId=${projectId}&userId=${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch characters");
      }
      const data: CharactersResponse = await response.json();

      // Filtrar personagens localmente se houver termo de busca
      if (searchTerm.trim()) {
        return data.characters.filter(
          (character) =>
            character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (character.description &&
              character.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase()))
        );
      }

      return data.characters;
    },
    enabled: !!projectId && !!userId,
  });
}

// Hook para estatísticas de personagens
export function useCharacterStats(projectId: string, userId: string) {
  return useQuery({
    queryKey: ["character-stats", projectId],
    queryFn: async () => {
      const response = await fetch(
        `/api/characters?projectId=${projectId}&userId=${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch characters");
      }
      const data: CharactersResponse = await response.json();
      const characters = data.characters;

      return {
        total: characters.length,
        withDescription: characters.filter(
          (c) => c.description && c.description.trim().length > 0
        ).length,
        withoutDescription: characters.filter(
          (c) => !c.description || c.description.trim().length === 0
        ).length,
        averageDescriptionLength:
          characters.reduce((acc, c) => {
            return acc + (c.description ? c.description.length : 0);
          }, 0) / characters.length || 0,
      };
    },
    enabled: !!projectId && !!userId,
  });
}
