"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import type { Tables } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Edit,
  FileText,
  MapPin,
  Save,
  User,
  X,
} from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";

// Tipos específicos para o painel de metadados
type SceneWithChapter = Tables<"scenes"> & {
  chapterTitle?: string;
};

type SelectedData =
  | Tables<"chapters">
  | SceneWithChapter
  | Tables<"characters">
  | null;

interface MetadataPanelProps {
  project: Tables<"projects"> | undefined;
  chapters: Tables<"chapters">[] | undefined;
  scenes: Tables<"scenes">[] | undefined;
  characters: Tables<"characters">[] | undefined;
  selectedItem: { type: string; id: string } | null;
  onUpdateItem?: (
    type: string,
    id: string,
    data: Partial<Tables<"chapters"> | Tables<"scenes"> | Tables<"characters">>
  ) => void;
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const MetadataPanel = memo(function MetadataPanel({
  project,
  chapters = [],
  scenes = [],
  characters = [],
  selectedItem,
  onUpdateItem,
  className,
  isCollapsed = false,
  onToggleCollapse,
}: MetadataPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});

  // Memoize selected data calculation
  const selectedData = useMemo((): SelectedData => {
    if (!selectedItem) return null;

    const { type, id } = selectedItem;

    switch (type) {
      case "chapter":
        return chapters.find((ch) => ch.id === id) || null;
      case "scene":
        const scene = scenes.find((sc) => sc.id === id);
        if (scene) {
          const chapter = chapters.find((ch) => ch.id === scene.chapter_id);
          return { ...scene, chapterTitle: chapter?.title } as SceneWithChapter;
        }
        return null;
      case "character":
        return characters.find((ch) => ch.id === id) || null;
      case "location":
        // Locations will be implemented later
        return null;
      default:
        return null;
    }
  }, [selectedItem, chapters, scenes, characters]);

  const handleEdit = useCallback(() => {
    if (selectedData) {
      setEditData({ ...selectedData });
      setIsEditing(true);
    }
  }, [selectedData]);

