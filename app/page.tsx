"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Settings, LogOut, BookOpen, Users, FileText, MoreVertical, Edit, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useProjects } from "@/lib/contexts/projects-context"

export default function Dashboard() {
  const router = useRouter()
  const { state, addProject, deleteProject } = useProjects()

  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false)
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
  })

  const handleCreateProject = () => {
    if (!newProject.title.trim()) return

    addProject({
      title: newProject.title,
      description: newProject.description,
      progress: 0,
      wordCount: 0,
      characters: 0,
      chapters: 0,
    })

    setNewProject({ title: "", description: "" })
    setIsNewProjectOpen(false)
  }

  const handleSelectProject = (projectId: string) => {
    router.push(`/project/${projectId}`)
  }

  const handleDeleteProject = (projectId: string) => {
    deleteProject(projectId)
  }

  if (state.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-purple-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Carregando seus projetos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/60 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Escrivania Digital
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-500 to-blue-400 hover:from-purple-600 hover:to-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Projeto
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-white/90 backdrop-blur-xl border-white/20">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-900">Criar Novo Projeto</DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Comece uma nova história. Dê um título e uma breve descrição para seu projeto.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                        Título do Projeto
                      </Label>
                      <Input
                        id="title"
                        value={newProject.title}
                        onChange={(e) => setNewProject((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Ex: O Último Guardião"
                        className="bg-white/50 border-gray-200 focus:border-purple-300"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                        Descrição (opcional)
                      </Label>
                      <Textarea
                        id="description"
                        value={newProject.description}
                        onChange={(e) => setNewProject((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Uma breve descrição da sua história..."
                        className="bg-white/50 border-gray-200 focus:border-purple-300 min-h-[80px]"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsNewProjectOpen(false)}
                      className="border-gray-200 hover:bg-gray-50"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleCreateProject}
                      disabled={!newProject.title.trim()}
                      className="bg-gradient-to-r from-purple-500 to-blue-400 hover:from-purple-600 hover:to-blue-500 text-white"
                    >
                      Criar Projeto
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer ring-2 ring-purple-200 hover:ring-purple-300 transition-all">
                    <AvatarImage src="/diverse-user-avatars.png" />
                    <AvatarFallback className="bg-gradient-to-br from-purple-100 to-blue-100 text-purple-700">
                      ED
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white/90 backdrop-blur-xl border-white/20">
                  <DropdownMenuItem className="hover:bg-purple-50/50">
                    <Settings className="w-4 h-4 mr-2" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-red-50/50 text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Seus Projetos</h2>
          <p className="text-gray-600">Continue escrevendo suas histórias incríveis</p>
        </div>

        {state.projects.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum projeto ainda</h3>
            <p className="text-gray-500 mb-6">Crie seu primeiro projeto para começar a escrever</p>
            <Button
              onClick={() => setIsNewProjectOpen(true)}
              className="bg-gradient-to-r from-purple-500 to-blue-400 hover:from-purple-600 hover:to-blue-500 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Projeto
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.projects.map((project) => (
              <Card
                key={project.id}
                className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-white/70 backdrop-blur-sm border-white/30 hover:border-purple-200/50 relative"
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/50">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white/90 backdrop-blur-xl border-white/20">
                      <DropdownMenuItem className="hover:bg-purple-50/50">
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="hover:bg-red-50/50 text-red-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteProject(project.id)
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div onClick={() => handleSelectProject(project.id)}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-purple-700 transition-colors pr-8">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 line-clamp-2">
                      {project.description || "Progresso do manuscrito"}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progresso</span>
                        <span className="font-medium text-purple-600">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2 bg-gray-100" />
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <div className="text-center">
                        <div className="flex items-center justify-center w-8 h-8 mx-auto mb-1 rounded-full bg-blue-100">
                          <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        <p className="text-xs text-gray-500">Palavras</p>
                        <p className="text-sm font-semibold text-gray-900">{project.wordCount.toLocaleString()}</p>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center w-8 h-8 mx-auto mb-1 rounded-full bg-purple-100">
                          <Users className="w-4 h-4 text-purple-600" />
                        </div>
                        <p className="text-xs text-gray-500">Personagens</p>
                        <p className="text-sm font-semibold text-gray-900">{project.characters}</p>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center w-8 h-8 mx-auto mb-1 rounded-full bg-green-100">
                          <BookOpen className="w-4 h-4 text-green-600" />
                        </div>
                        <p className="text-xs text-gray-500">Capítulos</p>
                        <p className="text-sm font-semibold text-gray-900">{project.chapters}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Criado em {new Date(project.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
