"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Scene, SceneStatus, Chapter } from "@/lib/types";
import { FileText, Plus, Edit3, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CorkboardViewProps {
  chapters: Chapter[];
  selectedChapterId?: string;
  onSceneSelect: (scene: Scene) => void;
  onSceneUpdate: (sceneId: string, updates: Partial<Scene>) => void;
  onSceneCreate: (chapterId: string) => void;
  onSceneDelete: (sceneId: string) => void;
  className?: string;
}

const sceneStatusConfig: Record<SceneStatus, { label: string; color: string; bgColor: string }> = {
  'draft': { 
    label: 'Rascunho', 
    color: 'text-gray-700 dark:text-gray-300', 
    bgColor: 'bg-gray-100 dark:bg-gray-800' 
  },
  'in-progress': { 
    label: 'Em Progresso', 
    color: 'text-yellow-700 dark:text-yellow-300', 
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20' 
  },
  'completed': { 
    label: 'Concluído', 
    color: 'text-green-700 dark:text-green-300', 
    bgColor: 'bg-green-50 dark:bg-green-900/20' 
  },
  'needs-revision': { 
    label: 'Precisa Revisão', 
    color: 'text-red-700 dark:text-red-300', 
    bgColor: 'bg-red-50 dark:bg-red-900/20' 
  },
};

interface SceneCardProps {
  scene: Scene;
  onSelect: () => void;
  onUpdate: (updates: Partial<Scene>) => void;
  onDelete: () => void;
}

function SceneCard({ scene, onSelect, onUpdate, onDelete }: SceneCardProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [localSynopsis, setLocalSynopsis] = React.useState(scene.synopsis || '');
  const statusConfig = sceneStatusConfig[scene.status];

  const handleSynopsisSubmit = () => {
    onUpdate({ synopsis: localSynopsis });
    setIsEditing(false);
  };

  const handleSynopsisCancel = () => {
    setLocalSynopsis(scene.synopsis || '');
    setIsEditing(false);
  };

  return (
    <Card 
      className={cn(
        "w-64 h-48 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105",
        "border-2 border-dashed border-gray-300 dark:border-gray-600",
        statusConfig.bgColor
      )}
      onClick={onSelect}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate text-gray-900 dark:text-gray-100">
              {scene.title || 'Cena sem título'}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant="secondary" 
                className={cn("text-xs", statusConfig.color)}
              >
                {statusConfig.label}
              </Badge>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {scene.wordCount || 0} palavras
              </span>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}>
                <Edit3 className="h-3 w-3 mr-2" />
                Editar Sinopse
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="text-red-600 dark:text-red-400"
              >
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {isEditing ? (
          <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
            <Textarea
              value={localSynopsis}
              onChange={(e) => setLocalSynopsis(e.target.value)}
              placeholder="Sinopse da cena..."
              className="text-xs resize-none"
              rows={3}
            />
            <div className="flex gap-1">
              <Button size="sm" onClick={handleSynopsisSubmit} className="h-6 text-xs">
                Salvar
              </Button>
              <Button size="sm" variant="outline" onClick={handleSynopsisCancel} className="h-6 text-xs">
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-4">
            {scene.synopsis || 'Clique para adicionar uma sinopse...'}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface AddSceneCardProps {
  onAdd: () => void;
}

function AddSceneCard({ onAdd }: AddSceneCardProps) {
  return (
    <Card 
      className="w-64 h-48 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50"
      onClick={onAdd}
    >
      <CardContent className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <Plus className="h-8 w-8 mb-2" />
        <span className="text-sm font-medium">Nova Cena</span>
      </CardContent>
    </Card>
  );
}

export function CorkboardView({
  chapters,
  selectedChapterId,
  onSceneSelect,
  onSceneUpdate,
  onSceneCreate,
  onSceneDelete,
  className,
}: CorkboardViewProps) {
  const selectedChapter = chapters.find(ch => ch.id === selectedChapterId);
  const scenes = selectedChapter?.scenes || [];

  if (!selectedChapterId) {
    return (
      <div className={cn("flex flex-col h-full bg-gray-50 dark:bg-gray-900", className)}>
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">
              Selecione um capítulo para ver\nas cenas no quadro de cortiça
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full bg-gray-50 dark:bg-gray-900", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Quadro de Cortiça
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {selectedChapter?.title || 'Capítulo'} • {scenes.length} cenas
          </p>
        </div>
        <Button
          onClick={() => onSceneCreate(selectedChapterId)}
          size="sm"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Nova Cena
        </Button>
      </div>

      {/* Corkboard Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-auto-fit-64 gap-6 justify-center">
          {scenes.map((scene) => (
            <SceneCard
              key={scene.id}
              scene={scene}
              onSelect={() => onSceneSelect(scene)}
              onUpdate={(updates) => onSceneUpdate(scene.id, updates)}
              onDelete={() => onSceneDelete(scene.id)}
            />
          ))}
          
          <AddSceneCard onAdd={() => onSceneCreate(selectedChapterId)} />
        </div>
        
        {scenes.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <FileText className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-sm text-center">
              Este capítulo ainda não tem cenas.\nClique em "Nova Cena" para começar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// CSS personalizado para o grid responsivo
const corkboardStyles = `
.grid-cols-auto-fit-64 {
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
}

.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = corkboardStyles;
  document.head.appendChild(styleElement);
}