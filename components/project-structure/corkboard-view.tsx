"use client";

import React, { memo, useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Tables } from "@/lib/supabase";
import { FileText, Plus, Edit3, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CorkboardViewProps {
  chapters: Tables<"chapters">[];
  scenes: Tables<"scenes">[];
  selectedChapterId?: string;
  onSceneSelect: (sceneId: string) => void;
  onSceneUpdate: (
    sceneId: string,
    updates: Partial<Tables<"scenes">>
  ) => Promise<void>;
  onSceneCreate: (chapterId: string, title: string) => Promise<void>;
  onSceneDelete: (sceneId: string) => Promise<void>;
  className?: string;
}

interface SceneCardProps {
  scene: Tables<"scenes">;
  onSelect: (sceneId: string) => void;
  onUpdate: (
    sceneId: string,
    updates: Partial<Tables<"scenes">>
  ) => Promise<void>;
  onDelete: (sceneId: string) => Promise<void>;
}

const SceneCard = memo(function SceneCard({
  scene,
  onSelect,
  onUpdate,
  onDelete,
}: SceneCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(scene.title || "");

  const handleSave = async () => {
    await onUpdate(scene.id, { title });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(scene.title || "");
    setIsEditing(false);
  };

  const contentLength = scene.content ? scene.content.length : 0;
  const wordCount = Math.ceil(contentLength / 5); // Estimativa simples

  return (
    <Card
      className="w-64 h-80 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-300"
      onClick={() => !isEditing && onSelect(scene.id)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="font-semibold text-sm w-full border-none outline-none bg-transparent"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  if (e.key === "Escape") handleCancel();
                }}
              />
            ) : (
              <h3
                className="font-semibold text-sm truncate"
                title={scene.title}
              >
                {scene.title}
              </h3>
            )}
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant="secondary"
                className="text-xs bg-blue-100 text-blue-800"
              >
                Cena
              </Badge>
              <span className="text-xs text-gray-500">
                {wordCount} palavras
              </span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit3 className="h-3 w-3 mr-2" />
                Editar Título
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(scene.id)}
                className="text-red-600"
              >
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0 h-48 flex flex-col">
        {isEditing ? (
          <div className="flex gap-1 mt-2">
            <Button size="sm" onClick={handleSave} className="h-6 text-xs px-2">
              Salvar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              className="h-6 text-xs px-2"
            >
              Cancelar
            </Button>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden">
            <p className="text-xs text-gray-600 line-clamp-6">
              {scene.content
                ? `${scene.content.substring(0, 200)}...`
                : "Clique para começar a escrever..."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

export const CorkboardView = memo(function CorkboardView({
  chapters,
  scenes,
  selectedChapterId,
  onSceneSelect,
  onSceneUpdate,
  onSceneCreate,
  onSceneDelete,
  className,
}: CorkboardViewProps) {
  const selectedChapter = chapters.find((ch) => ch.id === selectedChapterId);
  const chapterScenes = useMemo(
    () =>
      scenes
        .filter((scene) => scene.chapter_id === selectedChapterId)
        .sort((a, b) => a.order_index - b.order_index),
    [scenes, selectedChapterId]
  );

  if (!selectedChapterId) {
    return (
      <div
        className={cn(
          "flex flex-col h-full bg-gray-50 dark:bg-gray-900",
          className
        )}
      >
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">
              Selecione um capítulo para ver
              <br />
              as cenas no quadro de cortiça
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-gray-50 dark:bg-gray-900",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Quadro de Cortiça
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {selectedChapter?.title || "Capítulo"} • {chapterScenes.length}{" "}
            cenas
          </p>
        </div>
        <Button
          onClick={() => onSceneCreate(selectedChapterId, "Nova Cena")}
          size="sm"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Nova Cena
        </Button>
      </div>

      {/* Corkboard Grid */}
      <div className="flex-1 overflow-auto p-6">
        {chapterScenes.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm mb-4">Nenhuma cena neste capítulo ainda.</p>
              <Button
                onClick={() => onSceneCreate(selectedChapterId, "Nova Cena")}
                size="sm"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Criar Primeira Cena
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-auto-fit-64 gap-6 justify-center">
            {chapterScenes.map((scene) => (
              <SceneCard
                key={scene.id}
                scene={scene}
                onSelect={onSceneSelect}
                onUpdate={onSceneUpdate}
                onDelete={onSceneDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});
