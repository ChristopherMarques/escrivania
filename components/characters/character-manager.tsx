"use client";

import { Button } from "@/components/ui/button";

import { useIntegratedProject } from "@/lib/contexts/integrated-project-context";
import type { ICharacter } from "@/lib/types";
import { Loader2, Plus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CharacterDetail } from "./character-detail";
import { CharacterForm } from "./character-form";
import { CharacterList } from "./character-list";

type ViewMode = "list" | "detail" | "form";
type FormMode = "create" | "edit";

export function CharacterManager() {
  const {
    characters,
    isLoadingCharacters,
    createCharacter,
    updateCharacter,
    deleteCharacter,
  } = useIntegratedProject();

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [selectedCharacter, setSelectedCharacter] = useState<ICharacter | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreateNew = () => {
    setSelectedCharacter(null);
    setFormMode("create");
    setViewMode("form");
  };

  const handleEdit = (character: ICharacter) => {
    setSelectedCharacter(character);
    setFormMode("edit");
    setViewMode("form");
  };

  const handleView = (character: ICharacter) => {
    setSelectedCharacter(character);
    setViewMode("detail");
  };

  const handleSave = async (characterData: Partial<ICharacter>) => {
    setIsSubmitting(true);
    try {
      if (formMode === "create") {
        await createCharacter(characterData as unknown as string);
        toast("Personagem criado");
      } else if (selectedCharacter) {
        await updateCharacter(selectedCharacter.id, characterData);
        toast("Personagem atualizado");
      }
      setViewMode("list");
      setSelectedCharacter(null);
    } catch (error) {
      toast(
        `Erro ao ${formMode === "create" ? "criar" : "atualizar"} personagem. ${error}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (character: ICharacter) => {
    setIsDeleting(true);
    try {
      await deleteCharacter(character.id);
      toast("Personagem excluído");
      setViewMode("list");
      setSelectedCharacter(null);
    } catch (error) {
      toast(`Erro ao excluir personagem. ${error}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setViewMode("list");
    setSelectedCharacter(null);
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedCharacter(null);
  };

  if (isLoadingCharacters) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-escrivania-purple-50 to-escrivania-blue-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-escrivania-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando personagens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {viewMode === "list" && (
        <div className="h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/20 bg-white/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                  <Users className="w-7 h-7 text-escrivania-purple-600" />
                  <span>Personagens</span>
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Gerencie os personagens da sua história
                </p>
              </div>
              <Button
                onClick={handleCreateNew}
                className="bg-escrivania-purple-600 hover:bg-escrivania-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Personagem
              </Button>
            </div>
          </div>

          {/* Character List */}
          <div className="flex-1">
            <CharacterList
              characters={characters || []}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      )}

      {viewMode === "form" && (
        <CharacterForm
          character={selectedCharacter || undefined}
          allCharacters={characters || []}
          onSave={handleSave}
          onCancel={handleCancel}
          isLoading={isSubmitting}
          mode={formMode}
        />
      )}

      {viewMode === "detail" && selectedCharacter && (
        <CharacterDetail
          character={selectedCharacter}
          allCharacters={characters || []}
          onEdit={() => handleEdit(selectedCharacter)}
          onDelete={() => handleDelete(selectedCharacter)}
          onClose={handleBackToList}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