  const handleSave = useCallback(() => {
    if (selectedItem && onUpdateItem) {
      onUpdateItem(selectedItem.type, selectedItem.id, editData);
      setIsEditing(false);
    }
  }, [selectedItem, onUpdateItem, editData]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditData({});
  }, []);

  const getIcon = useMemo(() => {
    switch (selectedItem?.type) {
      case "chapter":
        return <FileText className="h-5 w-5 text-escrivania-purple-600" />;
      case "scene":
        return <FileText className="h-5 w-5 text-escrivania-blue-600" />;
      case "character":
        return <User className="h-5 w-5 text-escrivania-blue-600" />;
      case "location":
        return <MapPin className="h-5 w-5 text-green-600" />;
      default:
        return <BarChart3 className="h-5 w-5 text-gray-600" />;
    }
  }, [selectedItem?.type]);

  const getTypeLabel = useMemo(() => {
    switch (selectedItem?.type) {
      case "chapter":
        return "Capítulo";
      case "scene":
        return "Cena";
      case "character":
        return "Personagem";
      case "location":
        return "Local";
      default:
        return "Item";
    }
  }, [selectedItem?.type]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    // Format date to Brazilian format (client-side only to avoid hydration mismatch)
    if (typeof window === "undefined") {
      return dateString; // Return raw date on server
    }
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getWordCount = useCallback((content: string) => {
    if (!content || typeof content !== "string") return 0;
    return content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  }, []);

  // Collapsed state
  if (isCollapsed) {
    return (
      <div
        className={cn(
          "flex flex-col h-full relative w-12 transition-all duration-300",
          className
        )}
      >
        {/* Background */}
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 border-l border-border shadow-xl" />

        {/* Collapsed Header */}
        <div className="relative z-10 p-3 border-b border-border bg-background">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="h-6 w-6 p-0 text-primary hover:bg-primary/10"
            title="Expandir painel de metadados"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Collapsed Content */}
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <div className="transform -rotate-90 text-xs text-muted-foreground whitespace-nowrap">
            Metadados
          </div>
        </div>
      </div>
    );
  }

  if (!selectedItem || !selectedData) {
    return (
      <div
        className={cn(
          "flex flex-col h-full relative transition-all duration-300",
          className
        )}
      >
        {/* Background */}
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 border-l border-border shadow-xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          <div className="p-4 border-b border-white/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-primary">Metadados</h2>
              </div>
              {onToggleCollapse && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleCollapse}
                  className="h-6 w-6 p-0 text-primary hover:bg-primary/10"
                  title="Recolher painel de metadados"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-primary/50" />
              <p className="text-sm">Selecione um item para ver os metadados</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col h-full relative transition-all duration-300",
        className
      )}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 border-l border-border shadow-xl" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-border bg-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              {getIcon}
              <h2 className="font-semibold ">Metadados</h2>
            </div>
            <div className="flex items-center gap-1">
              {!isEditing ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  className="h-8 w-8 p-0 text-primary"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              ) : (
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSave}
                    className="h-8 w-8 p-0 text-green-600 hover:bg-green-100"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    className="h-8 w-8 p-0 text-red-600 hover:bg-red-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {onToggleCollapse && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleCollapse}
                  className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
                  title="Recolher painel de metadados"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {/* Basic Info */}
            <Card className="bg-background border-border shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader className="pb-3 bg-background border-b border-border">
                <CardTitle className="text-sm flex items-center gap-2 text-primary">
                  {getIcon}
                  {getTypeLabel}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Título
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editData.title || editData.name || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          [selectedItem.type === "character" ||
                          selectedItem.type === "location"
                            ? "name"
                            : "title"]: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-sm font-medium text-foreground/60">
                      {"title" in selectedData
                        ? selectedData.title
                        : selectedData.name}
                    </p>
                  )}
                </div>

                {selectedItem?.type === "scene" &&
                  "chapterTitle" in selectedData &&
                  selectedData.chapterTitle && (
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Capítulo
                      </Label>
                      <p className="text-sm text-foreground/60">
                        {selectedData.chapterTitle}
                      </p>
                    </div>
                  )}

                <div>
                  <Label className="text-xs text-muted-foreground">
                    Descrição
                  </Label>
                  {isEditing ? (
                    <Textarea
                      value={editData.description || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          description: e.target.value,
                        })
                      }
                      className="mt-1"
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm text-foreground/60">
                      {"description" in selectedData
                        ? selectedData.description || "Sem descrição"
                        : "Sem descrição"}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card className="bg-background border-border shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader className="pb-3 bg-background border-b border-border">
                <CardTitle className="text-sm flex items-center gap-2 text-primary">
                  <BarChart3 className="h-4 w-4" />
                  Estatísticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {"content" in selectedData && selectedData.content && (
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">
                      Palavras:
                    </span>
                    <span className="text-sm font-medium text-foreground/60">
                      {getWordCount(selectedData.content || "")}
                    </span>
                  </div>
                )}

                {selectedItem.type === "chapter" && (
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">
                      Cenas:
                    </span>
                    <span className="text-sm font-medium text-foreground/60">
                      {
                        scenes.filter(
                          (scene) => scene.chapter_id === selectedItem.id
                        ).length
                      }
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Criado:</span>
                  <span className="text-sm text-foreground/60">
                    {formatDate(selectedData.created_at)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">
                    Atualizado:
                  </span>
                  <span className="text-sm text-foreground/60">
                    {formatDate(selectedData.updated_at)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {selectedItem.type === "character" && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">
                    Detalhes do Personagem
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Idade removida - propriedade não existe no schema */}

                  {/* Papel removido - propriedade não existe no schema */}
                </CardContent>
              </Card>
            )}

            {/* Location removido - tabela não existe no schema do Supabase */}

            {/* Tags/Status removidos - propriedades não existem no schema do Supabase */}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
});
