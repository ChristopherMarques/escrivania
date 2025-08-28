"use client";

import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { CharacterSheet } from "@/components/sheets/character-sheet";
import { LocationSheet } from "@/components/sheets/location-sheet";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { FileText, MapPin, Plus, Users, X } from "lucide-react";
import { useCallback, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

interface SplitScreenManagerProps {
  isActive: boolean;
  onClose: () => void;
  currentScene: any;
  scenes: any[];
  characters: any[];
  locations?: any[];
  onSceneChange: (content: string) => void;
  onCreateScene?: (chapterId: string) => void;
  onCreateCharacter?: () => void;
  className?: string;
}

type ReferenceType = "welcome" | "character" | "location" | "scene";

interface ReferenceContent {
  type: ReferenceType;
  id?: string;
  data?: any;
}

export function SplitScreenManager({
  isActive,
  onClose,
  currentScene,
  scenes,
  characters,
  locations = [],
  onSceneChange,
  onCreateScene,
  onCreateCharacter,
  className,
}: SplitScreenManagerProps) {
  const [referenceContent, setReferenceContent] = useState<ReferenceContent>({
    type: "welcome",
  });
  const [selectedReference, setSelectedReference] = useState<string>("");

  const handleReferenceSelect = useCallback(
    (value: string) => {
      setSelectedReference(value);

      if (!value) {
        setReferenceContent({ type: "welcome" });
        return;
      }

      const [type, id] = value.split("-") as [ReferenceType, string];

      switch (type) {
        case "character":
          const character = characters.find((c) => c.id === id);
          if (character) {
            setReferenceContent({ type, id, data: character });
          }
          break;
        case "location":
          const location = locations.find((l) => l.id === id);
          if (location) {
            setReferenceContent({ type, id, data: location });
          }
          break;
        case "scene":
          const scene = scenes.find((s) => s.id === id);
          if (scene) {
            setReferenceContent({ type, id, data: scene });
          }
          break;
      }
    },
    [characters, locations, scenes]
  );

  const renderReferenceContent = () => {
    switch (referenceContent.type) {
      case "welcome":
        return (
          <div className="flex h-full items-center justify-center p-8">
            <div className="text-center space-y-4">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-lg font-medium">Painel de Referência</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Selecione um personagem, local ou cena para visualizar como
                  referência
                </p>
              </div>
            </div>
          </div>
        );
      case "character":
        return (
          <CharacterSheet
            character={referenceContent.data}
            allCharacters={characters}
            onUpdate={(updates) => {
              console.log("Update character:", updates);
            }}
            onDelete={(characterId) => {
              console.log("Delete character:", characterId);
            }}
          />
        );
      case "location":
        return (
          <LocationSheet
            location={referenceContent.data}
            onUpdate={(updates) => {
              console.log("Update location:", updates);
            }}
            onDelete={(locationId) => {
              console.log("Delete location:", locationId);
            }}
          />
        );
      case "scene":
        return (
          <div className="h-full">
            <TiptapEditor
              content={referenceContent.data?.content || ""}
              onChange={() => {}}
              characters={characters}
              locations={locations}
              readOnly={true}
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (!isActive) return null;

  return (
    <div className={cn("h-full", className)}>
      <PanelGroup direction="horizontal" className="h-full">
        {/* Editor Panel */}
        <Panel defaultSize={60} minSize={30}>
          <div className="h-full flex flex-col">
            <div className="border-b p-3 bg-muted/30">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Editor Principal</h3>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <TiptapEditor
                content={currentScene?.content || ""}
                onChange={onSceneChange}
                characters={characters}
                locations={locations}
                readOnly={false}
              />
            </div>
          </div>
        </Panel>

        <PanelResizeHandle className="w-2 bg-border hover:bg-accent transition-colors" />

        {/* Reference Panel */}
        <Panel defaultSize={40} minSize={25}>
          <div className="h-full flex flex-col">
            <div className="border-b p-3 bg-muted/30">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Painel de Referência</h3>
                  <div className="flex gap-1">
                    {onCreateCharacter && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onCreateCharacter}
                        className="h-7 w-7 p-0"
                        title="Criar Personagem"
                      >
                        <Users className="h-3 w-3" />
                        <Plus className="h-2 w-2 -ml-1" />
                      </Button>
                    )}
                    {onCreateScene && currentScene?.chapter_id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onCreateScene!(currentScene.chapter_id)}
                        className="h-7 w-7 p-0"
                        title="Criar Cena"
                      >
                        <FileText className="h-3 w-3" />
                        <Plus className="h-2 w-2 -ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
                <Select
                  value={selectedReference}
                  onValueChange={handleReferenceSelect}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecionar referência..." />
                  </SelectTrigger>
                  <SelectContent>
                    {characters.length > 0 && (
                      <>
                        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                          Personagens
                        </div>
                        {characters.map((character) => (
                          <SelectItem
                            key={character.id}
                            value={`character-${character.id}`}
                          >
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              {character.name}
                            </div>
                          </SelectItem>
                        ))}
                      </>
                    )}
                    {locations.length > 0 && (
                      <>
                        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                          Locais
                        </div>
                        {locations.map((location) => (
                          <SelectItem
                            key={location.id}
                            value={`location-${location.id}`}
                          >
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {location.name}
                            </div>
                          </SelectItem>
                        ))}
                      </>
                    )}
                    {scenes.length > 0 && (
                      <>
                        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                          Cenas
                        </div>
                        {scenes.map((scene) => (
                          <SelectItem
                            key={scene.id}
                            value={`scene-${scene.id}`}
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              {scene.title}
                            </div>
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex-1">{renderReferenceContent()}</div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
