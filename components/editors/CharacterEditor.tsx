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
import { Save, Edit3, ArrowLeft, User, BookOpen, FileText } from "lucide-react";
import { BookLoader } from "@/components/ui/book-loader";
import { useProject } from "@/contexts/ProjectContext";
import type { Character } from "@/contexts/ProjectContext";

interface CharacterEditorProps {
  characterId: string;
  onBack?: () => void;
}

export function CharacterEditor({ characterId, onBack }: CharacterEditorProps) {
  const { state, updateCharacter } = useProject();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedCharacter, setEditedCharacter] = useState<Partial<Character>>(
    {}
  );

  const character = state.characters.find((c) => c.id === characterId);
  const project = character
    ? state.projects.find((p) => p.id === character.project_id)
    : null;

  // Encontrar cenas onde o personagem aparece (simulado)
  const characterScenes = character
    ? state.scenes.filter((scene) =>
        scene.content?.toLowerCase().includes(character.name.toLowerCase())
      )
    : [];

  // Encontrar capítulos relacionados
  const relatedChapters =
    characterScenes.length > 0
      ? state.chapters.filter((chapter) =>
          characterScenes.some((scene) => scene.chapter_id === chapter.id)
        )
      : [];

  useEffect(() => {
    if (character) {
      setEditedCharacter({
        name: character.name,
        description: character.description || "",
      });
    }
  }, [character]);

  const handleSaveCharacter = async () => {
    if (!character || !editedCharacter.name?.trim()) return;

    setIsSaving(true);
    try {
      await updateCharacter(character.id, {
        name: editedCharacter.name,
        description: editedCharacter.description,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao salvar personagem:", error);
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

  if (!character) {
    return (
      <div className="p-6 text-center">
        <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          Personagem não encontrado
        </h3>
        <p className="text-muted-foreground mb-4">
          O personagem que você está procurando não existe ou foi removido.
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
                {project?.title || "Projeto"}
              </span>
            </div>
            <h1 className="text-2xl font-bold flex items-center">
              <User className="mr-2 h-6 w-6" />
              {character.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
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
                onClick={handleSaveCharacter}
                disabled={isSaving || !editedCharacter.name?.trim()}
              >
                {isSaving ? (
                  <BookLoader size="sm" className="mr-2" />
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

      {/* Character Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Perfil do Personagem</span>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>{getWordCount(character.description || "")} palavras</span>
              <span>Aparece em {characterScenes.length} cenas</span>
            </div>
          </CardTitle>
          <CardDescription>
            {isEditing
              ? "Edite o nome e descrição do personagem"
              : "Visualize e gerencie as informações do personagem"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div>
                <label className="text-sm font-medium mb-2 block">Nome</label>
                <Input
                  value={editedCharacter.name || ""}
                  onChange={(e) =>
                    setEditedCharacter((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Nome do personagem"
                  className="text-lg font-semibold"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Descrição
                </label>
                <Textarea
                  value={editedCharacter.description || ""}
                  onChange={(e) =>
                    setEditedCharacter((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Descreva o personagem: aparência, personalidade, história, motivações..."
                  className="min-h-[300px] resize-none"
                />
              </div>
            </>
          ) : (
            <div className="space-y-4">
              {character.description ? (
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {character.description}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="mx-auto h-8 w-8 mb-2" />
                  <p>
                    Nenhuma descrição ainda. Clique em "Editar" para adicionar
                    informações sobre o personagem.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Character Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Aparições</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{characterScenes.length}</div>
            <p className="text-xs text-muted-foreground">cenas onde aparece</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Capítulos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{relatedChapters.length}</div>
            <p className="text-xs text-muted-foreground">
              capítulos relacionados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Criado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {new Date(character.created_at).toLocaleDateString("pt-BR")}
            </div>
            <p className="text-xs text-muted-foreground">
              última atualização:{" "}
              {new Date(character.updated_at).toLocaleDateString("pt-BR")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Related Scenes */}
      {characterScenes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Cenas Relacionadas</h2>
          <div className="grid gap-4">
            {characterScenes.map((scene) => {
              const chapter = state.chapters.find(
                (c) => c.id === scene.chapter_id
              );
              return (
                <Card
                  key={scene.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant="secondary">
                          {chapter?.title || "Capítulo"}
                        </Badge>
                        <CardTitle className="text-lg">{scene.title}</CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => console.log("Ir para cena:", scene.id)}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {scene.content ? (
                        <>
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {scene.content}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{getWordCount(scene.content)} palavras</span>
                            <span>
                              Atualizada{" "}
                              {new Date(scene.updated_at).toLocaleDateString(
                                "pt-BR"
                              )}
                            </span>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          Cena sem conteúdo.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Related Chapters */}
      {relatedChapters.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Capítulos Relacionados</h2>
          <div className="grid gap-4">
            {relatedChapters.map((chapter) => {
              const chapterScenes = characterScenes.filter(
                (s) => s.chapter_id === chapter.id
              );
              return (
                <Card
                  key={chapter.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center">
                        <BookOpen className="mr-2 h-4 w-4" />
                        {chapter.title}
                      </CardTitle>
                      <Badge variant="outline">
                        {chapterScenes.length} cenas
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {chapter.description ? (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {chapter.description}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          Sem descrição
                        </p>
                      )}
                      <div className="text-xs text-muted-foreground">
                        Atualizado{" "}
                        {new Date(chapter.updated_at).toLocaleDateString(
                          "pt-BR"
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default CharacterEditor;
