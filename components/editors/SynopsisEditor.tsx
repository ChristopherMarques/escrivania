'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Save,
  Edit3,
  ArrowLeft,
  Clock,
  FileText,
  BookOpen,
  Users,
  Layers,
} from 'lucide-react'
import { useProject } from '@/contexts/ProjectContext'
import type { Synopsis } from '@/contexts/ProjectContext'

interface SynopsisEditorProps {
  synopsisId: string
  onBack?: () => void
}

export function SynopsisEditor({ synopsisId, onBack }: SynopsisEditorProps) {
  const { state, updateSynopsis } = useProject()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editedSynopsis, setEditedSynopsis] = useState<Partial<Synopsis>>({})

  const synopsis = state.synopses.find(s => s.id === synopsisId)
  const project = synopsis ? state.projects.find(p => p.id === synopsis.project_id) : null
  
  // Estatísticas do projeto relacionado
  const projectStats = project ? {
    chapters: state.chapters.filter(c => c.project_id === project.id).length,
    scenes: state.scenes.filter(s => {
      const chapter = state.chapters.find(c => c.id === s.chapter_id)
      return chapter?.project_id === project.id
    }).length,
    characters: state.characters.filter(c => c.project_id === project.id).length,
  } : { chapters: 0, scenes: 0, characters: 0 }

  useEffect(() => {
    if (synopsis) {
      setEditedSynopsis({
        title: synopsis.title,
        content: synopsis.content || '',
      })
    }
  }, [synopsis])

  const handleSaveSynopsis = async () => {
    if (!synopsis || !editedSynopsis.title?.trim()) return

    setIsSaving(true)
    try {
      await updateSynopsis(synopsis.id, {
        title: editedSynopsis.title,
        content: editedSynopsis.content,
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Erro ao salvar sinopse:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  const getCharacterCount = (text: string) => {
    return text.length
  }

  const getReadingTime = (text: string) => {
    const wordsPerMinute = 200
    const words = getWordCount(text)
    const minutes = Math.ceil(words / wordsPerMinute)
    return minutes
  }

  if (!synopsis) {
    return (
      <div className="p-6 text-center">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Sinopse não encontrada</h3>
        <p className="text-muted-foreground mb-4">
          A sinopse que você está procurando não existe ou foi removida.
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
            <h1 className="text-2xl font-bold flex items-center">
              <FileText className="mr-2 h-6 w-6" />
              {synopsis.title}
            </h1>
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
                onClick={handleSaveSynopsis}
                disabled={isSaving || !editedSynopsis.title?.trim()}
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

      {/* Synopsis Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Conteúdo da Sinopse</span>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>{getWordCount(synopsis.content || '')} palavras</span>
              <span>{getCharacterCount(synopsis.content || '')} caracteres</span>
              <span>~{getReadingTime(synopsis.content || '')} min leitura</span>
            </div>
          </CardTitle>
          <CardDescription>
            {isEditing ? 'Edite o título e conteúdo da sinopse' : 'Visualize e gerencie o conteúdo da sinopse'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div>
                <label className="text-sm font-medium mb-2 block">Título</label>
                <Input
                  value={editedSynopsis.title || ''}
                  onChange={(e) => setEditedSynopsis(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Título da sinopse"
                  className="text-lg font-semibold"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Conteúdo</label>
                <Textarea
                  value={editedSynopsis.content || ''}
                  onChange={(e) => setEditedSynopsis(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Escreva a sinopse do seu projeto: resumo da história, personagens principais, conflitos, temas..."
                  className="min-h-[400px] resize-none"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>{getWordCount(editedSynopsis.content || '')} palavras</span>
                  <span>{getCharacterCount(editedSynopsis.content || '')} caracteres</span>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              {synopsis.content ? (
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {synopsis.content}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="mx-auto h-8 w-8 mb-2" />
                  <p>Nenhuma sinopse ainda. Clique em "Editar" para adicionar o conteúdo da sinopse.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Synopsis Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Palavras</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getWordCount(synopsis.content || '')}</div>
            <p className="text-xs text-muted-foreground">
              {getCharacterCount(synopsis.content || '')} caracteres
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Leitura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">~{getReadingTime(synopsis.content || '')}</div>
            <p className="text-xs text-muted-foreground">
              minutos estimados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Criada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {new Date(synopsis.created_at).toLocaleDateString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">
              última atualização: {new Date(synopsis.updated_at).toLocaleDateString('pt-BR')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Projeto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium line-clamp-1">
              {project?.title || 'Sem projeto'}
            </div>
            <p className="text-xs text-muted-foreground">
              {project?.description || 'Sem descrição'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Project Overview */}
      {project && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Visão Geral do Projeto</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                {project.title}
              </CardTitle>
              <CardDescription>
                {project.description || 'Sem descrição disponível'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Layers className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold">{projectStats.chapters}</div>
                    <div className="text-sm text-muted-foreground">Capítulos</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold">{projectStats.scenes}</div>
                    <div className="text-sm text-muted-foreground">Cenas</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold">{projectStats.characters}</div>
                    <div className="text-sm text-muted-foreground">Personagens</div>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Criado em {new Date(project.created_at).toLocaleDateString('pt-BR')}</span>
                <span>Atualizado em {new Date(project.updated_at).toLocaleDateString('pt-BR')}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Writing Tips */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Dicas para uma Boa Sinopse</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800">
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Mantenha entre 250-500 palavras para uma sinopse concisa</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Apresente o protagonista, conflito principal e stakes da história</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Revele o final - sinopses não devem ter suspense</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Use tempo presente e terceira pessoa</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Foque nos eventos principais, evite subtramas menores</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default SynopsisEditor