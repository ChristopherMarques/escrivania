"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Menu, ChevronDown, ChevronRight, Plus, FileText, User, MapPin } from "lucide-react"

interface MobileNavigationProps {
  project: any
  selectedItem: any
  onItemSelect: (item: { type: string; id: string }) => void
  onAddChapter: () => void
  onAddScene: (chapterId: string) => void
  onAddCharacter: () => void
  onAddLocation: () => void
}

export function MobileNavigation({
  project,
  selectedItem,
  onItemSelect,
  onAddChapter,
  onAddScene,
  onAddCharacter,
  onAddLocation,
}: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set())

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters)
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId)
    } else {
      newExpanded.add(chapterId)
    }
    setExpandedChapters(newExpanded)
  }

  const handleItemSelect = (item: { type: string; id: string }) => {
    onItemSelect(item)
    setIsOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="text-left">Navegação</SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="p-4 space-y-4">
            {/* Manuscript Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm text-gray-700">Manuscrito</h3>
                <Button variant="ghost" size="sm" onClick={onAddChapter} className="h-6 w-6 p-0">
                  <Plus className="w-3 h-3" />
                </Button>
              </div>

              <div className="space-y-1">
                {(project?.manuscript || []).map((chapter: any) => (
                  <Collapsible
                    key={chapter.id}
                    open={expandedChapters.has(chapter.id)}
                    onOpenChange={() => toggleChapter(chapter.id)}
                  >
                    <div className="flex items-center space-x-1">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          {expandedChapters.has(chapter.id) ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 justify-start h-8 px-2 text-xs"
                        onClick={() => handleItemSelect({ type: "chapter", id: chapter.id })}
                      >
                        <FileText className="w-3 h-3 mr-2" />
                        {chapter.title}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onAddScene(chapter.id)} className="h-6 w-6 p-0">
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    <CollapsibleContent className="ml-4 space-y-1">
                      {(chapter.scenes || []).map((scene: any) => (
                        <Button
                          key={scene.id}
                          variant="ghost"
                          size="sm"
                          className={`w-full justify-start h-8 px-2 text-xs ${
                            selectedItem?.type === "scene" && selectedItem?.id === scene.id
                              ? "bg-purple-100 text-purple-700"
                              : ""
                          }`}
                          onClick={() => handleItemSelect({ type: "scene", id: scene.id })}
                        >
                          <div className="w-2 h-2 rounded-full bg-gray-300 mr-2" />
                          {scene.title}
                        </Button>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </div>

            {/* Characters Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm text-gray-700">Personagens</h3>
                <Button variant="ghost" size="sm" onClick={onAddCharacter} className="h-6 w-6 p-0">
                  <Plus className="w-3 h-3" />
                </Button>
              </div>

              <div className="space-y-1">
                {(project?.characters || []).map((character: any) => (
                  <Button
                    key={character.id}
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start h-8 px-2 text-xs ${
                      selectedItem?.type === "character" && selectedItem?.id === character.id
                        ? "bg-purple-100 text-purple-700"
                        : ""
                    }`}
                    onClick={() => handleItemSelect({ type: "character", id: character.id })}
                  >
                    <User className="w-3 h-3 mr-2" />
                    {character.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Locations Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm text-gray-700">Locais</h3>
                <Button variant="ghost" size="sm" onClick={onAddLocation} className="h-6 w-6 p-0">
                  <Plus className="w-3 h-3" />
                </Button>
              </div>

              <div className="space-y-1">
                {(project?.locations || []).map((location: any) => (
                  <Button
                    key={location.id}
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start h-8 px-2 text-xs ${
                      selectedItem?.type === "location" && selectedItem?.id === location.id
                        ? "bg-purple-100 text-purple-700"
                        : ""
                    }`}
                    onClick={() => handleItemSelect({ type: "location", id: location.id })}
                  >
                    <MapPin className="w-3 h-3 mr-2" />
                    {location.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
