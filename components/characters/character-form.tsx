"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { ICharacter } from "@/lib/types";
import {
  Crown,
  Heart,
  Plus,
  Save,
  Shield,
  Sword,
  Target,
  Trash2,
  Upload,
  Users,
  Wand2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

interface CharacterFormProps {
  character?: ICharacter;
  allCharacters?: ICharacter[];
  onSubmit: (character: Partial<ICharacter>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
}

const archetypes = [
  "Herói",
  "Mentor",
  "Guardião",
  "Arauto",
  "Metamorfo",
  "Sombra",
  "Trapaceiro",
  "Aliado",
];

const relationshipTypes = [
  {
    value: "ally",
    label: "Aliado",
    icon: Shield,
    color: "bg-secondary/20 text-secondary-foreground",
    description: "Personagem que ajuda o protagonista",
  },
  {
    value: "enemy",
    label: "Inimigo",
    icon: Sword,
    color: "bg-destructive/20 text-destructive",
    description: "Personagem que se opõe ao protagonista",
  },
  {
    value: "romantic",
    label: "Romântico",
    icon: Heart,
    color: "bg-primary/20 text-primary-foreground",
    description: "Interesse romântico ou parceiro",
  },
  {
    value: "family",
    label: "Família",
    icon: Users,
    color: "bg-secondary/30 text-secondary-foreground",
    description: "Membro da família ou parente",
  },
  {
    value: "mentor",
    label: "Mentor",
    icon: Crown,
    color: "bg-primary/30 text-primary-foreground",
    description: "Guia ou professor do personagem",
  },
  {
    value: "rival",
    label: "Rival",
    icon: Target,
    color: "bg-primary/40 text-primary-foreground",
    description: "Competidor ou rival amigável",
  },
];

export function CharacterForm({
  character,
  allCharacters = [],
  onSubmit,
  onCancel,
  isSubmitting = false,
  mode = "create",
}: CharacterFormProps) {
  const [formData, setFormData] = useState<Partial<ICharacter>>({
    name: "",
    role: "",
    description: "",
    archetype: "",
    conflict: "",
    motivation: {
      internal: "",
      external: "",
    },
    appearance: {
      physical: "",
      clothing: "",
      mannerisms: "",
    },
    biography: "",
    relationships: [],
    avatarUrl: "",
  });

  const [isGeneratingPortrait, setIsGeneratingPortrait] = useState(false);
  const [isAddRelationshipOpen, setIsAddRelationshipOpen] = useState(false);
  const [selectedCharacterForRelation, setSelectedCharacterForRelation] =
    useState("");
  const [selectedRelationType, setSelectedRelationType] = useState<string>("");
  const [relationDescription, setRelationDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (character && mode === "edit") {
      setFormData({
        ...character,
        motivation: character.motivation || { internal: "", external: "" },
        appearance: character.appearance || {
          physical: "",
          clothing: "",
          mannerisms: "",
        },
        relationships: character.relationships || [],
      });
    }
  }, [character, mode]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!formData.role?.trim()) {
      newErrors.role = "Papel na história é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const updateFormData = (updates: Partial<ICharacter>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    // Limpar erros relacionados aos campos atualizados
    const updatedFields = Object.keys(updates);
    setErrors((prev) => {
      const newErrors = { ...prev };
      updatedFields.forEach((field) => {
        delete newErrors[field];
      });
      return newErrors;
    });
  };

  const generatePortrait = async () => {
    setIsGeneratingPortrait(true);
    // Simular geração de retrato com IA
    setTimeout(() => {
      const portraitUrl = `/placeholder.svg?height=200&width=200&query=portrait of ${formData.name}`;
      updateFormData({ avatarUrl: portraitUrl });
      setIsGeneratingPortrait(false);
    }, 2000);
  };

  const addRelationship = () => {
    if (!selectedCharacterForRelation || !selectedRelationType) return;

    const newRelationships = [
      ...(formData.relationships || []),
      {
        characterId: selectedCharacterForRelation,
        type: selectedRelationType as any,
        description: relationDescription,
      },
    ];

    updateFormData({ relationships: newRelationships });
    setSelectedCharacterForRelation("");
    setSelectedRelationType("");
    setRelationDescription("");
    setIsAddRelationshipOpen(false);
  };

  const removeRelationship = (characterId: string) => {
    const updatedRelationships = (formData.relationships || []).filter(
      (rel) => rel.characterId !== characterId
    );
    updateFormData({ relationships: updatedRelationships });
  };

  const getRelationshipType = (typeValue: string) => {
    return relationshipTypes.find((type) => type.value === typeValue);
  };

  const getCharacterById = (id: string) => {
    return allCharacters.find((char) => char.id === id);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-escrivania-purple-50 to-escrivania-blue-50">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-escrivania-purple-100/30 bg-gradient-to-r from-escrivania-purple-50/80 to-escrivania-blue-50/80 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex-1">
            <h2 className="text-xl lg:text-2xl font-bold text-escrivania-purple-900">
              {mode === "create" ? "Novo Personagem" : "Editar Personagem"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "create"
                ? "Crie um novo personagem para sua história"
                : "Edite as informações do personagem"}
            </p>
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="shadow-lg flex-1 sm:flex-none"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </div>

      {/* Character Avatar and Basic Info */}
      <div className="p-4 lg:p-6 border-b border-white/20 bg-white/30 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row items-start space-y-6 lg:space-y-0 lg:space-x-8">
          <div className="flex flex-col items-center space-y-3 w-full lg:w-auto">
            <Avatar className="w-20 h-20 lg:w-28 lg:h-28 ring-4 ring-primary/20">
              <AvatarImage src={formData.avatarUrl || "/placeholder.svg"} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl lg:text-3xl font-bold">
                {formData.name?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={generatePortrait}
                disabled={isGeneratingPortrait}
                className="text-xs"
              >
                <Wand2 className="w-3 h-3 mr-1" />
                {isGeneratingPortrait ? "Gerando..." : "IA"}
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <Upload className="w-3 h-3 mr-1" />
                Upload
              </Button>
            </div>
          </div>

          <div className="flex-1 w-full space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Nome do Personagem *
                </Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => updateFormData({ name: e.target.value })}
                  placeholder="Ex: Maria Silva"
                  className={`mt-1 bg-white/70 border-gray-200 focus:border-escrivania-purple-300 ${
                    errors.name ? "border-red-300 focus:border-red-300" : ""
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="role"
                  className="text-sm font-medium text-gray-700"
                >
                  Papel na História *
                </Label>
                <Input
                  id="role"
                  value={formData.role || ""}
                  onChange={(e) => updateFormData({ role: e.target.value })}
                  placeholder="Ex: Protagonista, Antagonista, Coadjuvante"
                  className={`mt-1 bg-white/70 border-gray-200 focus:border-escrivania-purple-300 ${
                    errors.role ? "border-red-300 focus:border-red-300" : ""
                  }`}
                />
                {errors.role && (
                  <p className="text-xs text-red-600 mt-1">{errors.role}</p>
                )}
              </div>
            </div>

            <div>
              <Label
                htmlFor="description"
                className="text-sm font-medium text-gray-700"
              >
                Descrição Geral
              </Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) =>
                  updateFormData({ description: e.target.value })
                }
                placeholder="Descreva brevemente o personagem, sua personalidade e importância na história..."
                className="mt-1 bg-white/70 border-gray-200 focus:border-escrivania-purple-300 min-h-[60px] lg:min-h-[80px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Character Details Tabs */}
      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="general" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-white/50 mx-4 lg:mx-6 mt-4">
            <TabsTrigger value="general" className="text-xs sm:text-sm">
              Geral
            </TabsTrigger>
            <TabsTrigger value="appearance" className="text-xs sm:text-sm">
              Aparência
            </TabsTrigger>
            <TabsTrigger value="psychology" className="text-xs sm:text-sm">
              Psicologia
            </TabsTrigger>
            <TabsTrigger value="relationships" className="text-xs sm:text-sm">
              Relações
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 p-4 lg:p-6">
            <TabsContent value="general" className="space-y-6 mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <Label
                    htmlFor="archetype"
                    className="text-sm font-medium text-gray-700"
                  >
                    Arquétipo
                  </Label>
                  <Select
                    value={formData.archetype || ""}
                    onValueChange={(value) =>
                      updateFormData({ archetype: value })
                    }
                  >
                    <SelectTrigger className="mt-2 bg-white/70 border-gray-200 focus:border-escrivania-purple-300">
                      <SelectValue placeholder="Selecione um arquétipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/90 backdrop-blur-xl border-white/20">
                      {archetypes.map((archetype) => (
                        <SelectItem key={archetype} value={archetype}>
                          {archetype}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    O arquétipo ajuda a definir o papel narrativo do personagem
                  </p>
                </div>

                <div>
                  <Label
                    htmlFor="conflict"
                    className="text-sm font-medium text-gray-700"
                  >
                    Conflito Principal
                  </Label>
                  <Input
                    id="conflict"
                    value={formData.conflict || ""}
                    onChange={(e) =>
                      updateFormData({ conflict: e.target.value })
                    }
                    placeholder="Ex: Medo de não ser aceito pela família"
                    className="mt-2 bg-white/70 border-gray-200 focus:border-escrivania-purple-300"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    O principal obstáculo interno ou externo do personagem
                  </p>
                </div>

                <div>
                  <Label
                    htmlFor="motivation"
                    className="text-sm font-medium text-gray-700"
                  >
                    Motivação Principal
                  </Label>
                  <Input
                    id="motivation"
                    value={formData.motivation || ""}
                    onChange={(e) =>
                      updateFormData({ motivation: e.target.value })
                    }
                    placeholder="Ex: Proteger sua família"
                    className="mt-2 bg-white/70 border-gray-200 focus:border-escrivania-purple-300"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    O que move o personagem a agir
                  </p>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="biography"
                  className="text-sm font-medium text-gray-700"
                >
                  Biografia e História
                </Label>
                <Textarea
                  id="biography"
                  value={formData.biography || ""}
                  onChange={(e) =>
                    updateFormData({ biography: e.target.value })
                  }
                  placeholder="Conte a história de vida do personagem, eventos importantes, formação, experiências que moldaram sua personalidade..."
                  className="mt-2 bg-white/70 border-gray-200 focus:border-escrivania-purple-300 min-h-[120px]"
                />
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6 mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="physical"
                    className="text-sm font-medium text-gray-700"
                  >
                    Descrição Física
                  </Label>
                  <Textarea
                    id="physical"
                    value={formData.appearance?.physical || ""}
                    onChange={(e) =>
                      updateFormData({
                        appearance: {
                          ...formData.appearance,
                          physical: e.target.value,
                        },
                      })
                    }
                    placeholder="Altura, peso, cor dos olhos e cabelo, características marcantes, cicatrizes, tatuagens..."
                    className="mt-2 bg-white/70 border-gray-200 focus:border-escrivania-purple-300 min-h-[120px] lg:min-h-[140px]"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="clothing"
                    className="text-sm font-medium text-gray-700"
                  >
                    Estilo de Vestimenta
                  </Label>
                  <Textarea
                    id="clothing"
                    value={formData.appearance?.clothing || ""}
                    onChange={(e) =>
                      updateFormData({
                        appearance: {
                          ...formData.appearance,
                          clothing: e.target.value,
                        },
                      })
                    }
                    placeholder="Como o personagem se veste? Cores preferidas, estilo, acessórios característicos..."
                    className="mt-2 bg-white/70 border-gray-200 focus:border-escrivania-purple-300 min-h-[100px] lg:min-h-[120px]"
                  />
                </div>
              </div>

              <div className="mt-6">
                <Label
                  htmlFor="mannerisms"
                  className="text-sm font-medium text-gray-700"
                >
                  Maneirismos e Gestos
                </Label>
                <Textarea
                  id="mannerisms"
                  value={formData.appearance?.mannerisms || ""}
                  onChange={(e) =>
                    updateFormData({
                      appearance: {
                        ...formData.appearance,
                        mannerisms: e.target.value,
                      },
                    })
                  }
                  placeholder="Gestos característicos, forma de andar, expressões faciais, vícios de linguagem..."
                  className="mt-2 bg-white/70 border-gray-200 focus:border-escrivania-purple-300 min-h-[80px] lg:min-h-[100px]"
                />
              </div>
            </TabsContent>

            <TabsContent value="psychology" className="space-y-6 mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="internal-motivation"
                    className="text-sm font-medium text-gray-700"
                  >
                    Motivação Interna
                  </Label>
                  <Textarea
                    id="internal-motivation"
                    value={formData.motivation?.internal || ""}
                    onChange={(e) =>
                      updateFormData({
                        motivation: {
                          ...formData.motivation,
                          internal: e.target.value,
                        },
                      })
                    }
                    placeholder="O que o personagem realmente deseja internamente? Seus medos, sonhos, necessidades emocionais..."
                    className="mt-2 bg-white/70 border-gray-200 focus:border-escrivania-purple-300 min-h-[120px] lg:min-h-[140px]"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    A motivação interna é o que move o personagem emocionalmente
                  </p>
                </div>

                <div>
                  <Label
                    htmlFor="external-motivation"
                    className="text-sm font-medium text-gray-700"
                  >
                    Motivação Externa
                  </Label>
                  <Textarea
                    id="external-motivation"
                    value={formData.motivation?.external || ""}
                    onChange={(e) =>
                      updateFormData({
                        motivation: {
                          ...formData.motivation,
                          external: e.target.value,
                        },
                      })
                    }
                    placeholder="O que o personagem precisa alcançar na história? Objetivos concretos, metas práticas..."
                    className="mt-2 bg-white/70 border-gray-200 focus:border-escrivania-purple-300 min-h-[120px] lg:min-h-[140px]"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    A motivação externa é o objetivo tangível que move a trama
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="relationships" className="space-y-6 mt-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Relacionamentos
                  </h3>
                  <p className="text-sm text-gray-600">
                    Defina as relações com outros personagens
                  </p>
                </div>
                <Button
                  onClick={() => setIsAddRelationshipOpen(true)}
                  disabled={allCharacters.length === 0}
                  className="bg-escrivania-purple-600 hover:bg-escrivania-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Relação
                </Button>
              </div>

              {allCharacters.length === 0 && (
                <Card className="bg-white/30 backdrop-blur-sm border-white/30">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <Users className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 text-center">
                      Crie outros personagens primeiro para definir
                      relacionamentos.
                    </p>
                  </CardContent>
                </Card>
              )}

              {(formData.relationships || []).length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(formData.relationships || []).map((relationship, index) => {
                    const relatedCharacter = getCharacterById(
                      relationship.characterId
                    );
                    const relationshipType = getRelationshipType(
                      relationship.type
                    );

                    if (!relatedCharacter || !relationshipType) return null;

                    const Icon = relationshipType.icon;

                    return (
                      <Card
                        key={`${relationship.characterId}-${index}`}
                        className="bg-white/50 backdrop-blur-sm border-white/30"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage
                                  src={
                                    relatedCharacter.avatarUrl ||
                                    "/placeholder.svg"
                                  }
                                />
                                <AvatarFallback className="bg-escrivania-purple-50 text-escrivania-purple-700">
                                  {relatedCharacter.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle className="text-sm">
                                  {relatedCharacter.name}
                                </CardTitle>
                                <CardDescription className="text-xs">
                                  {relatedCharacter.role}
                                </CardDescription>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                removeRelationship(relationship.characterId)
                              }
                              className="text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <Icon className="w-4 h-4" />
                            <Badge
                              className={`text-xs ${relationshipType.color}`}
                            >
                              {relationshipType.label}
                            </Badge>
                          </div>
                          {relationship.description && (
                            <p className="text-sm text-gray-600">
                              {relationship.description}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {(formData.relationships || []).length === 0 &&
                allCharacters.length > 0 && (
                  <Card className="bg-white/30 backdrop-blur-sm border-white/30">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <Users className="w-12 h-12 text-gray-300 mb-4" />
                      <p className="text-gray-500 text-center mb-4">
                        Nenhum relacionamento definido ainda.
                      </p>
                      <Button
                        onClick={() => setIsAddRelationshipOpen(true)}
                        variant="outline"
                        className="border-escrivania-purple-200 text-escrivania-purple-700 hover:bg-escrivania-purple-50"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Primeira Relação
                      </Button>
                    </CardContent>
                  </Card>
                )}
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Add Relationship Dialog */}
      <Dialog
        open={isAddRelationshipOpen}
        onOpenChange={setIsAddRelationshipOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Relacionamento</DialogTitle>
            <DialogDescription>
              Defina a relação entre {formData.name || "este personagem"} e
              outro personagem.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="related-character">Personagem</Label>
              <Select
                value={selectedCharacterForRelation}
                onValueChange={setSelectedCharacterForRelation}
              >
                <SelectTrigger className="bg-white/70 border-gray-200 focus:border-escrivania-purple-300">
                  <SelectValue placeholder="Selecione um personagem" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-xl border-white/20">
                  {allCharacters
                    .filter((char) => char.id !== character?.id)
                    .filter(
                      (char) =>
                        !(formData.relationships || []).some(
                          (rel) => rel.characterId === char.id
                        )
                    )
                    .map((char) => (
                      <SelectItem key={char.id} value={char.id}>
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage
                              src={char.avatarUrl || "/placeholder.svg"}
                            />
                            <AvatarFallback className="text-xs">
                              {char.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{char.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="relationship-type">Tipo de Relação</Label>
              <Select
                value={selectedRelationType}
                onValueChange={setSelectedRelationType}
              >
                <SelectTrigger className="bg-white/70 border-gray-200 focus:border-escrivania-purple-300">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-xl border-white/20">
                  {relationshipTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4" />
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-gray-500">
                              {type.description}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="relation-description">Descrição (Opcional)</Label>
              <Textarea
                id="relation-description"
                value={relationDescription}
                onChange={(e) => setRelationDescription(e.target.value)}
                placeholder="Descreva a natureza específica desta relação..."
                className="bg-white/70 border-gray-200 focus:border-escrivania-purple-300 min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddRelationshipOpen(false);
                setSelectedCharacterForRelation("");
                setSelectedRelationType("");
                setRelationDescription("");
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={addRelationship}
              disabled={!selectedCharacterForRelation || !selectedRelationType}
              className="bg-escrivania-purple-600 hover:bg-escrivania-purple-700"
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
