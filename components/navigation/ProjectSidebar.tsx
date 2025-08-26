"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  FileText,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  Plus,
  Home,
  Edit3,
} from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import type { Project, Chapter } from "@/contexts/ProjectContext";

interface ProjectSidebarProps {
  className?: string;
  onNavigate?: (section: string, id?: string) => void;
}

export function ProjectSidebar({ className, onNavigate }: ProjectSidebarProps) {
  const { state, setCurrentProject } = useProject();
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set()
  );
  const [activeSection, setActiveSection] = useState<string>("dashboard");

  const currentProject = state.currentProject;
  const projectChapters = currentProject
    ? state.chapters.filter((c) => c.project_id === currentProject.id)
    : [];
  const projectCharacters = currentProject
    ? state.characters.filter((c) => c.project_id === currentProject.id)
    : [];
  const projectSynopses = currentProject
    ? state.synopses.filter((s) => s.project_id === currentProject.id)
    : [];

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const handleNavigation = (section: string, id?: string) => {
    setActiveSection(section);
    onNavigate?.(section, id);
  };

  const getChapterScenes = (chapterId: string) => {
    return state.scenes.filter((s) => s.chapter_id === chapterId);
  };

  if (!currentProject) {
    return (
      <div className={cn("w-64 border-r bg-muted/10", className)}>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5" />
            <span className="font-semibold">Projetos Literários</span>
          </div>

          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => handleNavigation("dashboard")}
          >
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Selecione um projeto para ver suas seções
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-64 border-r bg-muted/10", className)}>
      <ScrollArea className="h-full">
        <div className="p-4">
          {/* Header do Projeto */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3
                className="font-semibold text-sm truncate"
                title={currentProject.title}
              >
                {currentProject.title}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation("project-settings")}
              >
                <Settings className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {currentProject.description || "Sem descrição"}
            </p>
          </div>

          <Separator className="mb-4" />

          {/* Navegação Principal */}
          <div className="space-y-1 mb-4">
            <Button
              variant={activeSection === "dashboard" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleNavigation("dashboard")}
            >
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>

            <Button
              variant={activeSection === "overview" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleNavigation("overview")}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Visão Geral
            </Button>
          </div>

          <Separator className="mb-4" />

          {/* Capítulos */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Capítulos
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation("create-chapter")}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <div className="space-y-1">
              {projectChapters.length === 0 ? (
                <div className="text-xs text-muted-foreground px-2 py-1">
                  Nenhum capítulo criado
                </div>
              ) : (
                projectChapters.map((chapter) => {
                  const scenes = getChapterScenes(chapter.id);
                  const isExpanded = expandedChapters.has(chapter.id);

                  return (
                    <div key={chapter.id}>
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 justify-start px-2 h-8"
                          onClick={() =>
                            handleNavigation("chapter", chapter.id)
                          }
                        >
                          <span className="truncate text-xs">
                            {chapter.title}
                          </span>
                        </Button>

                        {scenes.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => toggleChapter(chapter.id)}
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronRight className="h-3 w-3" />
                            )}
                          </Button>
                        )}
                      </div>

                      {isExpanded && scenes.length > 0 && (
                        <div className="ml-4 space-y-1">
                          {scenes.map((scene) => (
                            <Button
                              key={scene.id}
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start px-2 h-7 text-xs"
                              onClick={() =>
                                handleNavigation("scene", scene.id)
                              }
                            >
                              <FileText className="mr-1 h-3 w-3" />
                              <span className="truncate">{scene.title}</span>
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <Separator className="mb-4" />

          {/* Personagens */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Personagens
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation("create-character")}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <div className="space-y-1">
              {projectCharacters.length === 0 ? (
                <div className="text-xs text-muted-foreground px-2 py-1">
                  Nenhum personagem criado
                </div>
              ) : (
                projectCharacters.slice(0, 5).map((character) => (
                  <Button
                    key={character.id}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start px-2 h-8 text-xs"
                    onClick={() => handleNavigation("character", character.id)}
                  >
                    <Users className="mr-2 h-3 w-3" />
                    <span className="truncate">{character.name}</span>
                  </Button>
                ))
              )}

              {projectCharacters.length > 5 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start px-2 h-8 text-xs"
                  onClick={() => handleNavigation("characters")}
                >
                  Ver todos ({projectCharacters.length})
                </Button>
              )}
            </div>
          </div>

          <Separator className="mb-4" />

          {/* Sinopses */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Sinopses
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation("create-synopsis")}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <div className="space-y-1">
              {projectSynopses.length === 0 ? (
                <div className="text-xs text-muted-foreground px-2 py-1">
                  Nenhuma sinopse criada
                </div>
              ) : (
                projectSynopses.map((synopsis) => (
                  <Button
                    key={synopsis.id}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start px-2 h-8 text-xs"
                    onClick={() => handleNavigation("synopsis", synopsis.id)}
                  >
                    <Edit3 className="mr-2 h-3 w-3" />
                    <span className="truncate">{synopsis.title}</span>
                  </Button>
                ))
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export default ProjectSidebar;
