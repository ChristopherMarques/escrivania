"use client";

import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { FocusModeOverlay } from "@/components/focus-mode/focus-mode-overlay";
import { MetadataPanel } from "@/components/metadata/metadata-panel";
import { MobileBottomBar } from "@/components/mobile/mobile-bottom-bar";
import { MobileNavigation } from "@/components/mobile/mobile-navigation";
import { NavigationPanel } from "@/components/navigation/navigation-panel";
import { CharacterSheet } from "@/components/sheets/character-sheet";
import { LocationSheet } from "@/components/sheets/location-sheet";
import { SplitScreenManager } from "@/components/split-screen/split-screen-manager";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FilterTags,
  POVBadge,
  StatusBadge,
  TagBadges,
} from "@/components/ui/interactive-badges";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useDeviceInfo } from "@/hooks/use-mobile";
import {
  IntegratedProjectProvider,
  useIntegratedProject,
} from "@/lib/contexts/integrated-project-context";
import { useSettings } from "@/lib/contexts/settings-context";
import type { ViewMode } from "@/lib/types";
import {
  BookOpen,
  FileText,
  Filter,
  Maximize,
  SplitSquareHorizontal,
  Tag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useState } from "react";

// Interface para o conteúdo estruturado das cenas
interface SceneContent {
  status?: "idea" | "draft" | "revised" | "final";
  tags?: string[];
  povCharacterId?: string;
  [key: string]: any;
}

// Helper para fazer parse seguro do conteúdo da cena
function parseSceneContent(content: string | null): SceneContent {
  if (!content) return {};
  try {
    return typeof content === "string" ? JSON.parse(content) : content;
  } catch {
    return {};
  }
}

