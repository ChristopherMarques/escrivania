"use client";

import { CreateProjectForm } from "@/components/forms/CreateProjectForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import type { Project } from "@/contexts/ProjectContext";
import { useProject } from "@/contexts/ProjectContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { BookOpen, FileText, Plus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
    router.push(`/project/${project.id}`);
  };

  const getProjectStats = (projectId: string) => {
    const projectChapters = state.chapters.filter(
      (c) => c.project_id === projectId
    );
    const projectScenes = state.scenes.filter((s) =>
      projectChapters.some((c) => c.id === s.chapter_id)
    );
    const projectCharacters = state.characters.filter(
      (c) => c.project_id === projectId
    );

    return {
      chapters: projectChapters.length,
      scenes: projectScenes.length,
      characters: projectCharacters.length,
    };
  };

  const totalChapters = state.chapters.length;
  const totalCharacters = state.characters.length;

  if (authLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

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
    <div className={cn("min-h-screen relative overflow-hidden", className)}>
      {/* Background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-escrivania-purple-500/10 to-escrivania-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-tr from-escrivania-blue-500/8 to-escrivania-purple-500/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-gradient-to-tl from-escrivania-purple-500/12 to-escrivania-blue-500/12 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-6">
        {showCreateForm ? (
          <CreateProjectForm
            open={showCreateForm}
            onOpenChange={setShowCreateForm}
            onSuccess={handleCreateSuccess}
          />
        ) : (
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <motion.div
                className="flex justify-center mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="p-3 gradient-bg rounded-xl shadow-lg">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
              </motion.div>
              <motion.h1
                className="text-5xl md:text-6xl font-bold mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="gradient-text">Bem-vindo,</span>
                <br />
                <span className="text-foreground">
                  {user?.name || "Escritor"}!
                </span>
              </motion.h1>
              <motion.p
                className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Continue sua jornada criativa e transforme suas ideias em
                histórias extraordinárias
              </motion.p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-8"
              >
                <Button
                  onClick={handleCreateProject}
                  size="lg"
                  className="gradient-bg hover:shadow-xl transition-all duration-300 text-white shadow-lg px-8 py-3 text-lg font-semibold"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Criar Novo Projeto
                </Button>
              </motion.div>
            </motion.div>

            {/* Statistics Cards */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <motion.div
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-escrivania-purple-500/10 to-escrivania-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center space-x-4">
                      <motion.div
                        className="p-3 gradient-bg rounded-xl"
                        whileHover={{ rotate: 10 }}
                      >
                        <BookOpen className="h-6 w-6 text-white" />
                      </motion.div>
                      <div>
                        <p className="text-3xl font-bold gradient-text">
                          {state.projects.length}
                        </p>
                        <p className="text-sm text-muted-foreground font-medium">
                          Projetos
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-escrivania-purple-500/10 to-escrivania-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center space-x-4">
                      <motion.div
                        className="p-3 gradient-bg rounded-xl"
                        whileHover={{ rotate: 10 }}
                      >
                        <FileText className="h-6 w-6 text-white" />
                      </motion.div>
                      <div>
                        <p className="text-3xl font-bold gradient-text">
                          {totalChapters}
                        </p>
                        <p className="text-sm text-muted-foreground font-medium">
                          Capítulos
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-escrivania-purple-500/10 to-escrivania-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center space-x-4">
                      <motion.div
                        className="p-3 gradient-bg rounded-xl"
                        whileHover={{ rotate: 10 }}
                      >
                        <Sparkles className="h-6 w-6 text-white" />
                      </motion.div>
                      <div>
                        <p className="text-3xl font-bold gradient-text">
                          {totalCharacters}
                        </p>
                        <p className="text-sm text-muted-foreground font-medium">
                          Personagens
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Projects Section */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold gradient-text">
                  Seus Projetos
                </h2>
              </div>

              {state.projects.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-12"
                >
                  <div className="max-w-md mx-auto">
                    <div className="mb-6">
                      <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                        <BookOpen className="h-12 w-12 text-muted-foreground" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Nenhum projeto ainda
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Comece sua jornada literária criando seu primeiro projeto.
                    </p>
                    <Button
                      onClick={handleCreateProject}
                      size="lg"
                      className="gradient-bg hover:shadow-lg transition-all duration-300 text-white font-semibold"
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Criar Primeiro Projeto
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {state.projects.map((project, index) => {
                    const stats = getProjectStats(project.id);
                    return (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className="cursor-pointer hover:shadow-2xl transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm hover:bg-card/90 group relative overflow-hidden"
                          onClick={() => handleSelectProject(project)}
                        >
                          {/* Subtle gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-br from-escrivania-purple-500/5 to-escrivania-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          <CardHeader className="pb-3 relative z-10">
                            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                              <motion.div
                                className="p-2 gradient-bg rounded-lg"
                                whileHover={{ rotate: 10 }}
                              >
                                <BookOpen className="h-4 w-4 text-white" />
                              </motion.div>
                              {project.title}
                            </CardTitle>
                            {project.description && (
                              <p className="text-sm text-muted-foreground mt-2">
                                {project.description}
                              </p>
                            )}
                          </CardHeader>
                          <CardContent className="space-y-4 relative z-10">
                            <div className="flex justify-between text-sm">
                              <div className="text-center">
                                <p className="font-bold text-lg gradient-text">
                                  {stats.chapters}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  Capítulos
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="font-bold text-lg gradient-text">
                                  {stats.scenes}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  Cenas
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="font-bold text-lg gradient-text">
                                  {stats.characters}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  Personagens
                                </p>
                              </div>
                            </div>
                            <Button
                              onClick={() => handleSelectProject(project)}
                              className="w-full gradient-bg hover:shadow-lg transition-all duration-300 text-white font-semibold"
                            >
                              Abrir Projeto
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectDashboard;
