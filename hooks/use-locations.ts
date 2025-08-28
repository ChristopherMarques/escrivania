import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface Location {
  id: string;
  name: string;
  description?: string;
  location_type?: string;
  atmosphere?: string;
  important_details?: string;
  project_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateLocationData {
  name: string;
  description?: string;
  locationType?: string;
  atmosphere?: string;
  importantDetails?: string;
  projectId: string;
  userId: string;
}

export interface UpdateLocationData {
  name?: string;
  description?: string;
  locationType?: string;
  atmosphere?: string;
  importantDetails?: string;
  userId: string;
}

// Hook para listar locais de um projeto
export function useLocations(projectId: string, userId: string) {
  return useQuery({
    queryKey: ["locations", projectId],
    queryFn: async (): Promise<Location[]> => {
      const response = await fetch(
        `/api/locations?projectId=${projectId}&userId=${userId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch locations");
      }

      const data = await response.json();
      return data.locations || [];
    },
    enabled: !!projectId && !!userId,
  });
}

// Hook para buscar um local específico
export function useLocation(locationId: string, userId: string) {
  return useQuery({
    queryKey: ["location", locationId],
    queryFn: async (): Promise<Location> => {
      const response = await fetch(
        `/api/locations/${locationId}?userId=${userId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch location");
      }

      const data = await response.json();
      return data.location;
    },
    enabled: !!locationId && !!userId,
  });
}

// Hook para criar um novo local
export function useCreateLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (locationData: CreateLocationData): Promise<Location> => {
      const response = await fetch("/api/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(locationData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create location");
      }

      const data = await response.json();
      return data.location;
    },
    onSuccess: (newLocation) => {
      // Invalidar e atualizar a lista de locais
      queryClient.invalidateQueries({
        queryKey: ["locations", newLocation.project_id],
      });

      toast.success("Local criado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar local: ${error.message}`);
    },
  });
}

// Hook para atualizar um local
export function useUpdateLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      locationId,
      locationData,
    }: {
      locationId: string;
      locationData: UpdateLocationData;
    }): Promise<Location> => {
      const response = await fetch(`/api/locations/${locationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(locationData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update location");
      }

      const data = await response.json();
      return data.location;
    },
    onSuccess: (updatedLocation) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: ["locations", updatedLocation.project_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["location", updatedLocation.id],
      });

      toast.success("Local atualizado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar local: ${error.message}`);
    },
  });
}

// Hook para deletar um local
export function useDeleteLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      locationId,
      userId,
      projectId,
    }: {
      locationId: string;
      userId: string;
      projectId: string;
    }): Promise<void> => {
      const response = await fetch(
        `/api/locations/${locationId}?userId=${userId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete location");
      }
    },
    onSuccess: (_, { projectId, locationId }) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: ["locations", projectId],
      });
      queryClient.removeQueries({
        queryKey: ["location", locationId],
      });

      toast.success("Local excluído com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao excluir local: ${error.message}`);
    },
  });
}

// Hook para buscar locais com filtro local
export function useSearchLocations(
  projectId: string,
  userId: string,
  searchTerm: string
) {
  const { data: locations = [], ...query } = useLocations(projectId, userId);

  const filteredLocations = locations.filter((location) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      location.name.toLowerCase().includes(searchLower) ||
      location.description?.toLowerCase().includes(searchLower) ||
      location.location_type?.toLowerCase().includes(searchLower) ||
      location.atmosphere?.toLowerCase().includes(searchLower)
    );
  });

  return {
    ...query,
    data: searchTerm ? filteredLocations : locations,
  };
}

// Hook para obter estatísticas de locais
export function useLocationStats(projectId: string, userId: string) {
  const { data: locations = [] } = useLocations(projectId, userId);

  const stats = {
    total: locations.length,
    byType: locations.reduce(
      (acc, location) => {
        const type = location.location_type || "Não especificado";
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),
    withDescription: locations.filter(
      (l) => l.description && l.description.trim().length > 0
    ).length,
    withAtmosphere: locations.filter(
      (l) => l.atmosphere && l.atmosphere.trim().length > 0
    ).length,
  };

  return stats;
}
