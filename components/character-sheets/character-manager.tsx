"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Edit3, MoreVertical, Plus, Trash2, User, Users } from "lucide-react";
import React from "react";

interface Character {
  id: string;
  name: string;
  role: "protagonist" | "antagonist" | "supporting" | "minor";
  description: string;
  appearance: string;
  personality: string;
  background: string;
  goals: string;
  relationships: string;
  notes: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CharacterManagerProps {
  characters: Character[];
  onCharacterCreate: (
    character: Omit<Character, "id" | "createdAt" | "updatedAt">
  ) => void;
  onCharacterUpdate: (id: string, updates: Partial<Character>) => void;
  onCharacterDelete: (id: string) => void;
  className?: string;
}

const characterRoles = [
  { value: "protagonist", label: "Protagonista", color: "bg-blue-500" },
  { value: "antagonist", label: "Antagonista", color: "bg-red-500" },
  { value: "supporting", label: "Coadjuvante", color: "bg-green-500" },
  { value: "minor", label: "Secundário", color: "bg-gray-500" },
] as const;

const characterTemplates = {
  basic: {
    name: "Básico",
    fields: ["name", "role", "description", "notes"],
  },
  detailed: {
    name: "Detalhado",
    fields: [
      "name",
      "role",
      "description",
      "appearance",
      "personality",
      "background",
      "goals",
      "relationships",
      "notes",
    ],
  },
  simple: {
    name: "Simples",
    fields: ["name", "role", "description"],
  },
};

interface CharacterFormProps {
  character?: Character;
  onSave: (
    character: Omit<Character, "id" | "createdAt" | "updatedAt">
  ) => void;
  onCancel: () => void;
}

function CharacterForm({ character, onSave, onCancel }: CharacterFormProps) {
  const [formData, setFormData] = React.useState({
    name: character?.name || "",
    role: character?.role || ("supporting" as const),
    description: character?.description || "",
    appearance: character?.appearance || "",
    personality: character?.personality || "",
    background: character?.background || "",
    goals: character?.goals || "",
    relationships: character?.relationships || "",
    notes: character?.notes || "",
    imageUrl: character?.imageUrl || "",
  });

  const [selectedTemplate, setSelectedTemplate] = React.useState("detailed");
  const template =
    characterTemplates[selectedTemplate as keyof typeof characterTemplates];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const renderField = (fieldName: string) => {
    const fieldConfig = {
      name: { label: "Nome", type: "input", placeholder: "Nome do personagem" },
      role: { label: "Papel", type: "select" },
      description: {
        label: "Descrição",
        type: "textarea",
        placeholder: "Descrição geral do personagem",
      },
      appearance: {
        label: "Aparência",
        type: "textarea",
        placeholder: "Descrição física do personagem",
      },
      personality: {
        label: "Personalidade",
        type: "textarea",
        placeholder: "Traços de personalidade, maneirismos",
      },
      background: {
        label: "História",
        type: "textarea",
        placeholder: "Passado, origem, formação",
      },
      goals: {
        label: "Objetivos",
        type: "textarea",
        placeholder: "O que o personagem quer alcançar",
      },
      relationships: {
        label: "Relacionamentos",
        type: "textarea",
        placeholder: "Relações com outros personagens",
      },
      notes: {
        label: "Notas",
        type: "textarea",
        placeholder: "Observações adicionais",
      },
    };

    const config = fieldConfig[fieldName as keyof typeof fieldConfig];
    if (!config) return null;

    return (
      <div key={fieldName} className="space-y-2">
        <Label htmlFor={fieldName}>{config.label}</Label>
        {config.type === "input" && (
          <Input
            id={fieldName}
            value={formData[fieldName as keyof typeof formData]}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            placeholder={
              "placeholder" in config ? config.placeholder : undefined
            }
          />
        )}
        {config.type === "textarea" && (
          <Textarea
            id={fieldName}
            value={formData[fieldName as keyof typeof formData]}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            placeholder={
              "placeholder" in config ? config.placeholder : undefined
            }
            rows={3}
          />
        )}
        {config.type === "select" && fieldName === "role" && (
          <Select
            value={formData.role}
            onValueChange={(value) => handleFieldChange("role", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {characterRoles.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${role.color}`} />
                    {role.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Template Selection */}
      <div className="space-y-2">
        <Label>Template</Label>
        <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(characterTemplates).map(([key, template]) => (
              <SelectItem key={key} value={key}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">{template.fields.map(renderField)}</div>

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {character ? "Atualizar" : "Criar"} Personagem
        </Button>
      </div>
    </form>
  );
}

interface CharacterCardProps {
  character: Character;
  onEdit: () => void;
  onDelete: () => void;
  onSelect: () => void;
}

function CharacterCard({
  character,
  onEdit,
  onDelete,
  onSelect,
}: CharacterCardProps) {
  const roleConfig = characterRoles.find((r) => r.value === character.role);

  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{character.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={cn("text-white text-xs", roleConfig?.color)}>
                {roleConfig?.label}
              </Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              >
                <Edit3 className="h-3 w-3 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="text-red-600 dark:text-red-400"
              >
                <Trash2 className="h-3 w-3 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
          {character.description || "Sem descrição"}
        </p>
      </CardContent>
    </Card>
  );
}

interface CharacterDetailProps {
  character: Character;
  onEdit: () => void;
  onClose: () => void;
}

function CharacterDetail({ character, onEdit, onClose }: CharacterDetailProps) {
  const roleConfig = characterRoles.find((r) => r.value === character.role);

  const sections = [
    { key: "description", label: "Descrição", value: character.description },
    { key: "appearance", label: "Aparência", value: character.appearance },
    {
      key: "personality",
      label: "Personalidade",
      value: character.personality,
    },
    { key: "background", label: "História", value: character.background },
    { key: "goals", label: "Objetivos", value: character.goals },
    {
      key: "relationships",
      label: "Relacionamentos",
      value: character.relationships,
    },
    { key: "notes", label: "Notas", value: character.notes },
  ].filter((section) => section.value);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{character.name}</h2>
          <Badge className={cn("text-white mt-2", roleConfig?.color)}>
            {roleConfig?.label}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button onClick={onEdit} size="sm">
            <Edit3 className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button onClick={onClose} variant="outline" size="sm">
            Fechar
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.key}>
            <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">
              {section.label}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
              {section.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CharacterManager({
  characters,
  onCharacterCreate,
  onCharacterUpdate,
  onCharacterDelete,
  className,
}: CharacterManagerProps) {
  const [selectedCharacter, setSelectedCharacter] =
    React.useState<Character | null>(null);
  const [editingCharacter, setEditingCharacter] =
    React.useState<Character | null>(null);
  const [isCreating, setIsCreating] = React.useState(false);
  const [filterRole, setFilterRole] = React.useState<string>("all");

  const filteredCharacters = characters.filter(
    (char) => filterRole === "all" || char.role === filterRole
  );

  const handleCreate = (
    characterData: Omit<Character, "id" | "createdAt" | "updatedAt">
  ) => {
    onCharacterCreate(characterData);
    setIsCreating(false);
  };

  const handleUpdate = (
    characterData: Omit<Character, "id" | "createdAt" | "updatedAt">
  ) => {
    if (editingCharacter) {
      onCharacterUpdate(editingCharacter.id, characterData);
      setEditingCharacter(null);
      setSelectedCharacter(null);
    }
  };

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
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Personagens
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {characters.length} personagens
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os papéis</SelectItem>
              {characterRoles.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setIsCreating(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Personagem
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {selectedCharacter ? (
          <div className="h-full overflow-y-auto p-6">
            <CharacterDetail
              character={selectedCharacter}
              onEdit={() => setEditingCharacter(selectedCharacter)}
              onClose={() => setSelectedCharacter(null)}
            />
          </div>
        ) : (
          <div className="h-full overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCharacters.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  onSelect={() => setSelectedCharacter(character)}
                  onEdit={() => setEditingCharacter(character)}
                  onDelete={() => onCharacterDelete(character.id)}
                />
              ))}
            </div>

            {filteredCharacters.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <User className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-sm text-center">
                  {filterRole === "all"
                    ? 'Nenhum personagem criado ainda.\nClique em "Novo Personagem" para começar.'
                    : "Nenhum personagem encontrado para este filtro."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Personagem</DialogTitle>
          </DialogHeader>
          <CharacterForm
            onSave={handleCreate}
            onCancel={() => setIsCreating(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingCharacter}
        onOpenChange={() => setEditingCharacter(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Personagem</DialogTitle>
          </DialogHeader>
          {editingCharacter && (
            <CharacterForm
              character={editingCharacter}
              onSave={handleUpdate}
              onCancel={() => setEditingCharacter(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
