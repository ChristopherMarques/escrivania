'use client'

import { ProjectDashboard } from '@/components/dashboard/ProjectDashboard'
import { ChapterEditor } from '@/components/editors/ChapterEditor'
import { CharacterEditor } from '@/components/editors/CharacterEditor'
import { SceneEditor } from '@/components/editors/SceneEditor'
import { SynopsisEditor } from '@/components/editors/SynopsisEditor'
import { CreateProjectForm } from '@/components/forms/CreateProjectForm'
import { ProjectSidebar } from '@/components/navigation/ProjectSidebar'
import { ProjectOverview } from '@/components/project/ProjectOverview'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/contexts/AuthContext'
import { useProject } from '@/contexts/ProjectContext'
import { LogOut, Menu, User, X } from 'lucide-react'
import React, { useState } from 'react'

interface MainLayoutProps {
  children?: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { state } = useProject()
  const { user, signIn, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [createProjectOpen, setCreateProjectOpen] = useState(false)
  const [currentView, setCurrentView] = useState<string>('dashboard')
  const [selectedId, setSelectedId] = useState<string | undefined>()

  const handleNavigation = (section: string, id?: string) => {
    setCurrentView(section)
    setSelectedId(id)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const getUserInitials = (name?: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <ProjectDashboard className="p-6" />
      case 'overview':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Visão Geral do Projeto</h1>
            <p className="text-muted-foreground">
              Aqui você verá estatísticas e resumo do projeto selecionado.
            </p>
            {/* TODO: Implementar componente de visão geral */}
          </div>
        )
      case 'chapter':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Editor de Capítulo</h1>
            <p className="text-muted-foreground">
              Editor para o capítulo ID: {selectedId}
            </p>
            {/* TODO: Implementar editor de capítulo */}
          </div>
        )
      case 'scene':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Editor de Cena</h1>
            <p className="text-muted-foreground">
              Editor para a cena ID: {selectedId}
            </p>
            {/* TODO: Implementar editor de cena */}
          </div>
        )
      case 'character':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Perfil do Personagem</h1>
            <p className="text-muted-foreground">
              Perfil do personagem ID: {selectedId}
            </p>
            {/* TODO: Implementar perfil de personagem */}
          </div>
        )
      case 'characters':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Todos os Personagens</h1>
            <p className="text-muted-foreground">
              Lista completa de personagens do projeto.
            </p>
            {/* TODO: Implementar lista de personagens */}
          </div>
        )
      case 'synopsis':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Editor de Sinopse</h1>
            <p className="text-muted-foreground">
              Editor para a sinopse ID: {selectedId}
            </p>
            {/* TODO: Implementar editor de sinopse */}
          </div>
        )
      case 'create-chapter':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Criar Novo Capítulo</h1>
            <p className="text-muted-foreground">
              Formulário para criar um novo capítulo.
            </p>
            {/* TODO: Implementar formulário de criação de capítulo */}
          </div>
        )
      case 'create-character':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Criar Novo Personagem</h1>
            <p className="text-muted-foreground">
              Formulário para criar um novo personagem.
            </p>
            {/* TODO: Implementar formulário de criação de personagem */}
          </div>
        )
      case 'create-synopsis':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Criar Nova Sinopse</h1>
            <p className="text-muted-foreground">
              Formulário para criar uma nova sinopse.
            </p>
            {/* TODO: Implementar formulário de criação de sinopse */}
          </div>
        )
      case 'project-settings':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Configurações do Projeto</h1>
            <p className="text-muted-foreground">
              Configurações e opções do projeto atual.
            </p>
            {/* TODO: Implementar configurações do projeto */}
          </div>
        )
      default:
        return children || <ProjectDashboard className="p-6" />
    }
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-2"
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
          
          <div className="flex-1">
            <h1 className="text-lg font-semibold">
              {state.currentProject ? state.currentProject.title : 'Projetos Literários'}
            </h1>
          </div>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={user.name || 'Usuário'} />
                    <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name || 'Usuário'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email || 'email@exemplo.com'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => console.log('Perfil')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={signIn}>
              Entrar
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <ProjectSidebar 
            className="flex-shrink-0" 
            onNavigate={handleNavigation}
          />
        )}
        
        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          {currentView === 'dashboard' && <ProjectDashboard className="p-6" />}
          {currentView === 'overview' && (
            <ProjectOverview 
              projectId={state.currentProject?.id || ''}
              onNavigate={handleNavigation}
            />
          )}
          {currentView === 'chapter' && selectedId && (
            <ChapterEditor 
              chapterId={selectedId} 
              onBack={() => setCurrentView('overview')}
            />
          )}
          {currentView === 'scene' && selectedId && (
            <SceneEditor 
              sceneId={selectedId}
              onBack={() => setCurrentView('overview')}
            />
          )}
          {currentView === 'character' && selectedId && (
            <CharacterEditor 
              characterId={selectedId}
              onBack={() => setCurrentView('characters')}
            />
          )}
          {currentView === 'synopsis' && selectedId && (
            <SynopsisEditor 
              synopsisId={selectedId}
              onBack={() => setCurrentView('overview')}
            />
          )}
          {!['dashboard', 'overview', 'chapter', 'scene', 'character', 'synopsis'].includes(currentView) && renderContent()}
        </main>
      </div>

      {/* Modals */}
      <CreateProjectForm 
        open={createProjectOpen}
        onOpenChange={setCreateProjectOpen}
        onSuccess={() => {
          console.log('Projeto criado com sucesso!')
          setCurrentView('dashboard')
        }}
      />
    </div>
  )
}

export default MainLayout