"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Menu, ChevronDown, ChevronRight, Plus, FileText, User, MapPin } from "lucide-react"
import { useDeviceInfo } from "@/hooks/use-mobile"

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
  const deviceInfo = useDeviceInfo()

  // Determine sheet width based on device type
  const getSheetWidth = () => {
    if (deviceInfo.isMobile) return "w-[85vw] max-w-[320px]"
    if (deviceInfo.isTablet) return "w-[60vw] max-w-[400px]"
    return "w-[50vw] max-w-[480px]"
  }

  // Determine if navigation should be visible
  const shouldShowNavigation = deviceInfo.isMobile || deviceInfo.isTablet

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
        <Button 
          variant="ghost" 
          size={deviceInfo.isMobile ? "sm" : "default"} 
          className={shouldShowNavigation ? "block" : "hidden notebook:hidden"}
        >
          <Menu className={deviceInfo.isMobile ? "w-4 h-4" : "w-5 h-5"} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className={`${getSheetWidth()} p-0`}>
        <SheetHeader className={`${deviceInfo.isMobile ? 'p-3' : 'p-4'} border-b`}>
          <SheetTitle className={`text-left ${deviceInfo.isMobile ? 'text-sm' : 'text-base'}`}>
            Navegação
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className={`h-[calc(100vh-${deviceInfo.isMobile ? '70px' : '80px'})]`}>
          <div className={`${deviceInfo.isMobile ? 'p-3 space-y-3' : 'p-4 space-y-4'}`}>
            {/* Manuscript Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className={`font-semibold text-gray-700 ${
                  deviceInfo.isMobile ? 'text-xs' : 'text-sm'
                }`}>
                  Manuscrito
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onAddChapter} 
                  className={deviceInfo.isMobile ? "h-5 w-5 p-0" : "h-6 w-6 p-0"}
                >
                  <Plus className={deviceInfo.isMobile ? "w-2.5 h-2.5" : "w-3 h-3"} />
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
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={deviceInfo.isMobile ? "h-7 w-7 p-0" : "h-8 w-8 p-0"}
                        >
                          {expandedChapters.has(chapter.id) ? (
                            <ChevronDown className={deviceInfo.isMobile ? "w-2.5 h-2.5" : "w-3 h-3"} />
                          ) : (
                            <ChevronRight className={deviceInfo.isMobile ? "w-2.5 h-2.5" : "w-3 h-3"} />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`flex-1 justify-start px-2 ${
                          deviceInfo.isMobile ? 'h-7 text-xs' : 'h-8 text-xs'
                        }`}
                        onClick={() => handleItemSelect({ type: "chapter", id: chapter.id })}
                      >
                        <FileText className={`mr-2 ${
                          deviceInfo.isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'
                        }`} />
                        <span className="truncate">{chapter.title}</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onAddScene(chapter.id)} 
                        className={deviceInfo.isMobile ? "h-5 w-5 p-0" : "h-6 w-6 p-0"}
                      >
                        <Plus className={deviceInfo.isMobile ? "w-2.5 h-2.5" : "w-3 h-3"} />
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
