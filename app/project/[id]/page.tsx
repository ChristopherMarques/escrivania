"use client"

import { useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge, POVBadge, TagBadges, FilterTags } from "@/components/ui/interactive-badges"
import { BookOpen, FileText, Tag, Filter, Maximize, SplitSquareHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"
import { useProject } from "@/lib/hooks/use-project"
import { useProjects } from "@/lib/contexts/projects-context"
import { useSettings } from "@/lib/contexts/settings-context"
import { useState } from "react"
import type { IScene } from "@/lib/types"
import { CharacterSheet } from "@/components/sheets/character-sheet"
import { LocationSheet } from "@/components/sheets/location-sheet"
import { TiptapEditor } from "@/components/editor/tiptap-editor"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { FocusModeOverlay } from "@/components/focus-mode/focus-mode-overlay"
import { SplitScreenManager } from "@/components/split-screen/split-screen-manager"
import { MobileNavigation } from "@/components/mobile/mobile-navigation"
import { MobileBottomBar } from "@/components/mobile/mobile-bottom-bar"
import { useDeviceInfo } from "@/hooks/use-mobile"

export default function ProjectEditor({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { getProject } = useProjects()
  const { settings, toggleFocusMode } = useSettings()
  const { project, selectedItem, viewMode, loading, currentScene, currentCharacter, currentLocation, actions } =
    useProject()
  const deviceInfo = useDeviceInfo()

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [isAddChapterOpen, setIsAddChapterOpen] = useState(false)
  const [isAddSceneOpen, setIsAddSceneOpen] = useState(false)
  const [isAddCharacterOpen, setIsAddCharacterOpen] = useState(false)
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false)
  const [newChapterTitle, setNewChapterTitle] = useState("")
  const [newSceneTitle, setNewSceneTitle] = useState("")
  const [newCharacterName, setNewCharacterName] = useState("")
  const [newCharacterRole, setNewCharacterRole] = useState("")
  const [newLocationName, setNewLocationName] = useState("")
  const [selectedChapterForScene, setSelectedChapterForScene] = useState("")
  const [activeTagFilters, setActiveTagFilters] = useState<string[]>([])
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false)
  const [isSplitScreenOpen, setIsSplitScreenOpen] = useState(false)

  const projectSummary = getProject(resolvedParams.id)

  useEffect(() => {
    actions.loadProject(resolvedParams.id)
  }, [resolvedParams.id])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "idea":
        return "bg-gray-100 text-gray-700"
      case "draft":
        return "bg-yellow-100 text-yellow-700"
      case "revised":
        return "bg-blue-100 text-blue-700"
      case "final":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "idea":
        return "Ideia"
      case "draft":
        return "Rascunho"
      case "revised":
        return "Revisado"
      case "final":
        return "Finalizado"
      default:
        return "Ideia"
    }
  }

  const handleAddChapter = () => {
    if (!newChapterTitle.trim()) return
    actions.addChapter(newChapterTitle)
    setNewChapterTitle("")
    setIsAddChapterOpen(false)
  }

  const handleAddScene = () => {
    if (!newSceneTitle.trim() || !selectedChapterForScene) return
    actions.addScene(selectedChapterForScene, newSceneTitle)
    setNewSceneTitle("")
    setSelectedChapterForScene("")
    setIsAddSceneOpen(false)
  }

  const handleAddCharacter = () => {
    if (!newCharacterName.trim()) return
    actions.addCharacter({
      name: newCharacterName,
      role: newCharacterRole || "Personagem",
      description: "",
    })
    setNewCharacterName("")
    setNewCharacterRole("")
    setIsAddCharacterOpen(false)
  }

  const handleAddLocation = () => {
    if (!newLocationName.trim()) return
    actions.addLocation({
      name: newLocationName,
      description: "",
    })
    setNewLocationName("")
    setIsAddLocationOpen(false)
  }

  const getAllScenes = (): (IScene & { chapterTitle: string })[] => {
    if (!project || !project.manuscript) return []
    return project.manuscript.flatMap((chapter) =>
      chapter.scenes.map((scene) => ({
        ...scene,
        chapterTitle: chapter.title,
      })),
    )
  }

  const getFilteredScenes = () => {
    const allScenes = getAllScenes()
    if (activeTagFilters.length === 0) return allScenes
    return allScenes.filter((scene) => activeTagFilters.some((tag) => scene.tags.includes(tag)))
  }

  const getAllTags = (): string[] => {
    if (!project || !project.manuscript) return []
    const tagSet = new Set<string>()
    project.manuscript.forEach((chapter) => {
      chapter.scenes.forEach((scene) => {
        scene.tags.forEach((tag) => tagSet.add(tag))
      })
    })
    return Array.from(tagSet).sort()
  }

  const getCharacterById = (id: string) => {
    return project?.characters.find((char) => char.id === id)
  }

  const getWordCount = (content: any): number => {
    if (typeof content === "string") {
      return content.trim() ? content.trim().split(/\s+/).length : 0
    }
    return 0
  }

  const handleTagFilter = (tag: string) => {
    setActiveTagFilters((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-purple-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Carregando projeto...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Projeto não encontrado</h3>
          <Button onClick={() => router.push("/")} variant="outline">
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const renderCorkboardView = () => {
    const filteredScenes = getFilteredScenes()

    const getGridClasses = () => {
      if (deviceInfo.isMobile) {
        return "grid grid-cols-1 gap-3"
      } else if (deviceInfo.isTablet) {
        return "grid grid-cols-2 gap-4"
      } else if (deviceInfo.isNotebook) {
        return "grid grid-cols-2 lg:grid-cols-3 gap-4"
      } else {
        return "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      }
    }

    return (
      <div className={`${deviceInfo.isMobile ? 'p-3 pb-20' : deviceInfo.isTablet ? 'p-4 pb-6' : 'p-6 pb-4'} space-y-4`}>
        {/* Filter Controls */}
        <div className={`bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg ${deviceInfo.isMobile ? 'p-3' : 'p-4'}`}>
          <FilterTags
            allTags={getAllTags()}
            activeTags={activeTagFilters}
            onTagToggle={handleTagFilter}
            onClearFilters={() => setActiveTagFilters([])}
          />
        </div>

        <div className={getGridClasses()}>
          {filteredScenes.map((scene) => {
            const povCharacter = scene.povCharacterId ? getCharacterById(scene.povCharacterId) : null

            return (
              <Card
                key={scene.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-white/70 backdrop-blur-sm border-white/30 hover:border-purple-300 touch-manipulation"
                onClick={() => {
                  actions.setSelectedItem({ type: "scene", id: scene.id })
                  actions.setViewMode("writing")
                }}
              >
                <CardHeader className="pb-2 md:pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm font-semibold line-clamp-2">{scene.title}</CardTitle>
                    <StatusBadge
                      status={scene.status}
                      onStatusChange={(status) => actions.updateSceneStatus(scene.id, status)}
                      className="ml-2 flex-shrink-0"
                    />
                  </div>
                  <CardDescription className="text-xs text-gray-500">{scene.chapterTitle}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0 space-y-2 md:space-y-3">
                  <p className="text-sm text-gray-600 line-clamp-2 md:line-clamp-3">
                    {scene.synopsis || "Sem sinopse..."}
                  </p>

                  {povCharacter && (
                    <POVBadge
                      character={povCharacter}
                      allCharacters={project.characters}
                      onCharacterChange={(characterId) =>
                        actions.updateSceneContent(scene.id, { ...scene.content, povCharacterId: characterId })
                      }
                    />
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{getWordCount(scene.content)} palavras</span>
                    {scene.tags.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <Tag className="w-3 h-3" />
                        <span>{scene.tags.length}</span>
                      </div>
                    )}
                  </div>

                  {scene.tags.length > 0 && (
                    <TagBadges
                      tags={scene.tags}
                      onTagsChange={(tags) => actions.updateSceneTags(scene.id, tags)}
                      onTagFilter={handleTagFilter}
                      allTags={getAllTags()}
                    />
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredScenes.length === 0 && activeTagFilters.length > 0 && (
          <div className="text-center py-12 text-gray-500">
            <Filter className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-base md:text-lg font-medium">Nenhuma cena encontrada</p>
            <p className="text-sm">Tente ajustar os filtros de tags</p>
          </div>
        )}
      </div>
    )
  }

  const renderOutlinerView = () => {
    const filteredScenes = getFilteredScenes()

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
                  <TableHead className="font-semibold min-w-[120px]">Título</TableHead>
                  <TableHead className="font-semibold min-w-[100px] hidden sm:table-cell">Capítulo</TableHead>
                  <TableHead className="font-semibold min-w-[150px] hidden md:table-cell">Sinopse</TableHead>
                  <TableHead className="font-semibold min-w-[80px]">Status</TableHead>
                  <TableHead className="font-semibold min-w-[80px] hidden sm:table-cell">POV</TableHead>
                  <TableHead className="font-semibold min-w-[80px]">Palavras</TableHead>
                  <TableHead className="font-semibold min-w-[100px] hidden lg:table-cell">Tags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredScenes.map((scene) => {
                  const povCharacter = scene.povCharacterId ? getCharacterById(scene.povCharacterId) : null

                  return (
                    <TableRow
                      key={scene.id}
                      className="cursor-pointer hover:bg-purple-50/50 transition-colors touch-manipulation"
                      onClick={() => {
                        actions.setSelectedItem({ type: "scene", id: scene.id })
                        actions.setViewMode("writing")
                      }}
                    >
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-medium">{scene.title}</div>
                          <div className="text-xs text-gray-500 sm:hidden">{scene.chapterTitle}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 hidden sm:table-cell">{scene.chapterTitle}</TableCell>
                      <TableCell className="max-w-xs hidden md:table-cell">
                        <p className="line-clamp-2 text-sm text-gray-600">{scene.synopsis || "Sem sinopse..."}</p>
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={scene.status}
                          onStatusChange={(status) => actions.updateSceneStatus(scene.id, status)}
                        />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <POVBadge
                          character={povCharacter}
                          allCharacters={project.characters}
                          onCharacterChange={(characterId) =>
                            actions.updateSceneContent(scene.id, { ...scene.content, povCharacterId: characterId })
                          }
                        />
                      </TableCell>
                      <TableCell className="text-gray-600 text-sm">{getWordCount(scene.content)}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <TagBadges
                          tags={scene.tags}
                          onTagsChange={(tags) => actions.updateSceneTags(scene.id, tags)}
                          onTagFilter={handleTagFilter}
                          allTags={getAllTags()}
                        />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        {filteredScenes.length === 0 && activeTagFilters.length > 0 && (
          <div className="text-center py-12 text-gray-500">
            <Filter className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-base md:text-lg font-medium">Nenhuma cena encontrada</p>
            <p className="text-sm">Tente ajustar os filtros de tags</p>
          </div>
        )}
      </div>
    )
  }

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
                  onClick={() =>
                    actions.setSelectedItem({ type: "scene", id: project.manuscript[0]?.scenes[0]?.id || "" })
                  }
                >
                  ← Voltar para Escrita
                </Button>
                <h1 className="text-xl font-semibold text-gray-800">Personagem: {currentCharacter.name}</h1>
              </div>
            </div>
          </div>
        </header>

        {/* Character Sheet Component */}
        <div className="flex-1 overflow-hidden">
          <CharacterSheet
            character={currentCharacter}
            allCharacters={project.characters}
            onUpdate={(updatedCharacter) => actions.updateCharacter(updatedCharacter)}
            onDelete={(characterId) => actions.deleteCharacter(characterId)}
          />
        </div>
      </div>
    )
  }

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
                  onClick={() =>
                    actions.setSelectedItem({ type: "scene", id: project.manuscript[0]?.scenes[0]?.id || "" })
                  }
                >
                  ← Voltar para Escrita
                </Button>
                <h1 className="text-xl font-semibold text-gray-800">Local: {currentLocation.name}</h1>
              </div>
            </div>
          </div>
        </header>

        {/* Location Sheet Component */}
        <div className="flex-1 overflow-hidden">
          <LocationSheet
            location={currentLocation}
            onUpdate={(updatedLocation) => actions.updateLocation(updatedLocation)}
            onDelete={(locationId) => actions.deleteLocation(locationId)}
          />
        </div>
      </div>
    )
  }

  // Main writing interface with view modes
  return (
    <>
      {/* Focus Mode Overlay */}
      <FocusModeOverlay
        isOpen={isFocusModeOpen}
        onClose={() => setIsFocusModeOpen(false)}
        content={currentScene?.content}
        onChange={(content) => currentScene && actions.updateSceneContent(currentScene.id, content)}
        characters={project?.characters || []}
        locations={project?.locations || []}
      />

      {/* Split Screen Manager */}
      <SplitScreenManager
        isOpen={isSplitScreenOpen}
        onClose={() => setIsSplitScreenOpen(false)}
        project={project}
        currentScene={currentScene}
        onSceneUpdate={(content) => currentScene && actions.updateSceneContent(currentScene.id, content)}
      />

      <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex flex-col">
        {/* Header with view mode toggle */}
        <header className="border-b border-white/20 bg-white/60 backdrop-blur-xl flex-shrink-0">
          <div className={`${deviceInfo.isMobile ? 'px-3 py-3' : deviceInfo.isTablet ? 'px-4 py-3' : 'px-6 py-4'}`}>
            <div className="flex items-center justify-between">
              <div className={`flex items-center ${deviceInfo.isMobile ? 'space-x-2' : 'space-x-4'}`}>
                <MobileNavigation
                  project={project}
                  selectedItem={selectedItem}
                  onItemSelect={(item) => actions.setSelectedItem(item)}
                  onAddChapter={handleAddChapter}
                  onAddScene={(chapterId) => {
                    setSelectedChapterForScene(chapterId)
                    setIsAddSceneOpen(true)
                  }}
                  onAddCharacter={handleAddCharacter}
                  onAddLocation={handleAddLocation}
                />

                <Button 
                  variant="ghost" 
                  size={deviceInfo.isMobile ? "sm" : "default"} 
                  onClick={() => router.push("/")}
                >
                  ← {deviceInfo.isMobile ? '' : 'Dashboard'}
                </Button>
                <h1 className={`${deviceInfo.isMobile ? 'text-base' : deviceInfo.isTablet ? 'text-lg' : 'text-xl'} font-semibold text-gray-800 truncate`}>
                  {deviceInfo.isMobile && project?.title && project.title.length > 15 
                    ? `${project.title.substring(0, 15)}...` 
                    : project?.title
                  }
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
                        {deviceInfo.isNotebook ? 'Foco' : 'Modo Foco'}
                      </Button>
                      <Button
                        variant="outline"
                        size={deviceInfo.isNotebook ? "sm" : "default"}
                        onClick={() => setIsSplitScreenOpen(true)}
                        className="bg-white/50 backdrop-blur-sm border-white/30"
                      >
                        <SplitSquareHorizontal className="w-4 h-4 mr-2" />
                        {deviceInfo.isNotebook ? 'Dividir' : 'Tela Dividida'}
                      </Button>
                    </>
                  )}

                  <ToggleGroup
                    type="single"
                    value={viewMode}
                    onValueChange={(value) => value && actions.setViewMode(value as any)}
                    className="bg-white/50 backdrop-blur-sm border border-white/30"
                  >
                    <ToggleGroupItem value="writing" className="data-[state=on]:bg-purple-100">
                      📝 {deviceInfo.isNotebook ? 'Escrita' : 'Escrita'}
                    </ToggleGroupItem>
                    <ToggleGroupItem value="corkboard" className="data-[state=on]:bg-purple-100">
                      📇 {deviceInfo.isNotebook ? 'Cortiça' : 'Cortiça'}
                    </ToggleGroupItem>
                    <ToggleGroupItem value="outliner" className="data-[state=on]:bg-purple-100">
                      📊 {deviceInfo.isNotebook ? 'Estrutura' : 'Estrutura'}
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
              <div className={`${deviceInfo.isNotebook ? 'w-64' : 'w-80'} border-r border-white/20 bg-white/40 backdrop-blur-sm flex-col flex`}>
                <div className="p-4">
                  <p className="text-sm text-gray-600">Conteúdo do painel de navegação...</p>
                </div>
              </div>
            )}

            {/* Center Panel - Editor */}
            <div className="flex-1 flex flex-col">
              <div className={`flex-1 ${deviceInfo.isMobile ? 'p-3 pb-20' : deviceInfo.isTablet ? 'p-4 pb-6' : 'p-6 pb-6'}`}>
                {currentScene ? (
                  <TiptapEditor
                    content={currentScene.content}
                    onChange={(content) => actions.updateSceneContent(currentScene.id, content)}
                    characters={project?.characters || []}
                    locations={project?.locations || []}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <FileText className={`${deviceInfo.isMobile ? 'w-12 h-12' : 'w-16 h-16'} mx-auto mb-4 text-gray-300`} />
                      <p className={`${deviceInfo.isMobile ? 'text-sm' : 'text-base'}`}>Selecione uma cena para começar a escrever</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Metadata (hidden on mobile/tablet/notebook) */}
            {deviceInfo.isMacbook || deviceInfo.isDesktop ? (
              <div className={`${deviceInfo.isMacbook ? 'w-64' : 'w-80'} border-l border-white/20 bg-white/40 backdrop-blur-sm flex`}>
                <div className="p-4">
                  <p className="text-sm text-gray-600">Conteúdo do painel de metadados...</p>
                </div>
              </div>
            ) : null}
          </div>
        )}

        <MobileBottomBar
          viewMode={viewMode}
          onViewModeChange={(mode) => actions.setViewMode(mode as any)}
          onFocusMode={() => setIsFocusModeOpen(true)}
          onSplitScreen={() => setIsSplitScreenOpen(true)}
          showWritingActions={viewMode === "writing" && !!currentScene}
        />
      </div>
    </>
  )
}
