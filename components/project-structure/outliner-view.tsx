"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Scene, SceneStatus, Chapter } from "@/lib/types";
import { FileText, Plus, MoreVertical, Edit3, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface OutlinerViewProps {
  chapters: Chapter[];
  onSceneSelect: (scene: Scene) => void;
  onSceneUpdate: (sceneId: string, updates: Partial<Scene>) => void;
  onSceneCreate: (chapterId: string) => void;
  onSceneDelete: (sceneId: string) => void;
  onChapterUpdate: (chapterId: string, updates: Partial<Chapter>) => void;
  className?: string;
}

const sceneStatusOptions: { value: SceneStatus; label: string; color: string }[] = [
  { value: 'draft', label: 'Rascunho', color: 'bg-muted' },
  { value: 'in-progress', label: 'Em Progresso', color: 'bg-escrivania-purple-200' },
  { value: 'completed', label: 'Concluído', color: 'bg-escrivania-blue-200' },
  { value: 'needs-revision', label: 'Precisa Revisão', color: 'bg-destructive/20' },
];

interface EditableCellProps {
  value: string;
  onSave: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
}

function EditableCell({ value, onSave, multiline = false, placeholder }: EditableCellProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [localValue, setLocalValue] = React.useState(value);

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSave = () => {
    onSave(localValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-1">
        {multiline ? (
          <Textarea
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="min-h-[60px] text-xs"
            autoFocus
          />
        ) : (
          <Input
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="text-xs"
            autoFocus
          />
        )}
        <div className="flex gap-1">
          <Button size="sm" onClick={handleSave} className="h-6 text-xs px-2">
            Salvar
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel} className="h-6 text-xs px-2">
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="cursor-pointer hover:bg-muted/50 p-1 rounded min-h-[24px] flex items-center"
      onClick={() => setIsEditing(true)}
    >
      <span className="text-xs text-muted-foreground">
        {value || <span className="text-muted-foreground/60 italic">{placeholder}</span>}
      </span>
    </div>
  );
}

interface ChapterRowProps {
  chapter: Chapter;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onUpdate: (updates: Partial<Chapter>) => void;
  onSceneCreate: () => void;
}

function ChapterRow({ chapter, isExpanded, onToggleExpanded, onUpdate, onSceneCreate }: ChapterRowProps) {
  const sceneCount = chapter.scenes?.length || 0;
  const totalWords = chapter.scenes?.reduce((sum, scene) => sum + (scene.wordCount || 0), 0) || 0;

  return (
    <TableRow className="bg-escrivania-blue-50 border-b-2">
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpanded}
            className="h-6 w-6 p-0"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
          <EditableCell
            value={chapter.title || ''}
            onSave={(title) => onUpdate({ title })}
            placeholder="Nome do capítulo"
          />
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="text-xs">
          {sceneCount} cenas
        </Badge>
      </TableCell>
      <TableCell>
        <EditableCell
          value={chapter.synopsis || ''}
          onSave={(synopsis) => onUpdate({ synopsis })}
          multiline
          placeholder="Sinopse do capítulo"
        />
      </TableCell>
      <TableCell>
        <EditableCell
          value={chapter.notes || ''}
          onSave={(notes) => onUpdate({ notes })}
          multiline
          placeholder="Notas do capítulo"
        />
      </TableCell>
      <TableCell className="text-xs text-gray-600 dark:text-gray-400">
        {totalWords} palavras
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreVertical className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onSceneCreate}>
              <Plus className="h-3 w-3 mr-2" />
              Nova Cena
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

interface SceneRowProps {
  scene: Scene;
  onSelect: () => void;
  onUpdate: (updates: Partial<Scene>) => void;
  onDelete: () => void;
}

function SceneRow({ scene, onSelect, onUpdate, onDelete }: SceneRowProps) {
  const statusOption = sceneStatusOptions.find(opt => opt.value === scene.status);

  return (
    <TableRow 
      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
      onClick={onSelect}
    >
      <TableCell className="pl-12">
        <div className="flex items-center gap-2">
          <FileText className="h-3 w-3 text-gray-400" />
          <EditableCell
            value={scene.title || ''}
            onSave={(title) => onUpdate({ title })}
            placeholder="Nome da cena"
          />
        </div>
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <Select 
          value={scene.status} 
          onValueChange={(status: SceneStatus) => onUpdate({ status })}
        >
          <SelectTrigger className="h-6 text-xs border-none bg-transparent p-1">
            <SelectValue>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${statusOption?.color}`} />
                <span className="text-xs">{statusOption?.label}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {sceneStatusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${option.color}`} />
                  <span className="text-xs">{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <EditableCell
          value={scene.synopsis || ''}
          onSave={(synopsis) => onUpdate({ synopsis })}
          multiline
          placeholder="Sinopse da cena"
        />
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <EditableCell
          value={scene.notes || ''}
          onSave={(notes) => onUpdate({ notes })}
          multiline
          placeholder="Notas da cena"
        />
      </TableCell>
      <TableCell className="text-xs text-gray-600 dark:text-gray-400">
        {scene.wordCount || 0} palavras
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreVertical className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onDelete} className="text-red-600 dark:text-red-400">
              <Trash2 className="h-3 w-3 mr-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

export function OutlinerView({
  chapters,
  onSceneSelect,
  onSceneUpdate,
  onSceneCreate,
  onSceneDelete,
  onChapterUpdate,
  className,
}: OutlinerViewProps) {
  const [expandedChapters, setExpandedChapters] = React.useState<Set<string>>(new Set());

  const toggleChapterExpanded = (chapterId: string) => {
    setExpandedChapters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId);
      } else {
        newSet.add(chapterId);
      }
      return newSet;
    });
  };

  const totalScenes = chapters.reduce((sum, chapter) => sum + (chapter.scenes?.length || 0), 0);
  const totalWords = chapters.reduce((sum, chapter) => 
    sum + (chapter.scenes?.reduce((sceneSum, scene) => sceneSum + (scene.wordCount || 0), 0) || 0), 0
  );

  return (
    <div className={cn("flex flex-col h-full bg-white dark:bg-gray-900", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Visão Estrutural
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {chapters.length} capítulos • {totalScenes} cenas • {totalWords} palavras
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Título</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[250px]">Sinopse</TableHead>
              <TableHead className="w-[250px]">Notas</TableHead>
              <TableHead className="w-[100px]">Palavras</TableHead>
              <TableHead className="w-[50px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {chapters.map((chapter) => {
              const isExpanded = expandedChapters.has(chapter.id);
              return (
                <React.Fragment key={chapter.id}>
                  <ChapterRow
                    chapter={chapter}
                    isExpanded={isExpanded}
                    onToggleExpanded={() => toggleChapterExpanded(chapter.id)}
                    onUpdate={(updates) => onChapterUpdate(chapter.id, updates)}
                    onSceneCreate={() => onSceneCreate(chapter.id)}
                  />
                  {isExpanded && chapter.scenes?.map((scene) => (
                    <SceneRow
                      key={scene.id}
                      scene={scene}
                      onSelect={() => onSceneSelect(scene)}
                      onUpdate={(updates) => onSceneUpdate(scene.id, updates)}
                      onDelete={() => onSceneDelete(scene.id)}
                    />
                  ))}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
        
        {chapters.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <FileText className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-sm text-center">
              Nenhum capítulo encontrado.\nCrie um capítulo para começar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}