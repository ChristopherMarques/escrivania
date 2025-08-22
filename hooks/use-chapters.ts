import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Tables, Inserts, Updates } from '@/lib/supabase'

type Chapter = Tables<'chapters'>
type ChapterInsert = Inserts<'chapters'>
type ChapterUpdate = Updates<'chapters'>

interface ChaptersResponse {
  chapters: Chapter[]
}

interface ChapterResponse {
  chapter: Chapter
}

// Hook para listar capítulos de um projeto
export function useChapters(projectId: string, userId: string) {
  return useQuery({
    queryKey: ['chapters', projectId],
    queryFn: async (): Promise<Chapter[]> => {
      const response = await fetch(`/api/chapters?projectId=${projectId}&userId=${userId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch chapters')
      }
      const data: ChaptersResponse = await response.json()
      return data.chapters
    },
    enabled: !!projectId && !!userId,
  })
}

// Hook para buscar capítulo específico
export function useChapter(chapterId: string, userId: string) {
  return useQuery({
    queryKey: ['chapter', chapterId],
    queryFn: async (): Promise<Chapter> => {
      const response = await fetch(`/api/chapters/${chapterId}?userId=${userId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch chapter')
      }
      const data: ChapterResponse = await response.json()
      return data.chapter
    },
    enabled: !!chapterId && !!userId,
  })
}

// Hook para criar capítulo
export function useCreateChapter() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ChapterInsert & { userId: string }): Promise<Chapter> => {
      const response = await fetch('/api/chapters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          projectId: data.project_id,
          orderIndex: data.order_index,
          userId: data.userId,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create chapter')
      }

      const result: ChapterResponse = await response.json()
      return result.chapter
    },
    onSuccess: (newChapter) => {
      // Invalidar a lista de capítulos do projeto
      queryClient.invalidateQueries({ queryKey: ['chapters', newChapter.project_id] })
      // Adicionar o novo capítulo ao cache
      queryClient.setQueryData(['chapter', newChapter.id], newChapter)
    },
  })
}

// Hook para atualizar capítulo
export function useUpdateChapter() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data, userId }: { id: string; data: ChapterUpdate; userId: string }): Promise<Chapter> => {
      const response = await fetch(`/api/chapters/${id}`, {
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
        throw new Error(error.error || 'Failed to update chapter')
      }

      const result: ChapterResponse = await response.json()
      return result.chapter
    },
    onSuccess: (updatedChapter) => {
      // Atualizar o cache do capítulo específico
      queryClient.setQueryData(['chapter', updatedChapter.id], updatedChapter)
      // Invalidar a lista de capítulos do projeto
      queryClient.invalidateQueries({ queryKey: ['chapters', updatedChapter.project_id] })
    },
  })
}

// Hook para deletar capítulo
export function useDeleteChapter() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }): Promise<{ projectId: string }> => {
      // Primeiro, buscar o capítulo para obter o project_id
      const chapterResponse = await fetch(`/api/chapters/${id}?userId=${userId}`)
      if (!chapterResponse.ok) {
        throw new Error('Failed to fetch chapter')
      }
      const chapterData: ChapterResponse = await chapterResponse.json()
      const projectId = chapterData.chapter.project_id

      const response = await fetch(`/api/chapters/${id}?userId=${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete chapter')
      }

      return { projectId }
    },
    onSuccess: (_, { id }) => {
      // Buscar o capítulo do cache para obter o project_id
      const cachedChapter = queryClient.getQueryData<Chapter>(['chapter', id])
      
      // Remover o capítulo do cache
      queryClient.removeQueries({ queryKey: ['chapter', id] })
      
      if (cachedChapter) {
        // Invalidar a lista de capítulos do projeto
        queryClient.invalidateQueries({ queryKey: ['chapters', cachedChapter.project_id] })
        // Invalidar todas as cenas do capítulo
        queryClient.invalidateQueries({ queryKey: ['scenes', id] })
      }
    },
  })
}

// Hook para reordenar capítulos
export function useReorderChapters() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ chapters, userId }: { chapters: { id: string; order_index: number }[]; userId: string }) => {
      const promises = chapters.map(chapter =>
        fetch(`/api/chapters/${chapter.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderIndex: chapter.order_index,
            userId,
          }),
        })
      )

      const responses = await Promise.all(promises)
      const failedResponses = responses.filter(response => !response.ok)
      
      if (failedResponses.length > 0) {
        throw new Error('Failed to reorder some chapters')
      }

      return responses
    },
    onSuccess: (_, { chapters }) => {
      // Invalidar todas as queries de capítulos relacionadas
      chapters.forEach(chapter => {
        queryClient.invalidateQueries({ queryKey: ['chapter', chapter.id] })
      })
      
      // Se tivermos o project_id, invalidar a lista de capítulos
      const firstChapter = queryClient.getQueryData<Chapter>(['chapter', chapters[0]?.id])
      if (firstChapter) {
        queryClient.invalidateQueries({ queryKey: ['chapters', firstChapter.project_id] })
      }
    },
  })
}