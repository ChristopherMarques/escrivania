"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ICharacter } from "@/lib/types";
import {
  Crown,
  Edit3,
  Eye,
  Filter,
  Grid3X3,
  Heart,
  List,
  MoreVertical,
  Plus,
  Search,
  Shield,
  Sword,
  Target,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";

interface CharacterListProps {
  characters: ICharacter[];
  isLoading?: boolean;
  onCharacterSelect?: (character: ICharacter) => void;
  onCharacterEdit?: (character: ICharacter) => void;
  onCharacterDelete?: (characterId: string) => void;
  onCreateCharacter?: () => void;
  showCreateButton?: boolean;
  viewMode?: "grid" | "list";
}

const archetypes = [
  "Todos",
  "Herói",
  "Mentor",
  "Guardião",
  "Arauto",
  "Metamorfo",
  "Sombra",
  "Trapaceiro",
  "Aliado",
];

const relationshipIcons = {
  ally: Shield,
  enemy: Sword,
  romantic: Heart,
  family: Users,
  mentor: Crown,
  rival: Target,
};

const relationshipColors = {
  ally: "bg-escrivania-blue-100 text-escrivania-blue-700",
  enemy: "bg-destructive/20 text-destructive",
  romantic: "bg-escrivania-purple-100 text-escrivania-purple-700",
  family: "bg-escrivania-blue-200 text-escrivania-blue-800",
  mentor: "bg-escrivania-purple-200 text-escrivania-purple-800",
  rival: "bg-escrivania-purple-300 text-escrivania-purple-900",
};

export function CharacterList({
  characters,
  isLoading = false,
  onCharacterSelect,
  onCharacterEdit,
  onCharacterDelete,
  onCreateCharacter,
  showCreateButton = true,
  viewMode = "grid",
}: CharacterListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArchetype, setSelectedArchetype] = useState("Todos");
  const [currentViewMode, setCurrentViewMode] = useState(viewMode);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [characterToDelete, setCharacterToDelete] = useState<ICharacter | null>(
    null
  );

  // Filtrar personagens
  const filteredCharacters = characters.filter((character) => {
    const matchesSearch =
      character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (character.description &&
        character.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (character.role &&
        character.role.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesArchetype =
      selectedArchetype === "Todos" ||
      character.archetype === selectedArchetype;

    return matchesSearch && matchesArchetype;
  });

  const handleDeleteClick = (character: ICharacter) => {
    setCharacterToDelete(character);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (characterToDelete && onCharacterDelete) {
      onCharacterDelete(characterToDelete.id);
    }
    setDeleteDialogOpen(false);
    setCharacterToDelete(null);
  };

  const getRelationshipCount = (character: ICharacter) => {
    return character.relationships?.length || 0;
  };

  const CharacterCard = ({ character }: { character: ICharacter }) => (
    <Card className="group hover:shadow-lg transition-all duration-200 bg-white/50 backdrop-blur-sm border-white/30 hover:border-escrivania-purple-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12 ring-2 ring-escrivania-purple-100 group-hover:ring-escrivania-purple-200 transition-colors">
              <AvatarImage src={character.avatarUrl || "/placeholder.svg"} />
              <AvatarFallback className="bg-escrivania-purple-50 text-escrivania-purple-700 font-semibold">
                {character.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                {character.name}
              </CardTitle>
              {character.role && (
                <CardDescription className="text-sm text-gray-600 truncate">
                  {character.role}
                </CardDescription>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white/90 backdrop-blur-xl border-white/20"
            >
              {onCharacterSelect && (
                <DropdownMenuItem onClick={() => onCharacterSelect(character)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Visualizar
                </DropdownMenuItem>
              )}
              {onCharacterEdit && (
                <DropdownMenuItem onClick={() => onCharacterEdit(character)}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Editar
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDeleteClick(character)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {character.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {character.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {character.archetype && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-escrivania-blue-50 text-escrivania-blue-700"
                >
                  {character.archetype}
                </Badge>
              )}
              {getRelationshipCount(character) > 0 && (
                <Badge variant="outline" className="text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  {getRelationshipCount(character)}
                </Badge>
              )}
            </div>
            <span className="text-xs text-gray-500">
              {new Date(character.createdAt).toLocaleDateString("pt-BR")}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const CharacterListItem = ({ character }: { character: ICharacter }) => (
    <Card className="group hover:shadow-md transition-all duration-200 bg-white/50 backdrop-blur-sm border-white/30">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <Avatar className="w-10 h-10 ring-2 ring-escrivania-purple-100">
              <AvatarImage src={character.avatarUrl || "/placeholder.svg"} />
              <AvatarFallback className="bg-escrivania-purple-50 text-escrivania-purple-700 font-semibold">
                {character.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900 truncate">
                  {character.name}
                </h3>
                {character.archetype && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-escrivania-blue-50 text-escrivania-blue-700"
                  >
                    {character.archetype}
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-4 mt-1">
                {character.role && (
                  <span className="text-sm text-gray-600 truncate">
                    {character.role}
                  </span>
                )}
                {getRelationshipCount(character) > 0 && (
                  <span className="text-xs text-gray-500 flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {getRelationshipCount(character)} relações
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 hidden sm:block">
              {new Date(character.createdAt).toLocaleDateString("pt-BR")}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white/90 backdrop-blur-xl border-white/20"
              >
                {onCharacterSelect && (
                  <DropdownMenuItem
                    onClick={() => onCharacterSelect(character)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Visualizar
                  </DropdownMenuItem>
                )}
                {onCharacterEdit && (
                  <DropdownMenuItem onClick={() => onCharacterEdit(character)}>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleDeleteClick(character)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Personagens</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24" />
                    <div className="h-3 bg-gray-200 rounded w-16" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Personagens</h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredCharacters.length} de {characters.length} personagens
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-white/50 rounded-lg p-1">
            <Button
              variant={currentViewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentViewMode("grid")}
              className="h-8 w-8 p-0"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={currentViewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentViewMode("list")}
              className="h-8 w-8 p-0"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          {showCreateButton && onCreateCharacter && (
            <Button
              onClick={onCreateCharacter}
              className="bg-escrivania-purple-600 hover:bg-escrivania-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Personagem
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar personagens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/50 border-gray-200 focus:border-escrivania-purple-300"
          />
        </div>
        <Select value={selectedArchetype} onValueChange={setSelectedArchetype}>
          <SelectTrigger className="w-full sm:w-48 bg-white/50 border-gray-200 focus:border-escrivania-purple-300">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white/90 backdrop-blur-xl border-white/20">
            {archetypes.map((archetype) => (
              <SelectItem key={archetype} value={archetype}>
                {archetype}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Characters List/Grid */}
      {filteredCharacters.length > 0 ? (
        <div
          className={`${
            currentViewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-3"
          }`}
        >
          {filteredCharacters.map((character) =>
            currentViewMode === "grid" ? (
              <CharacterCard key={character.id} character={character} />
            ) : (
              <CharacterListItem key={character.id} character={character} />
            )
          )}
        </div>
      ) : (
        <Card className="bg-white/30 backdrop-blur-sm border-white/30">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {characters.length === 0
                ? "Nenhum personagem criado"
                : "Nenhum personagem encontrado"}
            </h3>
            <p className="text-gray-500 text-center mb-6 max-w-md">
              {characters.length === 0
                ? "Comece criando seu primeiro personagem para dar vida à sua história."
                : "Tente ajustar os filtros ou criar um novo personagem."}
            </p>
            {showCreateButton && onCreateCharacter && (
              <Button
                onClick={onCreateCharacter}
                className="bg-escrivania-purple-600 hover:bg-escrivania-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Personagem
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white/90 backdrop-blur-xl border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Personagem</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o personagem "
              {characterToDelete?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
