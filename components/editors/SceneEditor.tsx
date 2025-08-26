"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Save,
  Edit3,
  ArrowLeft,
  Clock,
  FileText,
  BookOpen,
  Users,
  ChevronLeft,
  ChevronRight,
  Target,
} from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import type { Scene } from "@/contexts/ProjectContext";

interface SceneEditorProps {
  sceneId: string;
  onBack?: () => void;
}

export function SceneEditor({ sceneId, onBack }: SceneEditorProps) {
  const { state, updateScene } = useProject();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedScene, setEditedScene] = useState<Partial<Scene>>({});

  const scene = state.scenes.find((s) => s.id === sceneId);
  const chapter = scene
    ? state.chapters.find((c) => c.id === scene.chapter_id)
    : null;
  const project = chapter
    ? state.projects.find((p) => p.id === chapter.project_id)
    : null;

  // Encontrar cenas adjacentes no mesmo capítulo
  const chapterScenes = chapter
    ? state.scenes
        .filter((s) => s.chapter_id === chapter.id)
        .sort((a, b) => a.order_index - b.order_index)
    : [];

  const currentSceneIndex = chapterScenes.findIndex((s) => s.id === sceneId);
  const previousScene =
    currentSceneIndex > 0 ? chapterScenes[currentSceneIndex - 1] : null;
  const nextScene =
    currentSceneIndex < chapterScenes.length - 1
      ? chapterScenes[currentSceneIndex + 1]
      : null;

  // Encontrar personagens mencionados na cena
  const mentionedCharacters =
    scene && scene.content
      ? state.characters.filter(
          (character) =>
            character.project_id === project?.id &&
            scene.content?.toLowerCase().includes(character.name.toLowerCase())
        )
      : [];

  useEffect(() => {
    if (scene) {
      setEditedScene({
        title: scene.title,
        content: scene.content || "",
      });
    }
  }, [scene]);

  const handleSaveScene = async () => {
    if (!scene || !editedScene.title?.trim()) return;

    setIsSaving(true);
    try {
      await updateScene(scene.id, {
        title: editedScene.title,
        content: editedScene.content,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao salvar cena:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const getWordCount = (text: string) => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  const getCharacterCount = (text: string) => {
    return text.length;
  };

  const getReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = getWordCount(text);
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  };

  const navigateToScene = (targetSceneId: string) => {
    // Esta função seria implementada para navegar para outra cena
    console.log("Navegar para cena:", targetSceneId);
  };

  if (!scene) {
    return (
      <div className="p-6 text-center">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Cena não encontrada</h3>
        <p className="text-muted-foreground mb-4">
          A cena que você está procurando não existe ou foi removida.
        </p>
        <Button onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {project?.title || "Projeto"} → {chapter?.title || "Capítulo"}
              </span>
            </div>
            <h1 className="text-2xl font-bold flex items-center">
              <FileText className="mr-2 h-6 w-6" />
              {scene.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Navigation between scenes */}
          <div className="flex items-center space-x-1 mr-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => previousScene && navigateToScene(previousScene.id)}
              disabled={!previousScene}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              {currentSceneIndex + 1} de {chapterScenes.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => nextScene && navigateToScene(nextScene.id)}
              disabled={!nextScene}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveScene}
                disabled={isSaving || !editedScene.title?.trim()}
              >
                {isSaving ? (
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Salvar
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit3 className="mr-2 h-4 w-4" />
              Editar
            </Button>
          )}
        </div>
      </div>

      {/* Scene Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Conteúdo da Cena</span>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>{getWordCount(scene.content || "")} palavras</span>
              <span>{getCharacterCount(scene.content || "")} caracteres</span>
              <span>~{getReadingTime(scene.content || "")} min leitura</span>
            </div>
          </CardTitle>
          <CardDescription>
            {isEditing
              ? "Edite o título e conteúdo da cena"
              : "Visualize e gerencie o conteúdo da cena"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div>
                <label className="text-sm font-medium mb-2 block">Título</label>
                <Input
                  value={editedScene.title || ""}
                  onChange={(e) =>
                    setEditedScene((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Título da cena"
                  className="text-lg font-semibold"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Conteúdo
                </label>
                <Textarea
                  value={editedScene.content || ""}
                  onChange={(e) =>
                    setEditedScene((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  placeholder="Escreva o conteúdo da cena: diálogos, ações, descrições, pensamentos dos personagens..."
                  className="min-h-[500px] resize-none font-mono text-sm leading-relaxed"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>
                    {getWordCount(editedScene.content || "")} palavras
                  </span>
                  <span>
                    {getCharacterCount(editedScene.content || "")} caracteres
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              {scene.content ? (
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed font-serif">
                    {scene.content}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="mx-auto h-8 w-8 mb-2" />
                  <p>
                    Nenhum conteúdo ainda. Clique em "Editar" para escrever a
                    cena.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Scene Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Palavras</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getWordCount(scene.content || "")}
            </div>
            <p className="text-xs text-muted-foreground">
              {getCharacterCount(scene.content || "")} caracteres
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Leitura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ~{getReadingTime(scene.content || "")}
            </div>
            <p className="text-xs text-muted-foreground">minutos estimados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Posição</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentSceneIndex + 1}</div>
            <p className="text-xs text-muted-foreground">
              de {chapterScenes.length} cenas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Personagens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mentionedCharacters.length}
            </div>
            <p className="text-xs text-muted-foreground">mencionados</p>
          </CardContent>
        </Card>
      </div>

      {/* Mentioned Characters */}
      {mentionedCharacters.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Personagens na Cena</h2>
          <div className="grid gap-3">
            {mentionedCharacters.map((character) => (
              <Card
                key={character.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Users className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{character.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {character.description || "Sem descrição"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        console.log("Ver personagem:", character.id)
                      }
                    >
                      <Target className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Adjacent Scenes */}
      {(previousScene || nextScene) && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Navegação</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {previousScene && (
              <Card
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigateToScene(previousScene.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <ChevronLeft className="h-4 w-4" />
                    <CardTitle className="text-lg">Cena Anterior</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-2">{previousScene.title}</h3>
                  {previousScene.content ? (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {previousScene.content}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Cena sem conteúdo
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-3">
                    <span>
                      {getWordCount(previousScene.content || "")} palavras
                    </span>
                    <Badge variant="outline">
                      #{previousScene.order_index}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {nextScene && (
              <Card
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigateToScene(nextScene.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-lg">Próxima Cena</CardTitle>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-2">{nextScene.title}</h3>
                  {nextScene.content ? (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {nextScene.content}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Cena sem conteúdo
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-3">
                    <span>
                      {getWordCount(nextScene.content || "")} palavras
                    </span>
                    <Badge variant="outline">#{nextScene.order_index}</Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Chapter Context */}
      {chapter && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Contexto do Capítulo</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                {chapter.title}
              </CardTitle>
              <CardDescription>
                {chapter.description || "Sem descrição disponível"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{chapterScenes.length} cenas no capítulo</span>
                <span>
                  Atualizado em{" "}
                  {new Date(chapter.updated_at).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Writing Tips */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-900">
            Dicas para Escrever Cenas
          </CardTitle>
        </CardHeader>
        <CardContent className="text-green-800">
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                Cada cena deve ter um objetivo claro e avançar a história
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                Mostre, não conte - use ações e diálogos em vez de exposição
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                Comece o mais tarde possível e termine o mais cedo possível
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Use conflito para manter o leitor engajado</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Termine com um gancho que leve à próxima cena</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export default SceneEditor;
