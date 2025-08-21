'use client'

import React, { useState } from 'react'
import { Plus, BookOpen, Users, FileText, Edit3, TrendingUp, Clock, Target, Zap, Calendar, BarChart3, PenTool, Star, Sparkles, Coffee, Moon, Sun, Heart, Award, Activity, Eye, MessageSquare, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useProject } from '@/contexts/ProjectContext'
import { useAuth } from '@/contexts/AuthContext'
import type { Project } from '@/contexts/ProjectContext'
import { cn } from '@/lib/utils'
import { CreateProjectForm } from '@/components/forms/CreateProjectForm'

interface ProjectDashboardProps {
  className?: string
}

export function ProjectDashboard({ className }: ProjectDashboardProps) {
  const { state, setCurrentProject } = useProject()
  const { user } = useAuth()
  const [isCreating, setIsCreating] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const handleCreateProject = () => {
    setShowCreateForm(true)
  }

  const handleCreateSuccess = () => {
    setShowCreateForm(false)
    // Projeto criado com sucesso, a lista será atualizada automaticamente
  }

  const handleSelectProject = (project: Project) => {
    setCurrentProject(project)
    // TODO: Navegar para a página do projeto
    console.log('Projeto selecionado:', project.title)
  }

  // Função auxiliar para obter estatísticas do projeto
  const getProjectStats = (projectId: string) => {
    const chapters = state.chapters.filter(c => c.project_id === projectId)
    const scenes = state.scenes.filter(s => s.project_id === projectId)
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
    <div className={cn("min-h-screen bg-gradient-to-br from-background via-background/95 to-escrivania-purple-50/20 relative overflow-hidden", className)}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-escrivania-purple-400/8 to-escrivania-blue-400/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-escrivania-blue-400/8 to-escrivania-purple-400/8 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-escrivania-purple-300/5 to-escrivania-blue-300/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '4s'}} />
      </div>
      
      <div className="relative z-10">
        {/* Modern Header with Glass Effect */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-escrivania-purple-500/5 via-transparent to-escrivania-blue-500/5" />
          <div className="relative px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-escrivania-purple-100 to-escrivania-blue-100 rounded-xl">
                    <Sparkles className="h-6 w-6 text-escrivania-purple-600" />
                  </div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-escrivania-purple-600 to-escrivania-blue-600 bg-clip-text text-transparent">
                    Escrivania
                  </h1>
                </div>
                <p className="text-lg text-muted-foreground font-medium max-w-md">
                  Transforme suas ideias em histórias extraordinárias
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Sun className="h-4 w-4" />
                    <span>Bom dia, {user?.name || 'Escritor'}!</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline"
                  className="border-escrivania-purple-200 text-escrivania-purple-700 hover:bg-escrivania-purple-50 rounded-xl"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Visualizar
                </Button>
                <Button 
                  onClick={handleCreateProject} 
                  disabled={isCreating}
                  className="bg-gradient-to-r from-escrivania-purple-500 to-escrivania-blue-500 hover:from-escrivania-purple-600 hover:to-escrivania-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-xl"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Novo Projeto
                </Button>
              </div>
            </div>

            {/* Modern Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Main Stats Card */}
              <Card className="md:col-span-2 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-escrivania-purple-500/10 to-escrivania-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="p-8 relative">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-muted-foreground mb-2">Progresso Hoje</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold bg-gradient-to-r from-escrivania-purple-600 to-escrivania-blue-600 bg-clip-text text-transparent">1,247</span>
                        <span className="text-lg text-muted-foreground">palavras</span>
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-escrivania-purple-100 to-escrivania-blue-100 rounded-2xl">
                      <PenTool className="h-8 w-8 text-escrivania-purple-600" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Meta diária: 1,500 palavras</span>
                      <span className="font-semibold text-escrivania-purple-600">83%</span>
                    </div>
                    <Progress value={83} className="h-3 bg-escrivania-purple-100" />
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Flame className="h-4 w-4 text-orange-500" />
                        <span>Sequência de 12 dias</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Coffee className="h-4 w-4 text-amber-600" />
                        <span>3h 24min escrevendo</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Projects Card */}
              <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-escrivania-purple-100 to-escrivania-purple-200 rounded-xl">
                      <BookOpen className="h-6 w-6 text-escrivania-purple-600" />
                    </div>
                    <Badge className="bg-escrivania-purple-100 text-escrivania-purple-700 border-0">Ativos</Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Projetos</p>
                    <p className="text-3xl font-bold text-escrivania-purple-600">{state.projects.length}</p>
                    <p className="text-xs text-muted-foreground">+2 este mês</p>
                  </div>
                </CardContent>
              </Card>

              {/* Achievement Card */}
              <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-escrivania-blue-100 to-escrivania-blue-200 rounded-xl">
                      <Award className="h-6 w-6 text-escrivania-blue-600" />
                    </div>
                    <Badge className="bg-escrivania-blue-100 text-escrivania-blue-700 border-0">Nível 8</Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Conquistas</p>
                    <p className="text-3xl font-bold text-escrivania-blue-600">24</p>
                    <p className="text-xs text-muted-foreground">Próxima em 2 dias</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="px-6 pb-8 space-y-8">
          {/* Quick Actions & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Projects Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1">Seus Projetos</h2>
                  <p className="text-muted-foreground">Continue de onde parou</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-escrivania-purple-100 text-escrivania-purple-700 border-0">
                    {state.projects.length} projetos
                  </Badge>
                  <Button variant="outline" size="sm" className="border-escrivania-purple-200 text-escrivania-purple-700 hover:bg-escrivania-purple-50">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Estatísticas
                  </Button>
                </div>
              </div>

              {state.loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i} className="animate-pulse bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader className="pb-4">
                        <div className="h-5 bg-gradient-to-r from-escrivania-purple-200 to-escrivania-blue-200 rounded-lg w-3/4"></div>
                        <div className="h-4 bg-muted/50 rounded-lg w-1/2"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="h-4 bg-muted/50 rounded-lg"></div>
                          <div className="h-4 bg-muted/50 rounded-lg w-5/6"></div>
                          <div className="flex gap-2 mt-4">
                            <div className="h-6 bg-muted/50 rounded-full w-16"></div>
                            <div className="h-6 bg-muted/50 rounded-full w-16"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : state.projects.length === 0 ? (
                <div className="text-center py-16">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-escrivania-purple-100 to-escrivania-blue-100 rounded-full w-24 h-24 mx-auto opacity-20 animate-pulse"></div>
                    <BookOpen className="relative mx-auto h-16 w-16 text-escrivania-purple-500 mb-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-escrivania-purple-600 to-escrivania-blue-600 bg-clip-text text-transparent">
                    Sua jornada literária começa aqui
                  </h3>
                  <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto">
                    Crie seu primeiro projeto e transforme suas ideias em histórias incríveis.
                  </p>
                  <Button 
                    onClick={handleCreateProject} 
                    disabled={isCreating}
                    className="bg-gradient-to-r from-escrivania-purple-500 to-escrivania-blue-500 hover:from-escrivania-purple-600 hover:to-escrivania-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 rounded-xl text-lg"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Criar Primeiro Projeto
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {state.projects.map((project) => {
                    const stats = getProjectStats(project.id)
                    return (
                      <Card 
                        key={project.id} 
                        className="group cursor-pointer bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] overflow-hidden"
                        onClick={() => handleSelectProject(project)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-escrivania-purple-500/5 to-escrivania-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <CardHeader className="relative pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-xl mb-2 font-bold bg-gradient-to-r from-escrivania-purple-700 to-escrivania-blue-700 bg-clip-text text-transparent group-hover:from-escrivania-purple-600 group-hover:to-escrivania-blue-600 transition-all duration-300">
                                {project.title}
                              </CardTitle>
                              <CardDescription className="line-clamp-2 text-muted-foreground">
                                {project.description || 'Sem descrição'}
                              </CardDescription>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-escrivania-purple-100 rounded-xl"
                              onClick={(e) => {
                                e.stopPropagation()
                                console.log('Editar projeto:', project.id)
                              }}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="relative">
                          <div className="grid grid-cols-3 gap-3 mb-6">
                            <div className="text-center p-3 bg-gradient-to-br from-escrivania-purple-50 to-escrivania-purple-100 rounded-xl">
                              <BookOpen className="h-5 w-5 text-escrivania-purple-600 mx-auto mb-1" />
                              <p className="text-sm font-bold text-escrivania-purple-700">{stats.chapters}</p>
                              <p className="text-xs text-escrivania-purple-600">Capítulos</p>
                            </div>
                            <div className="text-center p-3 bg-gradient-to-br from-escrivania-blue-50 to-escrivania-blue-100 rounded-xl">
                              <FileText className="h-5 w-5 text-escrivania-blue-600 mx-auto mb-1" />
                              <p className="text-sm font-bold text-escrivania-blue-700">{stats.scenes}</p>
                              <p className="text-xs text-escrivania-blue-600">Cenas</p>
                            </div>
                            <div className="text-center p-3 bg-gradient-to-br from-escrivania-purple-50 to-escrivania-blue-50 rounded-xl">
                              <Users className="h-5 w-5 text-escrivania-purple-600 mx-auto mb-1" />
                              <p className="text-sm font-bold text-escrivania-purple-700">{stats.characters}</p>
                              <p className="text-xs text-escrivania-purple-600">Personagens</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-muted/30">
                            <Badge variant="secondary" className="bg-escrivania-purple-100 text-escrivania-purple-700 border-0">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(project.created_at).toLocaleDateString('pt-BR')}
                            </Badge>
                            <Badge variant="outline" className="border-escrivania-blue-200 text-escrivania-blue-700">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(project.updated_at).toLocaleDateString('pt-BR')}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Sidebar with Recent Activity & Quick Stats */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl border-0 shadow-xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Atividade Recente</CardTitle>
                    <Activity className="h-5 w-5 text-escrivania-purple-600" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-escrivania-purple-50/50 rounded-xl">
                      <div className="p-2 bg-escrivania-purple-100 rounded-lg">
                        <PenTool className="h-4 w-4 text-escrivania-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">Escreveu 850 palavras</p>
                        <p className="text-xs text-muted-foreground">Romance Fantástico • 2h atrás</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-escrivania-blue-50/50 rounded-xl">
                      <div className="p-2 bg-escrivania-blue-100 rounded-lg">
                        <MessageSquare className="h-4 w-4 text-escrivania-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">Novo comentário</p>
                        <p className="text-xs text-muted-foreground">Maria Silva • 4h atrás</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-escrivania-purple-50/50 rounded-xl">
                      <div className="p-2 bg-escrivania-purple-100 rounded-lg">
                        <Star className="h-4 w-4 text-escrivania-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">Nova conquista</p>
                        <p className="text-xs text-muted-foreground">Escritor Dedicado • 1 dia atrás</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" className="w-full text-escrivania-purple-600 hover:bg-escrivania-purple-50">
                    Ver todas atividades
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl border-0 shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold">Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-gradient-to-r from-escrivania-purple-500 to-escrivania-blue-500 hover:from-escrivania-purple-600 hover:to-escrivania-blue-600 text-white rounded-xl">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Capítulo
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-escrivania-purple-200 text-escrivania-purple-700 hover:bg-escrivania-purple-50 rounded-xl">
                    <Users className="mr-2 h-4 w-4" />
                    Novo Personagem
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-escrivania-blue-200 text-escrivania-blue-700 hover:bg-escrivania-blue-50 rounded-xl">
                    <Target className="mr-2 h-4 w-4" />
                    Definir Meta
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {state.error && (
            <div className="mt-8">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                  <FileText className="h-6 w-6 text-red-600" />
                </div>
                <p className="text-red-800 font-medium text-center">{state.error}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de criação de projeto */}
      <CreateProjectForm
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        onSuccess={handleCreateSuccess}
      />
    </div>
  )
}

export default ProjectDashboard