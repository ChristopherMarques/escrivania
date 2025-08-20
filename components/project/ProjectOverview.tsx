'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import {
  BookOpen,
  FileText,
  Users,
  Layers,
  Plus,
  Edit3,
  Trash2,
  Eye,
  BarChart3,
  Calendar,
  Target,
  TrendingUp,
} from 'lucide-react'
import { useProject } from '@/contexts/ProjectContext'
import type { Project, Chapter, Scene, Character, Synopsis } from '@/contexts/ProjectContext'

interface ProjectOverviewProps {
  projectId: string
  onNavigate?: (view: string, id?: string) => void
}

export function ProjectOverview({ projectId, onNavigate }: ProjectOverviewProps) {
  const { state, deleteChapter, deleteScene, deleteCharacter, deleteSynopsis } = useProject()
  const [activeTab, setActiveTab] = useState<'chapters' | 'characters' | 'synopses'>('chapters')

  const project = state.projects.find(p => p.id === projectId)
  const chapters = state.chapters.filter(c => c.project_id === projectId).sort((a, b) => a.order_index - b.order_index)
  const characters = state.characters.filter(c => c.project_id === projectId)
  const synopses = state.synopses.filter(s => s.project_id === projectId)
  
  // Calcular estatísticas do projeto
  const scenes = state.scenes.filter(s => {
    const chapter = state.chapters.find(c => c.id === s.chapter_id)
    return chapter?.project_id === projectId
  })
  
  const totalWords = scenes.reduce((total, scene) => {
    return total + (scene.content ? scene.content.trim().split(/\s+/).filter(word => word.length > 0).length : 0)
  }, 0)
  
  const completedScenes = scenes.filter(s => s.content && s.content.trim().length > 0).length
  const completionPercentage = scenes.length > 0 ? Math.round((completedScenes / scenes.length) * 100) : 0
  
  const averageWordsPerScene = scenes.length > 0 ? Math.round(totalWords / scenes.length) : 0
  const estimatedReadingTime = Math.ceil(totalWords / 200) // 200 palavras por minuto

  if (!project) {
    return (
      <div className="p-6 text-center">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Projeto não encontrado</h3>
        <p className="text-muted-foreground mb-4">
          O projeto que você está procurando não existe ou foi removido.
        </p>
      </div>
    )
  }

  const handleDelete = async (type: 'chapter' | 'scene' | 'character' | 'synopsis', id: string) => {
    if (!confirm(`Tem certeza que deseja excluir este ${type}?`)) return
    
    try {
      switch (type) {
        case 'chapter':
          await deleteChapter(id)
          break
        case 'scene':
          await deleteScene(id)
          break
        case 'character':
          await deleteCharacter(id)
          break
        case 'synopsis':
          await deleteSynopsis(id)
          break
      }
    } catch (error) {
      console.error(`Erro ao excluir ${type}:`, error)
    }
  }

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Project Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <BookOpen className="mr-3 h-8 w-8" />
            {project.title}
          </h1>
          <p className="text-muted-foreground mt-2">
            {project.description || 'Sem descrição'}
          </p>
        </div>
        <Button 
          onClick={() => onNavigate?.('project-settings', projectId)}
          variant="outline"
        >
          <Edit3 className="mr-2 h-4 w-4" />
          Configurações
        </Button>
      </div>

      {/* Project Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Layers className="mr-2 h-4 w-4" />
              Capítulos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chapters.length}</div>
            <p className="text-xs text-muted-foreground">
              {scenes.length} cenas no total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Palavras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWords.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              ~{estimatedReadingTime} min leitura
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Personagens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{characters.length}</div>
            <p className="text-xs text-muted-foreground">
              {synopses.length} sinopses
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="mr-2 h-4 w-4" />
              Progresso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionPercentage}%</div>
            <Progress value={completionPercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {completedScenes} de {scenes.length} cenas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Estatísticas Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Média de palavras por cena</span>
                <span className="text-sm text-muted-foreground">{averageWordsPerScene}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Cenas por capítulo</span>
                <span className="text-sm text-muted-foreground">
                  {chapters.length > 0 ? Math.round(scenes.length / chapters.length) : 0}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Criado em</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(project.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Última atualização</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(project.updated_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge variant={completionPercentage > 50 ? 'default' : 'secondary'}>
                  {completionPercentage === 100 ? 'Completo' : 
                   completionPercentage > 50 ? 'Em progresso' : 'Iniciando'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tempo estimado</span>
                <span className="text-sm text-muted-foreground">
                  {estimatedReadingTime}min
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Content Tabs */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Button 
            variant={activeTab === 'chapters' ? 'default' : 'outline'}
            onClick={() => setActiveTab('chapters')}
          >
            <Layers className="mr-2 h-4 w-4" />
            Capítulos ({chapters.length})
          </Button>
          <Button 
            variant={activeTab === 'characters' ? 'default' : 'outline'}
            onClick={() => setActiveTab('characters')}
          >
            <Users className="mr-2 h-4 w-4" />
            Personagens ({characters.length})
          </Button>
          <Button 
            variant={activeTab === 'synopses' ? 'default' : 'outline'}
            onClick={() => setActiveTab('synopses')}
          >
            <FileText className="mr-2 h-4 w-4" />
            Sinopses ({synopses.length})
          </Button>
        </div>

        {/* Chapters Tab */}
        {activeTab === 'chapters' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Capítulos</h2>
              <Button onClick={() => onNavigate?.('create-chapter', projectId)}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Capítulo
              </Button>
            </div>
            
            {chapters.length > 0 ? (
              <div className="grid gap-4">
                {chapters.map((chapter) => {
                  const chapterScenes = scenes.filter(s => s.chapter_id === chapter.id)
                  const chapterWords = chapterScenes.reduce((total, scene) => 
                    total + getWordCount(scene.content || ''), 0
                  )
                  const completedChapterScenes = chapterScenes.filter(s => s.content && s.content.trim().length > 0).length
                  const chapterProgress = chapterScenes.length > 0 ? Math.round((completedChapterScenes / chapterScenes.length) * 100) : 0
                  
                  return (
                    <Card key={chapter.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline">#{chapter.order_index}</Badge>
                            <CardTitle className="text-lg">{chapter.title}</CardTitle>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => onNavigate?.('chapter-editor', chapter.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => onNavigate?.('chapter-editor', chapter.id)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDelete('chapter', chapter.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <CardDescription>
                          {chapter.description || 'Sem descrição'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span>{chapterScenes.length} cenas</span>
                            <span>{chapterWords.toLocaleString()} palavras</span>
                            <span>{chapterProgress}% completo</span>
                          </div>
                          <Progress value={chapterProgress} />
                          <div className="text-xs text-muted-foreground">
                            Atualizado {new Date(chapter.updated_at).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Layers className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground mb-4">Nenhum capítulo criado ainda.</p>
                  <Button onClick={() => onNavigate?.('create-chapter', projectId)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Primeiro Capítulo
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Characters Tab */}
        {activeTab === 'characters' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Personagens</h2>
              <Button onClick={() => onNavigate?.('create-character', projectId)}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Personagem
              </Button>
            </div>
            
            {characters.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {characters.map((character) => {
                  // Encontrar cenas onde o personagem aparece
                  const characterScenes = scenes.filter(scene => 
                    scene.content?.toLowerCase().includes(character.name.toLowerCase())
                  )
                  
                  return (
                    <Card key={character.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center">
                            <Users className="mr-2 h-4 w-4" />
                            {character.name}
                          </CardTitle>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => onNavigate?.('character-editor', character.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => onNavigate?.('character-editor', character.id)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDelete('character', character.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {character.description || 'Sem descrição'}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Aparece em {characterScenes.length} cenas</span>
                            <span>Criado {new Date(character.created_at).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Users className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground mb-4">Nenhum personagem criado ainda.</p>
                  <Button onClick={() => onNavigate?.('create-character', projectId)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Primeiro Personagem
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Synopses Tab */}
        {activeTab === 'synopses' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Sinopses</h2>
              <Button onClick={() => onNavigate?.('create-synopsis', projectId)}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Sinopse
              </Button>
            </div>
            
            {synopses.length > 0 ? (
              <div className="grid gap-4">
                {synopses.map((synopsis) => (
                  <Card key={synopsis.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center">
                          <FileText className="mr-2 h-4 w-4" />
                          {synopsis.title}
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => onNavigate?.('synopsis-editor', synopsis.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => onNavigate?.('synopsis-editor', synopsis.id)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete('synopsis', synopsis.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground line-clamp-4">
                          {synopsis.content || 'Sem conteúdo'}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{getWordCount(synopsis.content || '')} palavras</span>
                          <span>Atualizada {new Date(synopsis.updated_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground mb-4">Nenhuma sinopse criada ainda.</p>
                  <Button onClick={() => onNavigate?.('create-synopsis', projectId)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Primeira Sinopse
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectOverview