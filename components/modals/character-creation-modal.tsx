"use client";

import { CharacterForm } from "@/components/characters/character-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIntegratedProject } from "@/lib/contexts/integrated-project-context";
import type { ICharacter } from "@/lib/types";
import { User } from "lucide-react";
import { useState } from "react";

interface CharacterCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCharacterCreated?: (character: ICharacter) => void;
}

export function CharacterCreationModal({
  isOpen,
  onClose,
  onCharacterCreated,
}: CharacterCreationModalProps) {
  const { addCharacter } = useIntegratedProject();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCharacterSubmit = async (characterData: Partial<ICharacter>) => {
    setIsSubmitting(true);
    try {
      const newCharacter = await addCharacter(characterData);
      onCharacterCreated?.(newCharacter);
      onClose();
    } catch (error) {
      console.error("Erro ao criar personagem:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[90vw] lg:max-w-[85vw] xl:max-w-[80vw] 2xl:max-w-[75vw] h-[95vh] max-h-[95vh] p-0 gap-0 bg-gradient-to-br from-background via-background to-primary/5 border-border shadow-2xl">
        <DialogHeader className="px-6 py-4 border-b border-border bg-gradient-to-r from-primary/5 to-secondary/5">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold">
            <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg shadow-lg">
              <User className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Criar Novo Personagem
            </span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1 text-sm leading-relaxed">
            Adicione um novo personagem ao seu projeto. Preencha as informações
            básicas e desenvolva a personalidade do seu personagem.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <CharacterForm
            onSubmit={handleCharacterSubmit}
            onCancel={onClose}
            isSubmitting={isSubmitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
