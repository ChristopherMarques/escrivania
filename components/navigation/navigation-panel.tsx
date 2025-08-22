"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, Plus, FileText, User, MapPin, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

import type { Tables } from "@/lib/supabase"

interface NavigationPanelProps {
  project: Tables<'projects'> | undefined
  chapters: Tables<'chapters'>[] | undefined
  scenes: Tables<'scenes'>[] | undefined
  characters: Tables<'characters'>[] | undefined
  selectedItem: { type: string; id: string } | null
  onItemSelect: (item: { type: string; id: string }) => void
  onAddChapter: () => void
  onAddScene: (chapterId: string) => void
  onAddCharacter: () => void
  onAddLocation: () => void
  expandedChapters: Set<string>
  onToggleChapter: (chapterId: string) => void
  className?: string
}

export function NavigationPanel({
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

  const isSelected = (type: string, id: string) => {
    return selectedItem?.type === type && selectedItem?.id === id
  }

  return (
    <div className={cn("flex flex-col h-full bg-white/40 backdrop-blur-sm border-r border-white/20", className)}>
      {/* Header */}
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-escrivania-purple-600" />
          <h2 className="font-semibold text-foreground">Navegação</h2>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Manuscript Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Manuscrito</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onAddChapter}
                className="h-6 w-6 p-0 hover:bg-escrivania-purple-100"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <div className="space-y-1">
              {chapters.map((chapter) => {
                const chapterScenes = scenes.filter(scene => scene.chapter_id === chapter.id)
                  .sort((a, b) => a.order_index - b.order_index)
                
                return (
                  <Collapsible
                    key={chapter.id}
                    open={expandedChapters.has(chapter.id)}
                    onOpenChange={() => onToggleChapter(chapter.id)}
                  >
                    <div className="flex items-center">
                      <CollapsibleTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-escrivania-purple-100"
                        >
                          {expandedChapters.has(chapter.id) ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "flex-1 justify-start px-2 h-8 text-sm",
                          isSelected("chapter", chapter.id) 
                            ? "bg-escrivania-purple-100 text-escrivania-purple-700" 
                            : "hover:bg-escrivania-purple-50"
                        )}
                        onClick={() => onItemSelect({ type: "chapter", id: chapter.id })}
                      >
                        <FileText className="mr-2 h-3 w-3" />
                        <span className="truncate">{chapter.title}</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onAddScene(chapter.id)}
                        className="h-6 w-6 p-0 hover:bg-escrivania-purple-100"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <CollapsibleContent className="ml-6 space-y-1">
                      {chapterScenes.map((scene) => (
                        <Button
                          key={scene.id}
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "w-full justify-start h-8 px-2 text-sm",
                            isSelected("scene", scene.id)
                              ? "bg-escrivania-purple-100 text-escrivania-purple-700"
                              : "hover:bg-escrivania-purple-50"
                          )}
                          onClick={() => onItemSelect({ type: "scene", id: scene.id })}
                        >
                          <div className="w-2 h-2 rounded-full bg-gray-400 mr-2" />
                          <span className="truncate">{scene.title}</span>
                        </Button>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                )
              })}
            </div>
          </div>

          {/* Characters Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Personagens</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onAddCharacter}
                className="h-6 w-6 p-0 hover:bg-escrivania-blue-100"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <div className="space-y-1">
              {characters.map((character) => (
                <Button
                  key={character.id}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start h-8 px-2 text-sm",
                    isSelected("character", character.id)
                      ? "bg-escrivania-blue-100 text-escrivania-blue-700"
                      : "hover:bg-escrivania-blue-50"
                  )}
                  onClick={() => onItemSelect({ type: "character", id: character.id })}
                >
                  <User className="h-3 w-3 mr-2" />
                  <span className="truncate">{character.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Locations Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Locais</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onAddLocation}
                className="h-6 w-6 p-0 hover:bg-green-100"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <div className="space-y-1">
              {/* Locations will be implemented later */}
              <div className="text-sm text-gray-500 italic px-2">Nenhum local cadastrado</div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}