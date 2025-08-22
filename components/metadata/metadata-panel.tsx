"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import type { Tables } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { BarChart3, Edit, FileText, MapPin, Save, User, X } from "lucide-react";
import { useState } from "react";

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
}

export function MetadataPanel({
  project,
  chapters = [],
  scenes = [],
  characters = [],
  selectedItem,
  onUpdateItem,
  className,
}: MetadataPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});

  const getSelectedData = (): SelectedData => {
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
  };

  const selectedData = getSelectedData();

  const handleEdit = () => {
    setEditData(selectedData || {});
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onUpdateItem && selectedItem) {
      onUpdateItem(selectedItem.type, selectedItem.id, editData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({});
    setIsEditing(false);
  };

  const getIcon = () => {
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
  };

  const getTypeLabel = () => {
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
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getWordCount = (content: string) => {
    if (!content || typeof content !== "string") return 0;
    return content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  if (!selectedItem || !selectedData) {
    return (
      <div
        className={cn(
          "flex flex-col h-full bg-white/40 backdrop-blur-sm border-l border-white/20",
          className
        )}
      >
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-gray-600" />
            <h2 className="font-semibold text-foreground">Metadados</h2>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm">Selecione um item para ver os metadados</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-white/40 backdrop-blur-sm border-l border-white/20",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getIcon()}
            <h2 className="font-semibold text-foreground">Metadados</h2>
          </div>
          {!isEditing ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="h-8 w-8 p-0"
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
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Basic Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                {getIcon()}
                {getTypeLabel()}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs text-gray-600">Título</Label>
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
                  <p className="text-sm font-medium">
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
                    <Label className="text-xs text-gray-600">Capítulo</Label>
                    <p className="text-sm">{selectedData.chapterTitle}</p>
                  </div>
                )}

              <div>
                <Label className="text-xs text-gray-600">Descrição</Label>
                {isEditing ? (
                  <Textarea
                    value={editData.description || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, description: e.target.value })
                    }
                    className="mt-1"
                    rows={3}
                  />
                ) : (
                  <p className="text-sm text-gray-700">
                    {"description" in selectedData
                      ? selectedData.description || "Sem descrição"
                      : "Sem descrição"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Estatísticas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {"content" in selectedData && selectedData.content && (
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600">Palavras:</span>
                  <span className="text-sm font-medium">
                    {getWordCount(selectedData.content || "")}
                  </span>
                </div>
              )}

              {selectedItem.type === "chapter" && (
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600">Cenas:</span>
                  <span className="text-sm font-medium">
                    {
                      scenes.filter(
                        (scene) => scene.chapter_id === selectedItem.id
                      ).length
                    }
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Criado:</span>
                <span className="text-sm">
                  {formatDate(selectedData.created_at)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Atualizado:</span>
                <span className="text-sm">
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
  );
}
