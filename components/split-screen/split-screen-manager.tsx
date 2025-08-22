"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, SplitSquareHorizontal, User, MapPin, FileText } from "lucide-react"
import { CharacterSheet } from "@/components/sheets/character-sheet"
import { LocationSheet } from "@/components/sheets/location-sheet"
import { TiptapEditor } from "@/components/editor/tiptap-editor"

interface SplitScreenManagerProps {
  isOpen: boolean
  onClose: () => void
  project: {
    characters: { id: string; name: string }[]
    locations: { id: string; name: string }[]
    manuscript: { scenes: { id: string; title: string }[] }[]
  }
  currentScene: { id: string; title: string } | null
  onSceneUpdate: (content: unknown) => void
}

type ReferenceType = "character" | "location" | "scene" | "notes"

interface ReferenceItem {
  type: ReferenceType
  id: string
  title: string
  data: unknown
}

export function SplitScreenManager({ isOpen, onClose, project, currentScene, onSceneUpdate }: SplitScreenManagerProps) {
  const [referenceItems, setReferenceItems] = useState<ReferenceItem[]>([])
  const [activeReference, setActiveReference] = useState<string | null>(null)
  const [splitOrientation, setSplitOrientation] = useState<"horizontal" | "vertical">("horizontal")

  const addReference = (type: ReferenceType, id: string) => {
    let item: ReferenceItem | null = null

    switch (type) {
      case "character":
        const character = project.characters.find((c: { id: string; name: string }) => c.id === id)
        if (character) {
          item = { type, id, title: character.name, data: character }
        }
        break
      case "location":
        const location = project.locations.find((l: { id: string; name: string }) => l.id === id)
        if (location) {
          item = { type, id, title: location.name, data: location }
        }
        break
      case "scene":
        const scene = project.manuscript.flatMap((ch: { scenes: { id: string; title: string }[] }) => ch.scenes).find((s: { id: string; title: string }) => s.id === id)
        if (scene) {
          item = { type, id, title: scene.title, data: scene }
        }
        break
      case "notes":
        item = { type, id, title: "Notas Rápidas", data: { content: "" } }
        break
    }

    if (item && !referenceItems.find((ref) => ref.id === id && ref.type === type)) {
      setReferenceItems((prev) => [...prev, item!])
      setActiveReference(`${type}-${id}`)
    }
  }

  const removeReference = (type: ReferenceType, id: string) => {
    const key = `${type}-${id}`
    setReferenceItems((prev) => prev.filter((item) => `${item.type}-${item.id}` !== key))
    if (activeReference === key) {
      setActiveReference(referenceItems.length > 1 ? `${referenceItems[0].type}-${referenceItems[0].id}` : null)
    }
  }

  const renderReferenceContent = (item: ReferenceItem) => {
    switch (item.type) {
      case "character":
        return (
          <CharacterSheet
            character={item.data}
            allCharacters={project.characters}
            onUpdate={(updates) => {
              // Update character in project context
              console.log("Update character:", updates)
            }}
          />
        )
      case "location":
        return (
          <LocationSheet
            location={item.data}
            onUpdate={(updates) => {
              // Update location in project context
              console.log("Update location:", updates)
            }}
          />
        )
      case "scene":
        return (
          <div className="h-full p-4">
            <TiptapEditor
              content={item.data.content}
              onChange={(content) => {
                // Update scene content
                console.log("Update scene content:", content)
              }}
              characters={project.characters}
              locations={project.locations}
              readOnly={true}
            />
          </div>
        )
      case "notes":
        return (
          <div className="h-full p-4">
            <TiptapEditor
              content={item.data.content}
              onChange={(content) => {
                // Update notes
                setReferenceItems((prev) =>
                  prev.map((ref) =>
                    ref.type === "notes" && ref.id === item.id ? { ...ref, data: { ...ref.data, content } } : ref,
                  ),
                )
              }}
              characters={project.characters}
              locations={project.locations}
              placeholder="Digite suas notas aqui..."
            />
          </div>
        )
      default:
        return <div className="p-4 text-gray-500">Conteúdo não disponível</div>
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <div className="border-b border-white/20 bg-white/60 backdrop-blur-xl">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4 mr-2" />
                Fechar Tela Dividida
              </Button>
              <h1 className="text-lg font-semibold text-gray-800">Modo Tela Dividida - {currentScene?.title}</h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Add Reference Controls */}
              <Select
                onValueChange={(value) => {
                  const [type, id] = value.split(":")
                  addReference(type as ReferenceType, id)
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Adicionar Referência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="notes:quick">📝 Notas Rápidas</SelectItem>
                  {project.characters.map((char: { id: string; name: string }) => (
                    <SelectItem key={char.id} value={`character:${char.id}`}>
                      <User className="w-4 h-4 mr-2 inline" />
                      {char.name}
                    </SelectItem>
                  ))}
                  {project.locations.map((loc: { id: string; name: string }) => (
                    <SelectItem key={loc.id} value={`location:${loc.id}`}>
                      <MapPin className="w-4 h-4 mr-2 inline" />
                      {loc.name}
                    </SelectItem>
                  ))}
                  {project.manuscript.flatMap((ch: { scenes: { id: string; title: string }[] }) =>
                    ch.scenes
                      .filter((scene: { id: string; title: string }) => scene.id !== currentScene?.id)
                      .map((scene: { id: string; title: string }) => (
                        <SelectItem key={scene.id} value={`scene:${scene.id}`}>
                          <FileText className="w-4 h-4 mr-2 inline" />
                          {scene.title}
                        </SelectItem>
                      )),
                  )}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSplitOrientation((prev) => (prev === "horizontal" ? "vertical" : "horizontal"))}
              >
                <SplitSquareHorizontal className="w-4 h-4 mr-2" />
                {splitOrientation === "horizontal" ? "Vertical" : "Horizontal"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Split Screen Content */}
      <div
        className={`flex-1 flex ${splitOrientation === "horizontal" ? "flex-row" : "flex-col"} h-[calc(100vh-80px)]`}
      >
        {/* Main Editor */}
        <div className="flex-1 border-r border-white/20 bg-white/40 backdrop-blur-sm">
          <div className="h-full p-6">
            <TiptapEditor
              content={currentScene?.content}
              onChange={onSceneUpdate}
              characters={project.characters}
              locations={project.locations}
            />
          </div>
        </div>

        {/* Reference Panel */}
        <div className="flex-1 bg-white/40 backdrop-blur-sm">
          {referenceItems.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <SplitSquareHorizontal className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">Nenhuma referência aberta</p>
                <p className="text-sm">Use o menu acima para adicionar personagens, locais ou cenas</p>
              </div>
            </div>
          ) : (
            <Tabs
              value={activeReference || undefined}
              onValueChange={setActiveReference}
              className="h-full flex flex-col"
            >
              <TabsList className="grid w-full grid-cols-auto bg-white/50 backdrop-blur-sm border-b border-white/30">
                {referenceItems.map((item) => {
                  const key = `${item.type}-${item.id}`
                  return (
                    <TabsTrigger key={key} value={key} className="relative group">
                      {item.title}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeReference(item.type, item.id)
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </TabsTrigger>
                  )
                })}
              </TabsList>

              {referenceItems.map((item) => {
                const key = `${item.type}-${item.id}`
                return (
                  <TabsContent key={key} value={key} className="flex-1 overflow-hidden">
                    {renderReferenceContent(item)}
                  </TabsContent>
                )
              })}
            </Tabs>
          )}
        </div>
      </div>
    </div>
  )
}
