"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  MapPin,
  Plus,
  User,
} from "lucide-react";
import { memo, useCallback, useMemo } from "react";

import type { Tables } from "@/lib/supabase";

interface NavigationPanelProps {
  project: Tables<"projects"> | undefined;
  chapters: Tables<"chapters">[] | undefined;
  scenes: Tables<"scenes">[] | undefined;
  characters: Tables<"characters">[] | undefined;
  selectedItem: { type: string; id: string } | null;
  onItemSelect: (item: { type: string; id: string }) => void;
  onAddChapter: () => void;
  onAddScene: (chapterId: string) => void;
  onAddCharacter: () => void;
  onAddLocation: () => void;
  expandedChapters: Set<string>;
  onToggleChapter: (chapterId: string) => void;
  className?: string;
}

export const NavigationPanel = memo(function NavigationPanel({
  project,
  chapters = [],
  scenes = [],
  characters = [],
  selectedItem,
  onItemSelect,
  onAddChapter,
  onAddScene,
  onAddCharacter,
  onAddLocation,
  expandedChapters,
  onToggleChapter,
  className,
}: NavigationPanelProps) {
  const isSelected = useCallback(
    (type: string, id: string) => {
      return selectedItem?.type === type && selectedItem?.id === id;
    },
    [selectedItem]
  );

  // Memoize sorted chapters and scenes
  const sortedChapters = useMemo(
    () => chapters.sort((a, b) => a.order_index - b.order_index),
    [chapters]
  );

  const sortedCharacters = useMemo(
    () => characters.sort((a, b) => a.name.localeCompare(b.name)),
    [characters]
  );

  const scenesByChapter = useMemo(() => {
    const sceneMap = new Map<string, Tables<"scenes">[]>();
    scenes.forEach((scene) => {
      const chapterScenes = sceneMap.get(scene.chapter_id) || [];
      chapterScenes.push(scene);
      sceneMap.set(scene.chapter_id, chapterScenes);
    });
    // Sort scenes within each chapter
    sceneMap.forEach((scenes) =>
      scenes.sort((a, b) => a.order_index - b.order_index)
    );
    return sceneMap;
  }, [scenes]);

  return (
    <div
      className={cn(
        "flex flex-col h-full relative overflow-hidden",
        "bg-background border-r border-border shadow-xl",
        className
      )}
    >
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-border bg-background">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1">
              <div className="p-1.5 rounded-lg border border-primary/20">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <h2 className="font-semibold text-primary">Navegação</h2>
            </div>

            {/* Main Add Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 border-primary text-primary hover:bg-primary/10 hover:border-primary/70 transition-all duration-200 shadow-sm hover:shadow-md rounded-md"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs font-medium text-gray-500">
                  Adicionar novo
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onAddChapter}
                  className="cursor-pointer"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Novo Capítulo
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onAddCharacter}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  Novo Personagem
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onAddLocation}
                  className="cursor-pointer"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Novo Local
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* Manuscript Section */}
            <div>
              <div className="flex items-center mb-3 p-2 rounded-lg bg-background">
                <Book className="h-4 w-4 mr-2 text-primary" />
                <h3 className="text-md font-semibold text-primary">
                  Manuscrito
                </h3>
              </div>

              <div className="space-y-1">
                {sortedChapters.map((chapter) => {
                  const chapterScenes = scenesByChapter.get(chapter.id) || [];

                  return (
                    <Collapsible
                      key={chapter.id}
                      open={expandedChapters.has(chapter.id)}
                      onOpenChange={() => onToggleChapter(chapter.id)}
                    >
                      <div className="flex items-center group">
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 border border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/40 transition-all duration-200"
                          >
                            {expandedChapters.has(chapter.id) ? (
                              <ChevronDown className="h-3 w-3 text-primary" />
                            ) : (
                              <ChevronRight className="h-3 w-3 text-primary" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "flex-1 justify-start px-2 h-8 text-sm transition-all duration-200",
                            isSelected("chapter", chapter.id)
                              ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                              : "hover:bg-primary/5 border border-transparent hover:border-primary/20"
                          )}
                          onClick={() =>
                            onItemSelect({ type: "chapter", id: chapter.id })
                          }
                        >
                          {expandedChapters.has(chapter.id) ? (
                            <FolderOpen className="mr-2 h-3 w-3 text-primary" />
                          ) : (
                            <Folder className="mr-2 h-3 w-3 text-primary" />
                          )}
                          <span className="truncate">{chapter.title}</span>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 border border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/40 transition-all duration-200 opacity-0 group-hover:opacity-100"
                            >
                              <Plus className="h-3 w-3 text-primary" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                              onClick={() => onAddScene(chapter.id)}
                              className="cursor-pointer"
                            >
                              <FileText className="mr-2 h-3 w-3" />
                              Nova Cena
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <CollapsibleContent className="ml-6 space-y-1">
                        {chapterScenes.map((scene) => (
                          <Button
                            key={scene.id}
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "w-full justify-start h-8 px-2 text-sm transition-all duration-200",
                              isSelected("scene", scene.id)
                                ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                                : "hover:bg-primary/5 border border-transparent hover:border-primary/20"
                            )}
                            onClick={() =>
                              onItemSelect({ type: "scene", id: scene.id })
                            }
                          >
                            <File className="mr-2 h-3 w-3 text-primary" />
                            <span className="truncate">{scene.title}</span>
                          </Button>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </div>
            </div>

            {/* Characters Section */}
            <div>
              <div className="flex items-center mb-3 p-2 rounded-lg bg-background">
                <User className="h-4 w-4 mr-2 text-primary" />
                <h3 className="text-md font-semibold text-primary">
                  Personagens
                </h3>
              </div>

              <div className="space-y-1">
                {sortedCharacters.map((character) => (
                  <Button
                    key={character.id}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full justify-start h-8 px-2 text-sm transition-all duration-200",
                      isSelected("character", character.id)
                        ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                        : "hover:bg-primary/5 border border-transparent hover:border-primary/20"
                    )}
                    onClick={() =>
                      onItemSelect({ type: "character", id: character.id })
                    }
                  >
                    <User className="h-3 w-3 mr-2 text-primary" />
                    <span className="truncate">{character.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Locations Section */}
            <div>
              <div className="flex items-center justify-between mb-3 p-2 rounded-lg bg-background">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  <h3 className="text-md font-semibold text-primary">Locais</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onAddLocation}
                  className="h-6 w-6 p-0 border border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/40 transition-all duration-200"
                >
                  <Plus className="h-3 w-3 text-primary" />
                </Button>
              </div>

              <div className="space-y-1">
                {/* Locations will be implemented later */}
                <div className="text-sm text-gray-500 italic px-2">
                  Em breve...
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
});
