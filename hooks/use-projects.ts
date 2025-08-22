import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Tables, Inserts, Updates } from '@/lib/supabase'

type Project = Tables<'projects'>
type ProjectInsert = Inserts<'projects'>
type ProjectUpdate = Updates<'projects'>

interface ProjectsResponse {
  projects: Project[]
}

interface ProjectResponse {
  project: Project
}

// Hook para listar projetos
export function useProjects(userId: string) {
  return useQuery({
    queryKey: ['projects', userId],
    queryFn: async (): Promise<Project[]> => {
      const response = await fetch(`/api/projects?userId=${userId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }
      const data: ProjectsResponse = await response.json()
      return data.projects
    },
    enabled: !!userId,
  })
}

// Hook para buscar projeto específico
export function useProject(projectId: string, userId: string) {
  return useQuery({
    queryKey: ['project', projectId, userId],
    queryFn: async (): Promise<Project> => {
      if (!userId) {
        throw new Error('USER_NOT_LOADED')
      }
      const response = await fetch(`/api/projects/${projectId}?userId=${userId}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('PROJECT_NOT_FOUND')
        }
        throw new Error(`Failed to fetch project: ${response.status}`)
      }
      const data: ProjectResponse = await response.json()
      return data.project
    },
    enabled: !!projectId && !!userId,
    retry: (failureCount, error) => {
      // Não fazer retry se o projeto não foi encontrado ou usuário não carregado
      if (error.message === 'PROJECT_NOT_FOUND' || error.message === 'USER_NOT_LOADED') {
        return false
      }
      // Fazer retry até 3 vezes para outros erros
      return failureCount < 3
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

// Hook para criar projeto
export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ProjectInsert): Promise<Project> => {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          userId: data.user_id,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create project')
      }

      const result: ProjectResponse = await response.json()
      return result.project
    },
    onSuccess: (newProject) => {
      // Invalidar a lista de projetos
      queryClient.invalidateQueries({ queryKey: ['projects', newProject.user_id] })
      // Adicionar o novo projeto ao cache
      queryClient.setQueryData(['project', newProject.id], newProject)
    },
  })
}

// Hook para atualizar projeto
export function useUpdateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data, userId }: { id: string; data: ProjectUpdate; userId: string }): Promise<Project> => {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          userId,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update project')
      }

      const result: ProjectResponse = await response.json()
      return result.project
    },
    onSuccess: (updatedProject) => {
      // Atualizar o cache do projeto específico
      queryClient.setQueryData(['project', updatedProject.id], updatedProject)
      // Invalidar a lista de projetos
      queryClient.invalidateQueries({ queryKey: ['projects', updatedProject.user_id] })
    },
  })
}

// Hook para deletar projeto
export function useDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }): Promise<void> => {
      const response = await fetch(`/api/projects/${id}?userId=${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete project')
      }
    },
    onSuccess: (_, { id, userId }) => {
      // Remover o projeto do cache
      queryClient.removeQueries({ queryKey: ['project', id] })
      // Invalidar a lista de projetos
      queryClient.invalidateQueries({ queryKey: ['projects', userId] })
      // Invalidar todas as queries relacionadas ao projeto
      queryClient.invalidateQueries({ queryKey: ['chapters', id] })
      queryClient.invalidateQueries({ queryKey: ['characters', id] })
      queryClient.invalidateQueries({ queryKey: ['synopses', id] })
    },
  })
}