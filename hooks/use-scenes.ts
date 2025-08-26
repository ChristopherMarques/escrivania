import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Tables, Inserts, Updates } from '@/lib/supabase'

type Scene = Tables<'scenes'>
type SceneInsert = Inserts<'scenes'>
type SceneUpdate = Updates<'scenes'>

interface ScenesResponse {
  scenes: Scene[]
}

interface SceneResponse {
  scene: Scene
}

// Hook para listar cenas de um capítulo
export function useScenes(chapterId: string, userId: string) {
  return useQuery({
    queryKey: ['scenes', chapterId],
    queryFn: async (): Promise<Scene[]> => {
      const response = await fetch(`/api/scenes?chapterId=${chapterId}&userId=${userId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch scenes')
      }
      const data: ScenesResponse = await response.json()
      return data.scenes
    },
    enabled: !!chapterId && !!userId,
  })
}

// Hook para buscar cena específica
export function useScene(sceneId: string, userId: string) {
  return useQuery({
    queryKey: ['scene', sceneId],
    queryFn: async (): Promise<Scene> => {
      const response = await fetch(`/api/scenes/${sceneId}?userId=${userId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch scene')
      }
      const data: SceneResponse = await response.json()
      return data.scene
    },
    enabled: !!sceneId && !!userId,
  })
}

// Hook para criar cena
export function useCreateScene() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: SceneInsert & { userId: string }): Promise<Scene> => {
      const response = await fetch('/api/scenes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          chapterId: data.chapter_id,
          orderIndex: data.order_index,
          userId: data.userId,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create scene')
      }

      const result: SceneResponse = await response.json()
      return result.scene
    },
    onSuccess: (newScene) => {
      // Invalidar a lista de cenas do capítulo
      queryClient.invalidateQueries({ queryKey: ['scenes', newScene.chapter_id] })
      // Invalidar a lista de cenas por projeto
      queryClient.invalidateQueries({ queryKey: ['scenes-by-project'] })
      // Adicionar a nova cena ao cache
      queryClient.setQueryData(['scene', newScene.id], newScene)
    },
  })
}

// Hook para atualizar cena
export function useUpdateScene() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data, userId }: { id: string; data: SceneUpdate; userId: string }): Promise<Scene> => {
      const response = await fetch(`/api/scenes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          orderIndex: data.order_index,
          userId,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update scene')
      }

      const result: SceneResponse = await response.json()
      return result.scene
    },
    onSuccess: (updatedScene) => {
      // Atualizar o cache da cena específica
      queryClient.setQueryData(['scene', updatedScene.id], updatedScene)
      
      // Atualizar diretamente o cache das cenas do capítulo sem invalidar
      queryClient.setQueryData(['scenes', updatedScene.chapter_id], (oldScenes: Scene[] | undefined) => {
        if (!oldScenes) return [updatedScene]
        return oldScenes.map(scene => scene.id === updatedScene.id ? updatedScene : scene)
      })
      
      // Atualizar diretamente o cache das cenas por projeto sem invalidar
      queryClient.setQueryData(['scenes-by-project', updatedScene.project_id], (oldData: any[] | undefined) => {
        if (!oldData) return undefined
        return oldData.map(scene => scene.id === updatedScene.id ? { ...updatedScene, chapter_title: scene.chapter_title } : scene)
      })
    },
  })
}

// Hook para deletar cena
export function useDeleteScene() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }): Promise<{ chapterId: string }> => {
      // Primeiro, buscar a cena para obter o chapter_id
      const sceneResponse = await fetch(`/api/scenes/${id}?userId=${userId}`)
      if (!sceneResponse.ok) {
        throw new Error('Failed to fetch scene')
      }
      const sceneData: SceneResponse = await sceneResponse.json()
      const chapterId = sceneData.scene.chapter_id

      const response = await fetch(`/api/scenes/${id}?userId=${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete scene')
      }

      return { chapterId }
    },
    onSuccess: (_, { id }) => {
      // Buscar a cena do cache para obter o chapter_id
      const cachedScene = queryClient.getQueryData<Scene>(['scene', id])
      
      // Remover a cena do cache
      queryClient.removeQueries({ queryKey: ['scene', id] })
      
      if (cachedScene) {
        // Invalidar a lista de cenas do capítulo
        queryClient.invalidateQueries({ queryKey: ['scenes', cachedScene.chapter_id] })
      }
      // Invalidar a lista de cenas por projeto
      queryClient.invalidateQueries({ queryKey: ['scenes-by-project'] })
    },
  })
}

// Hook para reordenar cenas
export function useReorderScenes() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ scenes, userId }: { scenes: { id: string; order_index: number }[]; userId: string }) => {
      const promises = scenes.map(scene =>
        fetch(`/api/scenes/${scene.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderIndex: scene.order_index,
            userId,
          }),
        })
      )

      const responses = await Promise.all(promises)
      const failedResponses = responses.filter(response => !response.ok)
      
      if (failedResponses.length > 0) {
        throw new Error('Failed to reorder some scenes')
      }

      return responses
    },
    onSuccess: (_, { scenes }) => {
      // Invalidar todas as queries de cenas relacionadas
      scenes.forEach(scene => {
        queryClient.invalidateQueries({ queryKey: ['scene', scene.id] })
      })
      
      // Se tivermos o chapter_id, invalidar a lista de cenas
      const firstScene = queryClient.getQueryData<Scene>(['scene', scenes[0]?.id])
      if (firstScene) {
        queryClient.invalidateQueries({ queryKey: ['scenes', firstScene.chapter_id] })
      }
    },
  })
}

// Hook para buscar cenas por projeto (útil para navegação)
export function useScenesByProject(projectId: string, userId: string) {
  return useQuery({
    queryKey: ['scenes-by-project', projectId, userId],
    queryFn: async (): Promise<(Scene & { chapter_title: string })[]> => {
      // Primeiro buscar todos os capítulos do projeto
      const chaptersResponse = await fetch(`/api/chapters?projectId=${projectId}&userId=${userId}`)
      if (!chaptersResponse.ok) {
        throw new Error('Failed to fetch chapters')
      }
      const chaptersData = await chaptersResponse.json()
      const chapters = chaptersData.chapters

      // Buscar todas as cenas de todos os capítulos
      const scenesPromises = chapters.map(async (chapter: any) => {
        const scenesResponse = await fetch(`/api/scenes?chapterId=${chapter.id}&userId=${userId}`)
        if (!scenesResponse.ok) {
          throw new Error(`Failed to fetch scenes for chapter ${chapter.id}`)
        }
        const scenesData = await scenesResponse.json()
        return scenesData.scenes.map((scene: Scene) => ({
          ...scene,
          chapter_title: chapter.title
        }))
      })

      const allScenes = await Promise.all(scenesPromises)
      return allScenes.flat().sort((a, b) => {
        // Ordenar por capítulo e depois por ordem da cena
        const chapterComparison = a.chapter_id.localeCompare(b.chapter_id)
        if (chapterComparison !== 0) return chapterComparison
        return a.order_index - b.order_index
      })
    },
    enabled: !!projectId && !!userId,
    // Cache por 5 minutos
    staleTime: 1000 * 60 * 5,
    // Manter em cache por 15 minutos
    gcTime: 1000 * 60 * 15,
    // Não refetch automaticamente para reduzir requisições
    refetchOnWindowFocus: false,
    refetchOnMount: false
  })
}