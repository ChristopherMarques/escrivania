'use client'

import React, { useState } from 'react'
import { Plus, BookOpen, Users, FileText, Edit3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useProject } from '@/contexts/ProjectContext'
import { useAuth } from '@/contexts/AuthContext'
import type { Project } from '@/contexts/ProjectContext'

interface ProjectDashboardProps {
  className?: string
}

export function ProjectDashboard({ className }: ProjectDashboardProps) {
  const { state, setCurrentProject } = useProject()
  const { user } = useAuth()
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateProject = () => {
    setIsCreating(true)
    // TODO: Implementar modal de criação de projeto
    console.log('Criar novo projeto')
  }

  const handleSelectProject = (project: Project) => {
    setCurrentProject(project)
    // TODO: Navegar para a página do projeto
    console.log('Projeto selecionado:', project.title)
  }

  const getProjectStats = (projectId: string) => {
    const chapters = state.chapters.filter(c => c.project_id === projectId)
    const scenes = state.scenes.filter(s => 
      chapters.some(c => c.id === s.chapter_id)
    )
    const characters = state.characters.filter(c => c.project_id === projectId)
    
    return {
      chapters: chapters.length,
      scenes: scenes.length,
      characters: characters.length
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Faça login para continuar</h3>
          <p className="text-muted-foreground mb-4">
            Você precisa estar logado para acessar seus projetos literários.
          </p>
          <Button onClick={() => console.log('Implementar login')}>
            Fazer Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meus Projetos</h1>
          <p className="text-muted-foreground">
            Gerencie seus projetos literários, capítulos, cenas e personagens.
          </p>
        </div>
        <Button onClick={handleCreateProject} disabled={isCreating}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      {state.loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-muted rounded w-full mb-2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : state.projects.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum projeto encontrado</h3>
          <p className="text-muted-foreground mb-4">
            Comece criando seu primeiro projeto literário.
          </p>
          <Button onClick={handleCreateProject}>
            <Plus className="mr-2 h-4 w-4" />
            Criar Primeiro Projeto
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.projects.map((project) => {
            const stats = getProjectStats(project.id)
            return (
              <Card 
                key={project.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleSelectProject(project)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{project.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {project.description || 'Sem descrição'}
                      </CardDescription>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        console.log('Editar projeto:', project.id)
                      }}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{stats.chapters} capítulos</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>{stats.scenes} cenas</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{stats.characters} personagens</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      {new Date(project.created_at).toLocaleDateString('pt-BR')}
                    </Badge>
                    <Badge variant="outline">
                      Atualizado {new Date(project.updated_at).toLocaleDateString('pt-BR')}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {state.error && (
        <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive font-medium">Erro:</p>
          <p className="text-destructive">{state.error}</p>
        </div>
      )}
    </div>
  )
}

export default ProjectDashboard