"use client";

import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Chapter, Scene, SceneStatus } from "@/lib/types";
import { FileText, Book, BarChart3 } from "lucide-react";

interface InspectorPanelProps {
  selectedItem?: {
    type: 'chapter' | 'scene';
    data: Chapter | Scene;
  };
  onUpdateItem: (type: 'chapter' | 'scene', id: string, updates: Partial<Chapter | Scene>) => void;
  className?: string;
}

const sceneStatusOptions: { value: SceneStatus; label: string; color: string }[] = [
  { value: 'draft', label: 'Rascunho', color: 'bg-gray-500' },
  { value: 'in-progress', label: 'Em Progresso', color: 'bg-yellow-500' },
  { value: 'completed', label: 'Concluído', color: 'bg-green-500' },
  { value: 'needs-revision', label: 'Precisa Revisão', color: 'bg-red-500' },
];

export function InspectorPanel({
  selectedItem,
  onUpdateItem,
  className,
}: InspectorPanelProps) {
  const [localTitle, setLocalTitle] = React.useState('');
  const [localSynopsis, setLocalSynopsis] = React.useState('');
  const [localNotes, setLocalNotes] = React.useState('');

  // Update local state when selected item changes
  React.useEffect(() => {
    if (selectedItem) {
      setLocalTitle(selectedItem.data.title || '');
      setLocalSynopsis(selectedItem.data.synopsis || '');
      setLocalNotes(selectedItem.data.notes || '');
    }
  }, [selectedItem]);

  // Debounced update function
  const debouncedUpdate = React.useCallback(
    (field: string, value: string) => {
      if (!selectedItem) return;
      
      const timeoutId = setTimeout(() => {
        onUpdateItem(selectedItem.type, selectedItem.data.id, {
          [field]: value,
          updatedAt: new Date(),
        });
      }, 500);

      return () => clearTimeout(timeoutId);
    },
    [selectedItem, onUpdateItem]
  );

  const handleTitleChange = (value: string) => {
    setLocalTitle(value);
    debouncedUpdate('title', value);
  };

  const handleSynopsisChange = (value: string) => {
    setLocalSynopsis(value);
    debouncedUpdate('synopsis', value);
  };

  const handleNotesChange = (value: string) => {
    setLocalNotes(value);
    debouncedUpdate('notes', value);
  };

  const handleStatusChange = (status: SceneStatus) => {
    if (!selectedItem || selectedItem.type !== 'scene') return;
    onUpdateItem('scene', selectedItem.data.id, {
      status,
      updatedAt: new Date(),
    });
  };

  if (!selectedItem) {
    return (
      <div className={`flex flex-col h-full bg-gray-50 dark:bg-gray-900 ${className}`}>
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">
              Selecione um capítulo ou cena\npara ver os detalhes
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isScene = selectedItem.type === 'scene';
  const scene = isScene ? selectedItem.data as Scene : null;
  const statusOption = scene ? sceneStatusOptions.find(opt => opt.value === scene.status) : null;

  return (
    <div className={`flex flex-col h-full bg-gray-50 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
        {isScene ? (
          <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        ) : (
          <Book className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        )}
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {isScene ? 'Cena' : 'Capítulo'}
          </h2>
          {isScene && scene && (
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant="secondary" 
                className={`${statusOption?.color} text-white text-xs`}
              >
                {statusOption?.label}
              </Badge>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {scene.wordCount || 0} palavras
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={localTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder={isScene ? "Nome da cena" : "Nome do capítulo"}
              />
            </div>

            {/* Status (only for scenes) */}
            {isScene && scene && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={scene.status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sceneStatusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${option.color}`} />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Synopsis */}
            <div className="space-y-2">
              <Label htmlFor="synopsis">Sinopse</Label>
              <Textarea
                id="synopsis"
                value={localSynopsis}
                onChange={(e) => handleSynopsisChange(e.target.value)}
                placeholder="Resumo do que acontece nesta parte da história..."
                rows={4}
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                value={localNotes}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="Observações, ideias, lembretes..."
                rows={6}
              />
            </div>
          </TabsContent>

          <TabsContent value="stats" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Estatísticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isScene && scene ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Palavras:</span>
                      <span className="text-sm font-medium">{scene.wordCount || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Criado em:</span>
                      <span className="text-sm font-medium">
                        {new Date(scene.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Atualizado em:</span>
                      <span className="text-sm font-medium">
                        {new Date(scene.updatedAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Cenas:</span>
                      <span className="text-sm font-medium">
                        {(selectedItem.data as Chapter).scenes?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Palavras totais:</span>
                      <span className="text-sm font-medium">
                        {(selectedItem.data as Chapter).scenes?.reduce((total, scene) => total + (scene.wordCount || 0), 0) || 0}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}