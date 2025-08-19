"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TiptapEditor } from "@/components/editor/tiptap-editor"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Users, Wand2, Plus, Trash2, Heart, Sword, Crown, Shield, Target, UserMinus } from "lucide-react"
import type { ICharacter } from "@/lib/types"

interface CharacterSheetProps {
  character: ICharacter
  allCharacters: ICharacter[]
  onUpdate: (character: ICharacter) => void
  onDelete: (characterId: string) => void
}

const archetypes = ["Herói", "Mentor", "Guardião", "Arauto", "Metamorfo", "Sombra", "Trapaceiro", "Aliado"]

const relationshipTypes = [
  { value: "ally", label: "Aliado", icon: Shield, color: "bg-green-100 text-green-700" },
  { value: "enemy", label: "Inimigo", icon: Sword, color: "bg-red-100 text-red-700" },
  { value: "romantic", label: "Romântico", icon: Heart, color: "bg-pink-100 text-pink-700" },
  { value: "family", label: "Família", icon: Users, color: "bg-blue-100 text-blue-700" },
  { value: "mentor", label: "Mentor", icon: Crown, color: "bg-purple-100 text-purple-700" },
  { value: "rival", label: "Rival", icon: Target, color: "bg-orange-100 text-orange-700" },
]

export function CharacterSheet({ character, allCharacters, onUpdate, onDelete }: CharacterSheetProps) {
  const [isGeneratingPortrait, setIsGeneratingPortrait] = useState(false)
  const [isAddRelationshipOpen, setIsAddRelationshipOpen] = useState(false)
  const [selectedCharacterForRelation, setSelectedCharacterForRelation] = useState("")
  const [selectedRelationType, setSelectedRelationType] = useState<string>("")
  const [relationDescription, setRelationDescription] = useState("")

  const updateCharacter = (updates: Partial<ICharacter>) => {
    onUpdate({ ...character, ...updates, updatedAt: new Date().toISOString() })
  }

  const generatePortrait = async () => {
    setIsGeneratingPortrait(true)
    // Simulate AI portrait generation
    setTimeout(() => {
      const portraitUrl = `/placeholder.svg?height=200&width=200&query=portrait of ${character.name}`
      updateCharacter({ avatarUrl: portraitUrl })
      setIsGeneratingPortrait(false)
    }, 2000)
  }

  const addRelationship = () => {
    if (!selectedCharacterForRelation || !selectedRelationType) return

    const newRelationships = [
      ...(character.relationships || []),
      {
        characterId: selectedCharacterForRelation,
        type: selectedRelationType as any,
        description: relationDescription,
      },
    ]

    updateCharacter({ relationships: newRelationships })
    setSelectedCharacterForRelation("")
    setSelectedRelationType("")
    setRelationDescription("")
    setIsAddRelationshipOpen(false)
  }

  const removeRelationship = (characterId: string) => {
    const updatedRelationships = (character.relationships || []).filter((rel) => rel.characterId !== characterId)
    updateCharacter({ relationships: updatedRelationships })
  }

  const getRelationshipType = (typeValue: string) => {
    return relationshipTypes.find((type) => type.value === typeValue)
  }

  const getCharacterById = (id: string) => {
    return allCharacters.find((char) => char.id === id)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Character Header */}
      <div className="p-6 border-b border-white/20 bg-white/40 backdrop-blur-sm">
        <div className="flex items-start space-x-4">
          <Avatar className="w-16 h-16 ring-2 ring-purple-200">
            <AvatarImage src={character.avatarUrl || "/placeholder.svg"} />
            <AvatarFallback className="bg-gradient-to-br from-purple-100 to-blue-100 text-purple-700 text-lg">
              {character.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <Input
                value={character.name}
                onChange={(e) => updateCharacter({ name: e.target.value })}
                className="text-xl font-bold bg-transparent border-none p-0 h-auto focus-visible:ring-0"
                placeholder="Nome do Personagem"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(character.id)}
                className="text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <Input
              value={character.role}
              onChange={(e) => updateCharacter({ role: e.target.value })}
              className="text-sm text-gray-600 bg-transparent border-none p-0 h-auto focus-visible:ring-0"
              placeholder="Papel na história"
            />

            <Textarea
              value={character.description || ""}
              onChange={(e) => updateCharacter({ description: e.target.value })}
              placeholder="Descrição breve do personagem..."
              className="mt-2 bg-white/50 border-gray-200 focus:border-purple-300 min-h-[60px]"
            />
          </div>
        </div>
      </div>

      {/* Character Tabs */}
      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="general" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4 bg-white/50 mx-6 mt-4">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="appearance">Aparência</TabsTrigger>
            <TabsTrigger value="history">História</TabsTrigger>
            <TabsTrigger value="relationships">Relações</TabsTrigger>
          </TabsList>

          <div className="flex-1 p-6">
            <TabsContent value="general" className="space-y-6 mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="archetype" className="text-sm font-medium text-gray-700">
                    Arquétipo
                  </Label>
                  <Select
                    value={character.archetype || ""}
                    onValueChange={(value) => updateCharacter({ archetype: value })}
                  >
                    <SelectTrigger className="mt-2 bg-white/50 border-gray-200 focus:border-purple-300">
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
                </div>

                <div>
                  <Label htmlFor="conflict" className="text-sm font-medium text-gray-700">
                    Conflito Principal
                  </Label>
                  <Input
                    id="conflict"
                    value={character.conflict || ""}
                    onChange={(e) => updateCharacter({ conflict: e.target.value })}
                    placeholder="Ex: Medo de não ser aceito"
                    className="mt-2 bg-white/50 border-gray-200 focus:border-purple-300"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="internal-motivation" className="text-sm font-medium text-gray-700">
                    Motivação Interna
                  </Label>
                  <Textarea
                    id="internal-motivation"
                    value={character.motivation?.internal || ""}
                    onChange={(e) =>
                      updateCharacter({
                        motivation: { ...character.motivation, internal: e.target.value },
                      })
                    }
                    placeholder="O que o personagem realmente deseja internamente?"
                    className="mt-2 bg-white/50 border-gray-200 focus:border-purple-300 min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="external-motivation" className="text-sm font-medium text-gray-700">
                    Motivação Externa
                  </Label>
                  <Textarea
                    id="external-motivation"
                    value={character.motivation?.external || ""}
                    onChange={(e) =>
                      updateCharacter({
                        motivation: { ...character.motivation, external: e.target.value },
                      })
                    }
                    placeholder="O que o personagem precisa alcançar na história?"
                    className="mt-2 bg-white/50 border-gray-200 focus:border-purple-300 min-h-[80px]"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6 mt-0">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Aparência Física</h3>
                <Button
                  onClick={generatePortrait}
                  disabled={isGeneratingPortrait}
                  className="bg-gradient-to-r from-purple-500 to-blue-400 hover:from-purple-600 hover:to-blue-500 text-white"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  {isGeneratingPortrait ? "Gerando..." : "Gerar Retrato IA"}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="physical" className="text-sm font-medium text-gray-700">
                    Descrição Física
                  </Label>
                  <Textarea
                    id="physical"
                    value={character.appearance?.physical || ""}
                    onChange={(e) =>
                      updateCharacter({
                        appearance: { ...character.appearance, physical: e.target.value },
                      })
                    }
                    placeholder="Altura, peso, cor dos olhos, cabelo..."
                    className="mt-2 bg-white/50 border-gray-200 focus:border-purple-300 min-h-[120px]"
                  />
                </div>

                <div>
                  <Label htmlFor="clothing" className="text-sm font-medium text-gray-700">
                    Vestuário
                  </Label>
                  <Textarea
                    id="clothing"
                    value={character.appearance?.clothing || ""}
                    onChange={(e) =>
                      updateCharacter({
                        appearance: { ...character.appearance, clothing: e.target.value },
                      })
                    }
                    placeholder="Estilo de roupa, acessórios..."
                    className="mt-2 bg-white/50 border-gray-200 focus:border-purple-300 min-h-[120px]"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="mannerisms" className="text-sm font-medium text-gray-700">
                  Tiques e Maneirismos
                </Label>
                <Textarea
                  id="mannerisms"
                  value={character.appearance?.mannerisms || ""}
                  onChange={(e) =>
                    updateCharacter({
                      appearance: { ...character.appearance, mannerisms: e.target.value },
                    })
                  }
                  placeholder="Gestos característicos, forma de falar, hábitos..."
                  className="mt-2 bg-white/50 border-gray-200 focus:border-purple-300 min-h-[100px]"
                />
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Biografia do Personagem</h3>
                <TiptapEditor
                  content={character.biography || ""}
                  onChange={(content) => updateCharacter({ biography: content })}
                  placeholder="Escreva a história completa do personagem..."
                  className="min-h-[400px]"
                />
              </div>
            </TabsContent>

            <TabsContent value="relationships" className="space-y-6 mt-0">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Relacionamentos</h3>
                <Button
                  onClick={() => setIsAddRelationshipOpen(true)}
                  className="bg-gradient-to-r from-purple-500 to-blue-400 hover:from-purple-600 hover:to-blue-500 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Relação
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(character.relationships || []).map((relationship) => {
                  const relatedCharacter = getCharacterById(relationship.characterId)
                  const relationshipType = getRelationshipType(relationship.type)

                  if (!relatedCharacter || !relationshipType) return null

                  const Icon = relationshipType.icon

                  return (
                    <Card key={relationship.characterId} className="bg-white/50 backdrop-blur-sm border-white/30">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={relatedCharacter.avatarUrl || "/placeholder.svg"} />
                              <AvatarFallback className="bg-gradient-to-br from-purple-100 to-blue-100 text-purple-700">
                                {relatedCharacter.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-sm">{relatedCharacter.name}</CardTitle>
                              <CardDescription className="text-xs">{relatedCharacter.role}</CardDescription>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRelationship(relationship.characterId)}
                            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                          >
                            <UserMinus className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <Icon className="w-4 h-4" />
                          <Badge className={`text-xs ${relationshipType.color}`}>{relationshipType.label}</Badge>
                        </div>
                        {relationship.description && (
                          <p className="text-sm text-gray-600">{relationship.description}</p>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {(character.relationships || []).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhum relacionamento definido ainda.</p>
                  <p className="text-sm">Adicione conexões com outros personagens.</p>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Add Relationship Dialog */}
      <Dialog open={isAddRelationshipOpen} onOpenChange={setIsAddRelationshipOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white/90 backdrop-blur-xl border-white/20">
          <DialogHeader>
            <DialogTitle>Adicionar Relacionamento</DialogTitle>
            <DialogDescription>Defina a relação entre {character.name} e outro personagem.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="related-character">Personagem</Label>
              <Select value={selectedCharacterForRelation} onValueChange={setSelectedCharacterForRelation}>
                <SelectTrigger className="bg-white/50 border-gray-200 focus:border-purple-300">
                  <SelectValue placeholder="Selecione um personagem" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-xl border-white/20">
                  {allCharacters
                    .filter((char) => char.id !== character.id)
                    .map((char) => (
                      <SelectItem key={char.id} value={char.id}>
                        {char.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="relationship-type">Tipo de Relação</Label>
              <Select value={selectedRelationType} onValueChange={setSelectedRelationType}>
                <SelectTrigger className="bg-white/50 border-gray-200 focus:border-purple-300">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-xl border-white/20">
                  {relationshipTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="relation-description">Descrição (Opcional)</Label>
              <Textarea
                id="relation-description"
                value={relationDescription}
                onChange={(e) => setRelationDescription(e.target.value)}
                placeholder="Descreva a natureza desta relação..."
                className="bg-white/50 border-gray-200 focus:border-purple-300"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRelationshipOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={addRelationship}
              disabled={!selectedCharacterForRelation || !selectedRelationType}
              className="bg-gradient-to-r from-purple-500 to-blue-400 hover:from-purple-600 hover:to-blue-500 text-white"
            >
              Adicionar Relação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
