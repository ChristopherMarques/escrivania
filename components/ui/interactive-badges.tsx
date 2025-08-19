"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, ChevronDown, Plus, X, Tag, User } from "lucide-react"
import type { IScene, ICharacter } from "@/lib/types"

interface StatusBadgeProps {
  status: IScene["status"]
  onStatusChange: (status: IScene["status"]) => void
  className?: string
}

export function StatusBadge({ status, onStatusChange, className = "" }: StatusBadgeProps) {
  const getStatusConfig = (status: IScene["status"]) => {
    switch (status) {
      case "idea":
        return { label: "Ideia", color: "bg-gray-100 text-gray-700 hover:bg-gray-200" }
      case "draft":
        return { label: "Rascunho", color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" }
      case "revised":
        return { label: "Revisado", color: "bg-blue-100 text-blue-700 hover:bg-blue-200" }
      case "final":
        return { label: "Finalizado", color: "bg-green-100 text-green-700 hover:bg-green-200" }
      default:
        return { label: "Ideia", color: "bg-gray-100 text-gray-700 hover:bg-gray-200" }
    }
  }

  const currentConfig = getStatusConfig(status)
  const allStatuses: IScene["status"][] = ["idea", "draft", "revised", "final"]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Badge
          className={`${currentConfig.color} cursor-pointer transition-colors flex items-center space-x-1 ${className}`}
        >
          <span>{currentConfig.label}</span>
          <ChevronDown className="w-3 h-3" />
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white/90 backdrop-blur-xl border-white/20">
        {allStatuses.map((statusOption) => {
          const config = getStatusConfig(statusOption)
          return (
            <DropdownMenuItem
              key={statusOption}
              onClick={() => onStatusChange(statusOption)}
              className="flex items-center space-x-2"
            >
              {status === statusOption && <Check className="w-4 h-4 text-green-600" />}
              <div className={`w-3 h-3 rounded-full ${config.color.split(" ")[0]}`} />
              <span>{config.label}</span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface POVBadgeProps {
  character: ICharacter | null
  allCharacters: ICharacter[]
  onCharacterChange: (characterId: string | undefined) => void
  className?: string
}

export function POVBadge({ character, allCharacters, onCharacterChange, className = "" }: POVBadgeProps) {
  if (!character) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Badge variant="outline" className={`cursor-pointer hover:bg-gray-50 ${className}`}>
            <User className="w-3 h-3 mr-1" />
            Sem POV
            <ChevronDown className="w-3 h-3 ml-1" />
          </Badge>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white/90 backdrop-blur-xl border-white/20">
          <DropdownMenuItem onClick={() => onCharacterChange(undefined)}>
            <span>Sem POV</span>
          </DropdownMenuItem>
          {allCharacters.map((char) => (
            <DropdownMenuItem key={char.id} onClick={() => onCharacterChange(char.id)}>
              <Avatar className="w-4 h-4 mr-2">
                <AvatarImage src={char.avatarUrl || "/placeholder.svg"} />
                <AvatarFallback className="text-xs">{char.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{char.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Badge className={`bg-purple-100 text-purple-700 hover:bg-purple-200 cursor-pointer ${className}`}>
              <Avatar className="w-4 h-4 mr-1">
                <AvatarImage src={character.avatarUrl || "/placeholder.svg"} />
                <AvatarFallback className="text-xs">{character.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{character.name}</span>
              <ChevronDown className="w-3 h-3 ml-1" />
            </Badge>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white/90 backdrop-blur-xl border-white/20">
            <DropdownMenuItem onClick={() => onCharacterChange(undefined)}>
              <span>Sem POV</span>
            </DropdownMenuItem>
            {allCharacters.map((char) => (
              <DropdownMenuItem key={char.id} onClick={() => onCharacterChange(char.id)}>
                <Avatar className="w-4 h-4 mr-2">
                  <AvatarImage src={char.avatarUrl || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">{char.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{char.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 bg-white/90 backdrop-blur-xl border-white/20">
        <div className="flex space-x-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={character.avatarUrl || "/placeholder.svg"} />
            <AvatarFallback>{character.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-1">
            <h4 className="text-sm font-semibold">{character.name}</h4>
            <p className="text-sm text-gray-600">{character.role}</p>
            {character.description && <p className="text-xs text-gray-500 line-clamp-3">{character.description}</p>}
            {character.archetype && (
              <Badge variant="outline" className="text-xs">
                {character.archetype}
              </Badge>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

interface TagBadgesProps {
  tags: string[]
  onTagsChange: (tags: string[]) => void
  onTagFilter?: (tag: string) => void
  allTags?: string[]
  className?: string
}

export function TagBadges({ tags, onTagsChange, onTagFilter, allTags = [], className = "" }: TagBadgesProps) {
  const [isAddingTag, setIsAddingTag] = useState(false)
  const [newTag, setNewTag] = useState("")

  const tagColors = [
    "bg-red-100 text-red-700 hover:bg-red-200",
    "bg-blue-100 text-blue-700 hover:bg-blue-200",
    "bg-green-100 text-green-700 hover:bg-green-200",
    "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
    "bg-purple-100 text-purple-700 hover:bg-purple-200",
    "bg-pink-100 text-pink-700 hover:bg-pink-200",
    "bg-indigo-100 text-indigo-700 hover:bg-indigo-200",
    "bg-orange-100 text-orange-700 hover:bg-orange-200",
  ]

  const getTagColor = (tag: string) => {
    const index = tag.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return tagColors[index % tagColors.length]
  }

  const addTag = () => {
    if (!newTag.trim() || tags.includes(newTag.trim())) return
    onTagsChange([...tags, newTag.trim()])
    setNewTag("")
    setIsAddingTag(false)
  }

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className={`flex flex-wrap gap-1 items-center ${className}`}>
      {tags.map((tag) => (
        <Badge
          key={tag}
          className={`${getTagColor(tag)} cursor-pointer transition-colors flex items-center space-x-1`}
          onClick={() => onTagFilter?.(tag)}
        >
          <Tag className="w-3 h-3" />
          <span>{tag}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              removeTag(tag)
            }}
            className="h-4 w-4 p-0 hover:bg-black/10 ml-1"
          >
            <X className="w-2 h-2" />
          </Button>
        </Badge>
      ))}

      {isAddingTag ? (
        <div className="flex items-center space-x-1">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addTag()
              if (e.key === "Escape") {
                setIsAddingTag(false)
                setNewTag("")
              }
            }}
            placeholder="Nova tag..."
            className="h-6 w-20 text-xs bg-white/50 border-gray-200"
            autoFocus
          />
          <Button variant="ghost" size="sm" onClick={addTag} className="h-6 w-6 p-0">
            <Check className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-gray-50 border-dashed flex items-center space-x-1"
            >
              <Plus className="w-3 h-3" />
              <span>Tag</span>
            </Badge>
          </PopoverTrigger>
          <PopoverContent className="w-64 bg-white/90 backdrop-blur-xl border-white/20">
            <div className="space-y-3">
              <div>
                <Label htmlFor="new-tag" className="text-sm font-medium">
                  Nova Tag
                </Label>
                <Input
                  id="new-tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addTag()
                  }}
                  placeholder="Ex: subplot-A, ação, romance..."
                  className="mt-1 bg-white/50 border-gray-200"
                />
              </div>

              {allTags.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Tags Existentes</Label>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {allTags
                      .filter((tag) => !tags.includes(tag))
                      .slice(0, 8)
                      .map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer hover:bg-gray-50 text-xs"
                          onClick={() => {
                            onTagsChange([...tags, tag])
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                  </div>
                </div>
              )}

              <Button
                onClick={addTag}
                disabled={!newTag.trim() || tags.includes(newTag.trim())}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-400 hover:from-purple-600 hover:to-blue-500 text-white"
              >
                Adicionar Tag
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}

interface FilterTagsProps {
  allTags: string[]
  activeTags: string[]
  onTagToggle: (tag: string) => void
  onClearFilters: () => void
  className?: string
}

export function FilterTags({ allTags, activeTags, onTagToggle, onClearFilters, className = "" }: FilterTagsProps) {
  const tagColors = [
    "bg-red-100 text-red-700 hover:bg-red-200",
    "bg-blue-100 text-blue-700 hover:bg-blue-200",
    "bg-green-100 text-green-700 hover:bg-green-200",
    "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
    "bg-purple-100 text-purple-700 hover:bg-purple-200",
    "bg-pink-100 text-pink-700 hover:bg-pink-200",
    "bg-indigo-100 text-indigo-700 hover:bg-indigo-200",
    "bg-orange-100 text-orange-700 hover:bg-orange-200",
  ]

  const getTagColor = (tag: string) => {
    const index = tag.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return tagColors[index % tagColors.length]
  }

  if (allTags.length === 0) return null

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-gray-700">Filtrar por Tags</Label>
        {activeTags.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-xs h-6">
            Limpar Filtros
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-1">
        {allTags.map((tag) => {
          const isActive = activeTags.includes(tag)
          return (
            <Badge
              key={tag}
              className={`cursor-pointer transition-all ${
                isActive ? `${getTagColor(tag)} ring-2 ring-purple-300` : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => onTagToggle(tag)}
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </Badge>
          )
        })}
      </div>
    </div>
  )
}
