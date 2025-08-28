"use client";

import { CharacterCreationModal } from "@/components/modals/character-creation-modal";
import { LocationCreationModal } from "@/components/modals/location-creation-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useProject } from "@/contexts/ProjectContext";
import { useIntegratedProject } from "@/lib/contexts/integrated-project-context";
import { cn } from "@/lib/utils";
import {
  Book,
  BookOpen,
  ChevronDown,
  ChevronRight,
  File,
  FileText,
  Folder,
  FolderOpen,
  Home,
  MapPin,
  Plus,
  Settings,
  User,
} from "lucide-react";
import { useState } from "react";

interface ProjectSidebarProps {
  className?: string;
  onNavigate?: (section: string, id?: string) => void;
}

export function ProjectSidebar({ className, onNavigate }: ProjectSidebarProps) {
  const { state, setCurrentProject } = useProject();
  const { locations } = useIntegratedProject();
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set()
  );
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const currentProject = state.currentProject;
  const projectChapters = currentProject
    ? state.chapters.filter((c) => c.project_id === currentProject.id)
    : [];
  const projectCharacters = currentProject
    ? state.characters.filter((c) => c.project_id === currentProject.id)
    : [];
  const projectLocations = currentProject
    ? locations.filter((l) => l.projectId === currentProject.id)
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
              <div className="flex items-center gap-1">
                {/* Quick Add Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-accent"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuLabel className="text-xs">
                      Adicionar novo
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleNavigation("create-chapter")}
                      className="cursor-pointer"
                    >
                      <FileText className="mr-2 h-3 w-3" />
                      Capítulo
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setIsCharacterModalOpen(true)}
                      className="cursor-pointer"
                    >
                      <User className="mr-2 h-3 w-3 text-blue-500" />
                      Personagem
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setIsLocationModalOpen(true)}
                      className="cursor-pointer"
                    >
                      <MapPin className="mr-2 h-3 w-3 text-purple-500" />
                      Local
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleNavigation("create-synopsis")}
                      className="cursor-pointer"
                    >
                      <FileText className="mr-2 h-3 w-3 text-green-500" />
                      Sinopse
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => handleNavigation("project-settings")}
                >
                  <Settings className="h-3 w-3" />
                </Button>
              </div>
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
            <div className="flex items-center mb-2">
              <Book className="h-3 w-3 mr-1 text-muted-foreground" />
              <h4 className="text-sm font-medium text-muted-foreground">
                Capítulos
              </h4>
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
                          {isExpanded ? (
                            <FolderOpen className="mr-1 h-3 w-3 text-blue-600" />
                          ) : (
                            <Folder className="mr-1 h-3 w-3 text-blue-600" />
                          )}
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
                              <File className="mr-1 h-3 w-3 text-blue-500" />
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
            <div className="flex items-center mb-2">
              <User className="h-3 w-3 mr-1 text-muted-foreground" />
              <h4 className="text-sm font-medium text-muted-foreground">
                Personagens
              </h4>
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
                    <User className="mr-2 h-3 w-3 text-blue-500" />
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

          {/* Locais */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
              <h4 className="text-sm font-medium text-muted-foreground">
                Locais
              </h4>
            </div>

            <div className="space-y-1">
              {projectLocations.length === 0 ? (
                <div className="text-xs text-muted-foreground px-2 py-1">
                  Nenhum local criado
                </div>
              ) : (
                projectLocations.slice(0, 5).map((location) => (
                  <Button
                    key={location.id}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start px-2 h-8 text-xs"
                    onClick={() => handleNavigation("location", location.id)}
                  >
                    <MapPin className="mr-2 h-3 w-3 text-purple-500" />
                    <span className="truncate">{location.name}</span>
                  </Button>
                ))
              )}

              {projectLocations.length > 5 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start px-2 h-8 text-xs"
                  onClick={() => handleNavigation("locations")}
                >
                  Ver todos ({projectLocations.length})
                </Button>
              )}
            </div>
          </div>

          <Separator className="mb-4" />

          {/* Sinopses */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <FileText className="h-3 w-3 mr-1 text-muted-foreground" />
              <h4 className="text-sm font-medium text-muted-foreground">
                Sinopses
              </h4>
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
                    <FileText className="mr-2 h-3 w-3 text-green-500" />
                    <span className="truncate">{synopsis.title}</span>
                  </Button>
                ))
              )}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Modais de Criação */}
      <CharacterCreationModal
        isOpen={isCharacterModalOpen}
        onClose={() => setIsCharacterModalOpen(false)}
        onSuccess={(character) => {
          // Opcional: navegar para o personagem criado
          handleNavigation("character", character.id);
        }}
      />

      <LocationCreationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSuccess={(location) => {
          // Opcional: navegar para o local criado
          handleNavigation("location", location.id);
        }}
      />
    </div>
  );
}

export default ProjectSidebar;
