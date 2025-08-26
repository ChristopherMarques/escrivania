'use client'

import { ProjectDashboard } from '@/components/dashboard/ProjectDashboard'
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
import { LogOut, User, BookOpen, Sparkles } from 'lucide-react'
import React from 'react'

interface MainLayoutProps {
  children?: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { state } = useProject()
  const { user, signIn, signOut } = useAuth()

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



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Simple Header */}
      <header className="border-b border-white/20 bg-white/60 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-escrivania-purple-100 to-escrivania-blue-100 rounded-xl">
              <Sparkles className="h-6 w-6 text-escrivania-purple-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-escrivania-purple-600 to-escrivania-blue-600 bg-clip-text text-transparent">
                Escrivania Digital
              </h1>
              <p className="text-sm text-muted-foreground">Hub Criativo para Escritores</p>
            </div>
          </div>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt={user.name || 'Usuário'} />
                    <AvatarFallback className="bg-gradient-to-br from-escrivania-purple-100 to-escrivania-blue-100 text-escrivania-purple-700">
                      {getUserInitials(user.name)}
                    </AvatarFallback>
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
            <Button 
              onClick={signIn}
              className="bg-gradient-to-r from-escrivania-purple-500 to-escrivania-blue-500 hover:from-escrivania-purple-600 hover:to-escrivania-blue-600 text-white"
            >
              <User className="mr-2 h-4 w-4" />
              Entrar
            </Button>
          )}
        </div>
      </header>

      {/* Main Content - Just the Dashboard */}
      <main className="flex-1">
        <ProjectDashboard />
      </main>
    </div>
  )
}

export default MainLayout