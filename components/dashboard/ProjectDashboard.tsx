"use client";

import React, { useState } from "react";
import { Plus, BookOpen, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProject } from "@/contexts/ProjectContext";
import { useAuth } from "@/contexts/AuthContext";
import type { Project } from "@/contexts/ProjectContext";
import { cn } from "@/lib/utils";
import { CreateProjectForm } from "@/components/forms/CreateProjectForm";
import { useRouter } from "next/navigation";

interface ProjectDashboardProps {
  className?: string;
}

export function ProjectDashboard({ className }: ProjectDashboardProps) {
  const { state, setCurrentProject } = useProject();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateProject = () => {
    setShowCreateForm(true);
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
  };

  const handleSelectProject = (project: Project) => {
    setCurrentProject(project);
    console.log("Projeto selecionado:", project.title);
    router.push(`/project/${project.id}`);
  };

  const getProjectStats = (projectId: string) => {
    const chapters = state.chapters.filter((c) => c.project_id === projectId);
    const chapterIds = chapters.map((c) => c.id);
    const scenes = state.scenes.filter((s) =>
      chapterIds.includes(s.chapter_id)
    );
    const characters = state.characters.filter(
      (c) => c.project_id === projectId
    );

    return {
      chapters: chapters.length,
      scenes: scenes.length,
      characters: characters.length,
    };
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Faça login para continuar
          </h3>
          <p className="text-muted-foreground mb-4">
            Você precisa estar logado para acessar seus projetos literários.
          </p>
          <Button onClick={() => console.log("Implementar login")}>
            Fazer Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen p-6", className)}>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            Bem-vindo, {user?.name || "Escritor"}!
          </h1>
          <p className="text-lg text-muted-foreground">
            Comece sua jornada literária criando um novo projeto
          </p>
          <Button
            onClick={handleCreateProject}
            size="lg"
            className="bg-gradient-to-r from-escrivania-purple-600 to-escrivania-blue-600 hover:from-escrivania-purple-700 hover:to-escrivania-blue-700 text-white shadow-lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Novo Projeto
          </Button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">
              Seus Projetos
            </h2>
          </div>

          <div className="space-y-4">
            {state.loading && user ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="p-6">
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : state.projects.length === 0 ? (
              <div className="text-center py-12">
                <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum projeto encontrado
                </h3>
                <p className="text-gray-600 mb-6">
                  Crie seu primeiro projeto literário para começar a escrever
                </p>
                <Button onClick={handleCreateProject}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeiro Projeto
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {state.projects.map((project) => {
                  const stats = getProjectStats(project.id);
                  return (
                    <Card
                      key={project.id}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-semibold text-foreground truncate">
                          {project.title}
                        </CardTitle>
                        {project.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {project.description}
                          </p>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <div>
                            <p className="font-semibold text-foreground">
                              {stats.chapters}
                            </p>
                            <p className="text-muted-foreground">Capítulos</p>
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">
                              {stats.scenes}
                            </p>
                            <p className="text-muted-foreground">Cenas</p>
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">
                              {stats.characters}
                            </p>
                            <p className="text-muted-foreground">Personagens</p>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleSelectProject(project)}
                          className="w-full"
                          variant="outline"
                        >
                          Abrir
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {state.error && (
              <div className="mt-8">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
                  <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                    <FileText className="h-6 w-6 text-red-600" />
                  </div>
                  <p className="text-red-800 font-medium text-center">
                    {state.error}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateProjectForm
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}

export default ProjectDashboard;