function ProjectEditorContent() {
  const router = useRouter();
  const { settings, toggleFocusMode } = useSettings();
  const {
    state,
    project,
    chapters,
    scenes,
    characters,
    synopses,
    isLoadingProject,
    projectError,
    getCurrentScene,
    getCurrentCharacter,
    setSelectedItem,
    setViewMode,
    toggleChapter,
    createChapter,
    createScene,
    createCharacter,
    updateScene,
    updateCharacter,
  } = useIntegratedProject();
  const deviceInfo = useDeviceInfo();

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAddChapterOpen, setIsAddChapterOpen] = useState(false);
  const [isAddSceneOpen, setIsAddSceneOpen] = useState(false);
  const [isAddCharacterOpen, setIsAddCharacterOpen] = useState(false);
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [newSceneTitle, setNewSceneTitle] = useState("");
  const [newCharacterName, setNewCharacterName] = useState("");
  const [newCharacterRole, setNewCharacterRole] = useState("");
  const [newLocationName, setNewLocationName] = useState("");
  const [selectedChapterForScene, setSelectedChapterForScene] = useState("");
  const [activeTagFilters, setActiveTagFilters] = useState<string[]>([]);
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);
  const [isSplitScreenOpen, setIsSplitScreenOpen] = useState(false);

  const { selectedItem, viewMode } = state;
  const currentScene = getCurrentScene();
  const currentCharacter = getCurrentCharacter();

  // Verificar se é um erro de projeto não encontrado
  const isProjectNotFound = projectError?.message === "PROJECT_NOT_FOUND";

  // Verificar se há outros tipos de erro (excluindo USER_NOT_LOADED)
  const hasOtherError =
    projectError &&
    !isProjectNotFound &&
    projectError?.message !== "USER_NOT_LOADED";

  // Estado de carregamento: aguardando usuário ou projeto
  const loading =
    isLoadingProject || projectError?.message === "USER_NOT_LOADED";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "idea":
        return "bg-gray-100 text-gray-700";
      case "draft":
        return "bg-yellow-100 text-yellow-700";
      case "revised":
        return "bg-blue-100 text-blue-700";
      case "final":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "idea":
        return "Ideia";
      case "draft":
        return "Rascunho";
      case "revised":
        return "Revisado";
      case "final":
        return "Finalizado";
      default:
        return "Ideia";
    }
  };

  const handleAddChapter = async () => {
    if (!newChapterTitle.trim()) return;
    await createChapter(newChapterTitle);
    setNewChapterTitle("");
    setIsAddChapterOpen(false);
  };

  const handleAddScene = async () => {
    if (!newSceneTitle.trim() || !selectedChapterForScene) return;
    await createScene(selectedChapterForScene, newSceneTitle);
    setNewSceneTitle("");
    setSelectedChapterForScene("");
    setIsAddSceneOpen(false);
  };

  const handleAddCharacter = async () => {
    if (!newCharacterName.trim()) return;
    await createCharacter(
      newCharacterName,
      "",
      newCharacterRole || "Personagem"
    );
    setNewCharacterName("");
    setNewCharacterRole("");
    setIsAddCharacterOpen(false);
  };

  const handleAddLocation = () => {
    if (!newLocationName.trim()) return;
    // TODO: Implement location creation when locations are supported
    setNewLocationName("");
    setIsAddLocationOpen(false);
  };

  const getAllScenes = () => {
    if (!chapters || !scenes) return [];
    return scenes.map((scene) => {
      const chapter = chapters.find((c) => c.id === scene.chapter_id);
      return {
        ...scene,
        chapterTitle: chapter?.title || "Capítulo sem título",
      };
    });
  };

  const getFilteredScenes = () => {
    const allScenes = getAllScenes();
    if (activeTagFilters.length === 0) return allScenes;
    return allScenes.filter((scene) => {
      const content = parseSceneContent(scene.content);
      return activeTagFilters.some((tag) => content.tags?.includes(tag));
    });
  };

  const getAllTags = (): string[] => {
    if (!scenes) return [];
    const tagSet = new Set<string>();
    scenes.forEach((scene) => {
      const content = parseSceneContent(scene.content);
      if (content.tags && Array.isArray(content.tags)) {
        content.tags.forEach((tag: string) => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  };

  const getCharacterById = (id: string) => {
    return characters?.find((char) => char.id === id);
  };

  const getWordCount = (content: any): number => {
    if (typeof content === "string") {
      return content.trim() ? content.trim().split(/\s+/).length : 0;
    }
    return 0;
  };

  const handleTagFilter = (tag: string) => {
    setActiveTagFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-purple-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Carregando projeto...</p>
        </div>
      </div>
    );
  }

  if (isProjectNotFound) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Projeto não encontrado
          </h3>
          <p className="text-gray-500 mb-4">
            O projeto que você está tentando acessar não existe ou foi removido.
          </p>
          <Button onClick={() => router.push("/")} variant="outline">
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (hasOtherError) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Erro ao carregar projeto
          </h3>
          <p className="text-gray-500 mb-4">
            Ocorreu um erro ao tentar carregar o projeto. Tente novamente.
          </p>
          <div className="space-x-2">
            <Button onClick={() => window.location.reload()} variant="outline">
              Tentar Novamente
            </Button>
            <Button onClick={() => router.push("/")} variant="outline">
              Voltar ao Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-purple-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Carregando projeto...</p>
        </div>
      </div>
    );
  }

  const renderCorkboardView = () => {
    const filteredScenes = getFilteredScenes();

    const getGridClasses = () => {
      if (deviceInfo.isMobile) {
        return "grid grid-cols-1 gap-3";
      } else if (deviceInfo.isTablet) {
        return "grid grid-cols-2 gap-4";
      } else if (deviceInfo.isNotebook) {
        return "grid grid-cols-2 lg:grid-cols-3 gap-4";
      } else {
        return "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4";
      }
    };

    return (
      <div
        className={`${
          deviceInfo.isMobile
            ? "p-3 pb-20"
            : deviceInfo.isTablet
            ? "p-4 pb-6"
            : "p-6 pb-4"
        } space-y-4`}
      >
        {/* Filter Controls */}
        <div
          className={`bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg ${
            deviceInfo.isMobile ? "p-3" : "p-4"
          }`}
        >
          <FilterTags
            allTags={getAllTags()}
            activeTags={activeTagFilters}
            onTagToggle={handleTagFilter}
            onClearFilters={() => setActiveTagFilters([])}
          />
        </div>

        <div className={getGridClasses()}>
          {filteredScenes.map((scene) => {
            const content = parseSceneContent(scene.content);
            const povCharacter = content.povCharacterId
              ? getCharacterById(content.povCharacterId)
              : null;

            return (
              <Card
                key={scene.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-white/70 backdrop-blur-sm border-white/30 hover:border-purple-300 touch-manipulation"
                onClick={() => {
                  setSelectedItem({ type: "scene", id: scene.id });
                  setViewMode("writing");
                }}
              >
                <CardHeader className="pb-2 md:pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm font-semibold line-clamp-2">
                      {scene.title}
                    </CardTitle>
                    <StatusBadge
                      status={content.status || "idea"}
                      onStatusChange={(status) =>
                        updateScene(scene.id, {
                          content: { ...content, status },
                        })
                      }
                      className="ml-2 flex-shrink-0"
                    />
                  </div>
                  <CardDescription className="text-xs text-gray-500">
                    {scene.chapterTitle}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 space-y-2 md:space-y-3">
                  <p className="text-sm text-gray-600 line-clamp-2 md:line-clamp-3">
                    {scene.synopsis || "Sem sinopse..."}
                  </p>

                  {povCharacter && (
                    <POVBadge
                      character={{
                        id: povCharacter.id,
                        name: povCharacter.name,
                        role: povCharacter.description || "Personagem",
                        description: povCharacter.description,
                        createdAt: povCharacter.created_at,
                        updatedAt: povCharacter.updated_at,
                      }}
                      allCharacters={
                        characters
                          ? characters.map((char) => ({
                              id: char.id,
                              name: char.name,
                              role: char.description || "Personagem",
                              description: char.description,
                              createdAt: char.created_at,
                              updatedAt: char.updated_at,
                            }))
                          : []
                      }
                      onCharacterChange={(characterId) =>
                        updateScene(scene.id, {
                          content: {
                            ...content,
                            povCharacterId: characterId,
                          },
                        })
                      }
                    />
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{getWordCount(scene.content)} palavras</span>
                    {(content.tags?.length || 0) > 0 && (
                      <div className="flex items-center space-x-1">
                        <Tag className="w-3 h-3" />
                        <span>{content.tags?.length || 0}</span>
                      </div>
                    )}
                  </div>

                  {(content.tags?.length || 0) > 0 && (
                    <TagBadges
                      tags={content.tags || []}
                      onTagsChange={(tags) =>
                        updateScene(scene.id, {
                          content: { ...content, tags },
                        })
                      }
                      onTagFilter={handleTagFilter}
                      allTags={getAllTags()}
                    />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredScenes.length === 0 && activeTagFilters.length > 0 && (
          <div className="text-center py-12 text-gray-500">
            <Filter className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-base md:text-lg font-medium">
              Nenhuma cena encontrada
            </p>
            <p className="text-sm">Tente ajustar os filtros de tags</p>
          </div>
        )}
      </div>
    );
  };

  const renderOutlinerView = () => {
    const filteredScenes = getFilteredScenes();

    return (
      <div className="p-3 md:p-6 space-y-4 pb-20 md:pb-4">
        {/* Filter Controls */}
        <div className="bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg p-3 md:p-4">
          <FilterTags
            allTags={getAllTags()}
            activeTags={activeTagFilters}
            onTagToggle={handleTagFilter}
            onClearFilters={() => setActiveTagFilters([])}
          />
        </div>

        <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-white/50">
                  <TableHead className="font-semibold min-w-[120px]">
                    Título
                  </TableHead>
                  <TableHead className="font-semibold min-w-[100px] hidden sm:table-cell">
                    Capítulo
                  </TableHead>
                  <TableHead className="font-semibold min-w-[150px] hidden md:table-cell">
                    Sinopse
                  </TableHead>
                  <TableHead className="font-semibold min-w-[80px]">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold min-w-[80px] hidden sm:table-cell">
                    POV
                  </TableHead>
                  <TableHead className="font-semibold min-w-[80px]">
                    Palavras
                  </TableHead>
                  <TableHead className="font-semibold min-w-[100px] hidden lg:table-cell">
                    Tags
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredScenes.map((scene) => {
                  const content = parseSceneContent(scene.content);
                  const povCharacter = content.povCharacterId
                    ? getCharacterById(content.povCharacterId)
                    : null;

                  return (
                    <TableRow
                      key={scene.id}
                      className="cursor-pointer hover:bg-purple-50/50 transition-colors touch-manipulation"
                      onClick={() => {
                        setSelectedItem({
                          type: "scene",
                          id: scene.id,
                        });
                        setViewMode("writing");
                      }}
                    >
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-medium">{scene.title}</div>
                          <div className="text-xs text-gray-500 sm:hidden">
                            {scene.chapterTitle}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 hidden sm:table-cell">
                        {scene.chapterTitle}
                      </TableCell>
                      <TableCell className="max-w-xs hidden md:table-cell">
                        <p className="line-clamp-2 text-sm text-gray-600">
                          {scene.synopsis || "Sem sinopse..."}
                        </p>
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={content.status || "idea"}
                          onStatusChange={(status) =>
                            updateScene(scene.id, {
                              content: { ...content, status },
                            })
                          }
                        />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <POVBadge
                          character={{
                            id: povCharacter.id,
                            name: povCharacter.name,
                            role: povCharacter.description || "Personagem",
                            description: povCharacter.description,
                            createdAt: povCharacter.created_at,
                            updatedAt: povCharacter.updated_at,
                          }}
                          allCharacters={
                            characters
                              ? characters.map((char) => ({
                                  id: char.id,
                                  name: char.name,
                                  role: char.description || "Personagem",
                                  description: char.description,
                                  createdAt: char.created_at,
                                  updatedAt: char.updated_at,
                                }))
                              : []
                          }
                          onCharacterChange={(characterId) =>
                            updateScene(scene.id, {
                              content: {
                                ...content,
                                povCharacterId: characterId,
                              },
                            })
                          }
                        />
                      </TableCell>
                      <TableCell className="text-gray-600 text-sm">
                        {getWordCount(scene.content)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <TagBadges
                          tags={content.tags || []}
                          onTagsChange={(tags) =>
                            updateScene(scene.id, {
                              content: { ...content, tags },
                            })
                          }
                          onTagFilter={handleTagFilter}
                          allTags={getAllTags()}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        {filteredScenes.length === 0 && activeTagFilters.length > 0 && (
          <div className="text-center py-12 text-gray-500">
            <Filter className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-base md:text-lg font-medium">
              Nenhuma cena encontrada
            </p>
            <p className="text-sm">Tente ajustar os filtros de tags</p>
          </div>
        )}
      </div>
    );
  };

  if (selectedItem?.type === "character" && currentCharacter) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex flex-col">
        <header className="border-b border-white/20 bg-white/60 backdrop-blur-xl flex-shrink-0">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (scenes && scenes.length > 0) {
                      setSelectedItem({
                        type: "scene",
                        id: scenes[0].id,
                      });
                    }
                  }}
                >
                  ← Voltar para Escrita
                </Button>
                <h1 className="text-xl font-semibold text-gray-800">
                  Personagem: {currentCharacter.name}
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Character Sheet Component */}
        <div className="flex-1 overflow-hidden">
          <CharacterSheet
            character={{
              id: currentCharacter.id,
              name: currentCharacter.name,
              role: currentCharacter.description || "Personagem",
              description: currentCharacter.description,
              createdAt: currentCharacter.created_at,
              updatedAt: currentCharacter.updated_at,
            }}
            allCharacters={
              characters
                ? characters.map((char) => ({
                    id: char.id,
                    name: char.name,
                    role: char.description || "Personagem",
                    description: char.description,
                    createdAt: char.created_at,
                    updatedAt: char.updated_at,
                  }))
                : []
            }
            onUpdate={(updatedCharacter) =>
              updateCharacter(updatedCharacter.id, {
                name: updatedCharacter.name,
                description: updatedCharacter.description,
              })
            }
            onDelete={(characterId) => deleteCharacter(characterId)}
          />
        </div>
      </div>
    );
  }

  const currentLocation =
    selectedItem?.type === "location"
      ? { id: selectedItem.id, name: "Local", description: "" }
      : null;

  if (selectedItem?.type === "location" && currentLocation) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex flex-col">
        <header className="border-b border-white/20 bg-white/60 backdrop-blur-xl flex-shrink-0">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (scenes && scenes.length > 0) {
                      setSelectedItem({
                        type: "scene",
                        id: scenes[0].id,
                      });
                    }
                  }}
                >
                  ← Voltar para Escrita
                </Button>
                <h1 className="text-xl font-semibold text-gray-800">
                  Local: {currentLocation.name}
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Location Sheet Component */}
        <div className="flex-1 overflow-hidden">
          <LocationSheet
            location={currentLocation}
            onUpdate={(updatedLocation) => {
              // TODO: Implement location update when locations are supported
            }}
            onDelete={(locationId) => {
              // TODO: Implement location deletion when locations are supported
            }}
          />
        </div>
      </div>
    );
  }

  // Main writing interface with view modes
  return (
    <>
      {/* Focus Mode Overlay */}
      <FocusModeOverlay
        isOpen={isFocusModeOpen}
        onClose={() => setIsFocusModeOpen(false)}
        content={currentScene?.content}
        onChange={(content) =>
          currentScene && updateScene(currentScene.id, { content })
        }
        characters={
          characters
            ? characters.map((char) => ({
                id: char.id,
                name: char.name,
                role: char.description || "Personagem",
                description: char.description,
                createdAt: char.created_at,
                updatedAt: char.updated_at,
              }))
            : []
        }
        locations={[]} // TODO: Implement locations when supported
      />

      {/* Split Screen Manager */}
      <SplitScreenManager
        isOpen={isSplitScreenOpen}
        onClose={() => setIsSplitScreenOpen(false)}
        project={project}
        currentScene={currentScene}
        onSceneUpdate={(content) =>
          currentScene && updateScene(currentScene.id, { content })
        }
      />

      <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex flex-col">
        {/* Header with view mode toggle */}
        <header className="border-b border-white/20 bg-white/60 backdrop-blur-xl flex-shrink-0">
          <div
            className={`${
              deviceInfo.isMobile
                ? "px-3 py-3"
                : deviceInfo.isTablet
                ? "px-4 py-3"
                : "px-6 py-4"
            }`}
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex items-center ${
                  deviceInfo.isMobile ? "space-x-2" : "space-x-4"
                }`}
              >
                <MobileNavigation
                  project={project}
                  chapters={chapters}
                  scenes={scenes}
                  characters={characters}
                  selectedItem={selectedItem}
                  onItemSelect={onItemSelect}
                  onAddChapter={handleAddChapter}
                  onAddScene={handleAddScene}
                  onAddCharacter={handleAddCharacter}
                  onAddLocation={() => {}}
                  expandedChapters={expandedChapters}
                  onToggleChapter={toggleChapter}
                />

                <Button
                  variant="ghost"
                  size={deviceInfo.isMobile ? "sm" : "default"}
                  onClick={() => router.push("/")}
                >
                  ← {deviceInfo.isMobile ? "" : "Dashboard"}
                </Button>
                <h1
                  className={`${
                    deviceInfo.isMobile
                      ? "text-base"
                      : deviceInfo.isTablet
                      ? "text-lg"
                      : "text-xl"
                  } font-semibold text-gray-800 truncate`}
                >
                  {deviceInfo.isMobile &&
                  project?.title &&
                  project.title.length > 15
                    ? `${project.title.substring(0, 15)}...`
                    : project?.title}
                </h1>
              </div>

              {!deviceInfo.isMobile && !deviceInfo.isTablet && (
                <div className="flex items-center space-x-4">
                  {viewMode === "writing" && currentScene && (
                    <>
                      <Button
                        variant="outline"
                        size={deviceInfo.isNotebook ? "sm" : "default"}
                        onClick={() => setIsFocusModeOpen(true)}
                        className="bg-white/50 backdrop-blur-sm border-white/30"
                      >
                        <Maximize className="w-4 h-4 mr-2" />
                        {deviceInfo.isNotebook ? "Foco" : "Modo Foco"}
                      </Button>
                      <Button
                        variant="outline"
                        size={deviceInfo.isNotebook ? "sm" : "default"}
                        onClick={() => setIsSplitScreenOpen(true)}
                        className="bg-white/50 backdrop-blur-sm border-white/30"
                      >
                        <SplitSquareHorizontal className="w-4 h-4 mr-2" />
                        {deviceInfo.isNotebook ? "Dividir" : "Tela Dividida"}
                      </Button>
                    </>
                  )}

                  <ToggleGroup
                    type="single"
                    value={viewMode}
                    onValueChange={(value) =>
                      value && setViewMode(value as ViewMode)
                    }
                    className="bg-white/50 backdrop-blur-sm border border-white/30"
                  >
                    <ToggleGroupItem
                      value="writing"
                      className="data-[state=on]:bg-purple-100"
                    >
                      📝 {deviceInfo.isNotebook ? "Escrita" : "Escrita"}
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="corkboard"
                      className="data-[state=on]:bg-purple-100"
                    >
                      📇 {deviceInfo.isNotebook ? "Cortiça" : "Cortiça"}
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="outliner"
                      className="data-[state=on]:bg-purple-100"
                    >
                      📊 {deviceInfo.isNotebook ? "Estrutura" : "Estrutura"}
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Conditional Rendering based on view mode */}
        {viewMode === "corkboard" && renderCorkboardView()}
        {viewMode === "outliner" && renderOutlinerView()}

        {viewMode === "writing" && (
          <div className="flex-1 flex overflow-hidden">
            {/* Left Panel - Navigation (hidden on mobile/tablet) */}
            {!deviceInfo.isMobile && !deviceInfo.isTablet && (
              <NavigationPanel
                project={project}
                chapters={chapters}
                scenes={scenes}
                characters={characters}
                selectedItem={selectedItem}
                onItemSelect={onItemSelect}
                onAddChapter={handleAddChapter}
                onAddScene={handleAddScene}
                onAddCharacter={handleAddCharacter}
                onAddLocation={() => setIsAddLocationOpen(true)}
                expandedChapters={state.expandedChapters}
                onToggleChapter={toggleChapter}
                className={`${deviceInfo.isNotebook ? "w-64" : "w-80"}`}
              />
            )}

            {/* Center Panel - Editor */}
            <div className="flex-1 flex flex-col">
              <div
                className={`flex-1 ${
                  deviceInfo.isMobile
                    ? "p-3 pb-20"
                    : deviceInfo.isTablet
                    ? "p-4 pb-6"
                    : "p-6 pb-6"
                }`}
              >
                {currentScene ? (
                  <TiptapEditor
                    content={currentScene.content}
                    onChange={(content) =>
                      updateScene(currentScene.id, { content })
                    }
                    characters={characters || []}
                    locations={[]}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <FileText
                        className={`${
                          deviceInfo.isMobile ? "w-12 h-12" : "w-16 h-16"
                        } mx-auto mb-4 text-gray-300`}
                      />
                      <p
                        className={`${
                          deviceInfo.isMobile ? "text-sm" : "text-base"
                        }`}
                      >
                        Selecione uma cena para começar a escrever
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Metadata (hidden on mobile/tablet/notebook) */}
            {deviceInfo.isMacbook || deviceInfo.isDesktop ? (
              <MetadataPanel
                project={project}
                chapters={chapters}
                scenes={scenes}
                characters={characters}
                selectedItem={selectedItem}
                onUpdateItem={async (type, id, data) => {
                  // Handle metadata updates based on type
                  if (type === "chapter") {
                    await updateChapter(id, data);
                  } else if (type === "scene") {
                    await updateScene(id, data);
                  } else if (type === "character") {
                    await updateCharacter(id, data);
                  }
                  // Locations will be implemented later
                }}
                className={`${deviceInfo.isMacbook ? "w-64" : "w-80"}`}
              />
            ) : null}
          </div>
        )}

        <MobileBottomBar
          viewMode={viewMode}
          onViewModeChange={(mode) => setViewMode(mode as ViewMode)}
          onFocusMode={() => setIsFocusModeOpen(true)}
          onSplitScreen={() => setIsSplitScreenOpen(true)}
          showWritingActions={viewMode === "writing" && !!currentScene}
        />
      </div>
    </>
  );
}

export default function ProjectEditor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);

  return (
    <IntegratedProjectProvider projectId={resolvedParams.id}>
      <ProjectEditorContent />
    </IntegratedProjectProvider>
  );
}
