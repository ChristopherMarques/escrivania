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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ICharacter } from "@/lib/types";
import {
  AlertTriangle,
  BookOpen,
  Brain,
  Calendar,
  Crown,
  Edit,
  Heart,
  Network,
  Palette,
  Shield,
  Sword,
  Target,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";

interface CharacterDetailProps {
  character: ICharacter;
  allCharacters?: ICharacter[];
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
  isDeleting?: boolean;
}

const relationshipTypes = [
  {
    value: "ally",
    label: "Aliado",
    icon: Shield,
    color: "bg-escrivania-blue-100 text-escrivania-blue-700",
  },
  {
    value: "enemy",
    label: "Inimigo",
    icon: Sword,
    color: "bg-destructive/20 text-destructive",
  },
  {
    value: "romantic",
    label: "Romântico",
    icon: Heart,
    color: "bg-escrivania-purple-100 text-escrivania-purple-700",
  },
  {
    value: "family",
    label: "Família",
    icon: Users,
    color: "bg-escrivania-blue-200 text-escrivania-blue-800",
  },
  {
    value: "mentor",
    label: "Mentor",
    icon: Crown,
    color: "bg-escrivania-purple-200 text-escrivania-purple-800",
  },
  {
    value: "rival",
    label: "Rival",
    icon: Target,
    color: "bg-escrivania-purple-300 text-escrivania-purple-900",
  },
];

export function CharacterDetail({
  character,
  allCharacters = [],
  onEdit,
  onDelete,
  onClose,
  isDeleting = false,
}: CharacterDetailProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const getRelationshipType = (typeValue: string) => {
    return relationshipTypes.find((type) => type.value === typeValue);
  };

  const getCharacterById = (id: string) => {
    return allCharacters.find((char) => char.id === id);
  };

  const handleDelete = () => {
    onDelete();
    setShowDeleteDialog(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-escrivania-purple-50 to-escrivania-blue-50">
      {/* Header */}
      <div className="p-6 border-b border-white/20 bg-white/40 backdrop-blur-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <Avatar className="w-16 h-16 ring-4 ring-escrivania-purple-100">
              <AvatarImage src={character.avatarUrl || "/placeholder.svg"} />
              <AvatarFallback className="bg-escrivania-purple-50 text-escrivania-purple-700 text-xl font-bold">
                {character.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {character.name}
              </h1>
              <p className="text-lg text-escrivania-purple-700 font-medium">
                {character.role}
              </p>
              {character.archetype && (
                <Badge className="mt-2 bg-escrivania-purple-100 text-escrivania-purple-700">
                  {character.archetype}
                </Badge>
              )}
              <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Criado em{" "}
                    {formatDate(
                      character.createdAt || new Date().toISOString()
                    )}
                  </span>
                </div>
                {character.updatedAt &&
                  character.updatedAt !== character.createdAt && (
                    <div className="flex items-center space-x-1">
                      <Edit className="w-4 h-4" />
                      <span>
                        Atualizado em {formatDate(character.updatedAt)}
                      </span>
                    </div>
                  )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={onEdit}
              className="border-escrivania-purple-200 text-escrivania-purple-700 hover:bg-escrivania-purple-50"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(true)}
              className="border-red-200 text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-gray-500 hover:bg-gray-100"
            >
              ✕
            </Button>
          </div>
        </div>
      </div>

      {/* Description */}
      {character.description && (
        <div className="p-6 border-b border-white/20 bg-white/30 backdrop-blur-sm">
          <div className="flex items-start space-x-3">
            <BookOpen className="w-5 h-5 text-escrivania-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Descrição Geral
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {character.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Character Details Tabs */}
      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="general" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4 bg-white/50 mx-6 mt-4">
            <TabsTrigger
              value="general"
              className="flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>Geral</span>
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="flex items-center space-x-2"
            >
              <Palette className="w-4 h-4" />
              <span>Aparência</span>
            </TabsTrigger>
            <TabsTrigger
              value="psychology"
              className="flex items-center space-x-2"
            >
              <Brain className="w-4 h-4" />
              <span>Psicologia</span>
            </TabsTrigger>
            <TabsTrigger
              value="relationships"
              className="flex items-center space-x-2"
            >
              <Network className="w-4 h-4" />
              <span>Relações</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 p-6">
            <TabsContent value="general" className="space-y-6 mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {character.archetype && (
                  <Card className="bg-white/50 backdrop-blur-sm border-white/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-700">
                        Arquétipo
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-lg font-semibold text-gray-900">
                        {character.archetype}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {character.conflict && (
                  <Card className="bg-white/50 backdrop-blur-sm border-white/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Conflito Principal</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-900">{character.conflict}</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {character.biography && (
                <Card className="bg-white/50 backdrop-blur-sm border-white/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                      <BookOpen className="w-4 h-4" />
                      <span>Biografia e História</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                      {character.biography}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6 mt-0">
              <div className="space-y-6">
                {character.appearance?.physical && (
                  <Card className="bg-white/50 backdrop-blur-sm border-white/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-700">
                        Descrição Física
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                        {character.appearance.physical}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {character.appearance?.clothing && (
                  <Card className="bg-white/50 backdrop-blur-sm border-white/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-700">
                        Estilo de Vestimenta
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                        {character.appearance.clothing}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {character.appearance?.mannerisms && (
                  <Card className="bg-white/50 backdrop-blur-sm border-white/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-700">
                        Maneirismos e Gestos
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                        {character.appearance.mannerisms}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {!character.appearance?.physical &&
                  !character.appearance?.clothing &&
                  !character.appearance?.mannerisms && (
                    <Card className="bg-white/30 backdrop-blur-sm border-white/30">
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <Palette className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-gray-500 text-center">
                          Nenhuma informação de aparência foi definida ainda.
                        </p>
                        <Button
                          variant="outline"
                          onClick={onEdit}
                          className="mt-4 border-escrivania-purple-200 text-escrivania-purple-700 hover:bg-escrivania-purple-50"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Adicionar Descrição
                        </Button>
                      </CardContent>
                    </Card>
                  )}
              </div>
            </TabsContent>

            <TabsContent value="psychology" className="space-y-6 mt-0">
              <div className="space-y-6">
                {character.motivation?.internal && (
                  <Card className="bg-white/50 backdrop-blur-sm border-white/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                        <Brain className="w-4 h-4" />
                        <span>Motivação Interna</span>
                      </CardTitle>
                      <CardDescription className="text-xs">
                        O que move o personagem emocionalmente
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                        {character.motivation.internal}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {character.motivation?.external && (
                  <Card className="bg-white/50 backdrop-blur-sm border-white/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                        <Target className="w-4 h-4" />
                        <span>Motivação Externa</span>
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Objetivos tangíveis que movem a trama
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                        {character.motivation.external}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {!character.motivation?.internal &&
                  !character.motivation?.external && (
                    <Card className="bg-white/30 backdrop-blur-sm border-white/30">
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <Brain className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-gray-500 text-center">
                          Nenhuma motivação foi definida ainda.
                        </p>
                        <Button
                          variant="outline"
                          onClick={onEdit}
                          className="mt-4 border-escrivania-purple-200 text-escrivania-purple-700 hover:bg-escrivania-purple-50"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Definir Motivações
                        </Button>
                      </CardContent>
                    </Card>
                  )}
              </div>
            </TabsContent>

            <TabsContent value="relationships" className="space-y-6 mt-0">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Relacionamentos
                    </h3>
                    <p className="text-sm text-gray-600">
                      Relações com outros personagens
                    </p>
                  </div>
                  {(character.relationships || []).length > 0 && (
                    <Badge
                      variant="secondary"
                      className="bg-escrivania-purple-100 text-escrivania-purple-700"
                    >
                      {(character.relationships || []).length} relação(ões)
                    </Badge>
                  )}
                </div>

                {(character.relationships || []).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(character.relationships || []).map(
                      (relationship, index) => {
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
                            className="bg-white/50 backdrop-blur-sm border-white/30 hover:bg-white/60 transition-colors"
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-center space-x-3">
                                <Avatar className="w-12 h-12">
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
                                <div className="flex-1">
                                  <CardTitle className="text-base">
                                    {relatedCharacter.name}
                                  </CardTitle>
                                  <CardDescription className="text-sm">
                                    {relatedCharacter.role}
                                  </CardDescription>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="flex items-center space-x-2 mb-3">
                                <Icon className="w-4 h-4" />
                                <Badge
                                  className={`text-xs ${relationshipType.color}`}
                                >
                                  {relationshipType.label}
                                </Badge>
                              </div>
                              {relationship.description && (
                                <p className="text-sm text-gray-600 leading-relaxed">
                                  {relationship.description}
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        );
                      }
                    )}
                  </div>
                ) : (
                  <Card className="bg-white/30 backdrop-blur-sm border-white/30">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Network className="w-12 h-12 text-gray-300 mb-4" />
                      <p className="text-gray-500 text-center mb-4">
                        Nenhum relacionamento foi definido ainda.
                      </p>
                      <Button
                        variant="outline"
                        onClick={onEdit}
                        className="border-escrivania-purple-200 text-escrivania-purple-700 hover:bg-escrivania-purple-50"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Adicionar Relacionamentos
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              <span>Confirmar Exclusão</span>
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o personagem{" "}
              <strong>{character.name}</strong>? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isDeleting ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
