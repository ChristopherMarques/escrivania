'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Plus,
  Save,
  FileText,
  Edit3,
  Trash2,
  ArrowLeft,
  Clock,
  BookOpen,
} from 'lucide-react'
import { useProject } from '@/contexts/ProjectContext'
import type { Chapter, Scene } from '@/contexts/ProjectContext'

interface ChapterEditorProps {
  chapterId: string
  onBack?: () => void
}

export function ChapterEditor({ chapterId, onBack }: ChapterEditorProps) {
  const { state, updateChapter, createScene, updateScene, deleteScene } = useProject()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editedChapter, setEditedChapter] = useState<Partial<Chapter>>({})
  const [newSceneTitle, setNewSceneTitle] = useState('')
  const [isCreatingScene, setIsCreatingScene] = useState(false)

  const chapter = state.chapters.find(c => c.id === chapterId)
  const chapterScenes = state.scenes.filter(s => s.chapter_id === chapterId)
  const project = chapter ? state.projects.find(p => p.id === chapter.project_id) : null

  useEffect(() => {
    if (chapter) {
      setEditedChapter({
        title: chapter.title,
        description: chapter.description || '',
      })
    }
  }, [chapter])

  const handleSaveChapter = async () => {
    if (!chapter || !editedChapter.title?.trim()) return

    setIsSaving(true)
    try {
      await updateChapter(chapter.id, {
        title: editedChapter.title,
        description: editedChapter.description,
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Erro ao salvar capítulo:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCreateScene = async () => {
    if (!chapter || !newSceneTitle.trim()) return

    setIsCreatingScene(true)
    try {
      await createScene({
        title: newSceneTitle,
        content: '',
        chapter_id: chapter.id,
        order_index: chapterScenes.length,
      })
      setNewSceneTitle('')
    } catch (error) {
      console.error('Erro ao criar cena:', error)
    } finally {
      setIsCreatingScene(false)
    }
  }

  const handleDeleteScene = async (sceneId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta cena?')) {
      try {
        await deleteScene(sceneId)
      } catch (error) {
        console.error('Erro ao excluir cena:', error)
      }
    }
  }

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  if (!chapter) {
    return (
      <div className="p-6 text-center">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Capítulo não encontrado</h3>
        <p className="text-muted-foreground mb-4">
          O capítulo que você está procurando não existe ou foi removido.
        </p>
        <Button onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {project?.title || 'Projeto'}
              </span>
            </div>
            <h1 className="text-2xl font-bold">{chapter.title}</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSaveChapter}
                disabled={isSaving || !editedChapter.title?.trim()}
              >
                {isSaving ? (
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Salvar
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit3 className="mr-2 h-4 w-4" />
              Editar
            </Button>
          )}
        </div>
      </div>

      {/* Chapter Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Conteúdo do Capítulo</span>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>{getWordCount(chapter.description || '')} palavras</span>
              <span>{chapterScenes.length} cenas</span>
            </div>
          </CardTitle>
          <CardDescription>
            {isEditing ? 'Edite o título e conteúdo do capítulo' : 'Visualize e gerencie o conteúdo do capítulo'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div>
                <label className="text-sm font-medium mb-2 block">Título</label>
                <Input
                  value={editedChapter.title || ''}
                  onChange={(e) => setEditedChapter(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Título do capítulo"
                  className="text-lg font-semibold"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Descrição</label>
                <Textarea
                  value={editedChapter.description || ''}
                  onChange={(e) => setEditedChapter(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o conteúdo do seu capítulo aqui..."
                  className="min-h-[300px] resize-none"
                />
              </div>
            </>
          ) : (
            <div className="space-y-4">
              {chapter.description ? (
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {chapter.description}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="mx-auto h-8 w-8 mb-2" />
                  <p>Nenhuma descrição ainda. Clique em "Editar" para começar a escrever.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Scenes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Cenas do Capítulo</h2>
          <div className="flex items-center space-x-2">
            <Input
              value={newSceneTitle}
              onChange={(e) => setNewSceneTitle(e.target.value)}
              placeholder="Título da nova cena"
              className="w-64"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newSceneTitle.trim()) {
                  handleCreateScene()
                }
              }}
            />
            <Button 
              onClick={handleCreateScene}
              disabled={!newSceneTitle.trim() || isCreatingScene}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Cena
            </Button>
          </div>
        </div>

        {chapterScenes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma cena criada</h3>
              <p className="text-muted-foreground mb-4">
                Organize seu capítulo em cenas para facilitar a escrita e revisão.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {chapterScenes.map((scene, index) => (
              <Card key={scene.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="secondary">Cena {index + 1}</Badge>
                      <CardTitle className="text-lg">{scene.title}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => console.log('Editar cena:', scene.id)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteScene(scene.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {scene.content ? (
                      <>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {scene.content}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{getWordCount(scene.content)} palavras</span>
                          <span>Atualizada {new Date(scene.updated_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        Cena sem conteúdo. Clique em editar para começar a escrever.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChapterEditor