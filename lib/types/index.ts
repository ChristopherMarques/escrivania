export interface IScene {
  id: string
  title: string
  content: any // JSON content for Tiptap editor
  synopsis: string
  status: "idea" | "draft" | "revised" | "final"
  povCharacterId?: string
  tags: string[]
  wordCount: number
  createdAt: string
  updatedAt: string
}

export interface IChapter {
  id: string
  title: string
  expanded: boolean
  scenes: IScene[]
  synopsis?: string
  createdAt: string
  updatedAt: string
}

export interface ICharacter {
  id: string
  name: string
  role: string
  description?: string
  avatarUrl?: string
  archetype?: string
  motivation?: {
    internal?: string
    external?: string
  }
  conflict?: string
  appearance?: {
    physical?: string
    clothing?: string
    mannerisms?: string
  }
  biography?: string
  relationships?: Array<{
    characterId: string
    type: "ally" | "enemy" | "romantic" | "family" | "mentor" | "rival"
    description?: string
  }>
  createdAt: string
  updatedAt: string
}

export interface ILocation {
  id: string
  name: string
  description: string
  history?: string
  culture?: string
  mapImageUrl?: string
  pins?: Array<{
    id: string
    x: number
    y: number
    name: string
    description: string
  }>
  createdAt: string
  updatedAt: string
}

export interface IProject {
  id: string
  title: string
  description?: string
  wordGoal: number
  dailyGoal?: number
  manuscript: IChapter[]
  characters: ICharacter[]
  locations: ILocation[]
  notes: string[]
  tags: string[]
  settings: {
    focusMode?: {
      background?: "solid" | "gradient" | "image"
      backgroundColor?: string
      backgroundImage?: string
      typewriterMode?: boolean
      ambientSound?: string
    }
    viewMode?: "writing" | "corkboard" | "outliner"
  }
  createdAt: string
  updatedAt: string
}

export interface IProjectSummary {
  id: string
  title: string
  description?: string
  progress: number
  wordCount: number
  characters: number
  chapters: number
  createdAt: string
  updatedAt: string
}

// View mode types
export type ViewMode = "writing" | "corkboard" | "outliner"

// UI state types
export interface ISelectedItem {
  type: "scene" | "chapter" | "character" | "location"
  id: string
}

// Action types for contexts
export interface IProjectActions {
  updateSceneContent: (sceneId: string, content: any) => void
  updateSceneSynopsis: (sceneId: string, synopsis: string) => void
  updateSceneStatus: (sceneId: string, status: IScene["status"]) => void
  updateSceneTags: (sceneId: string, tags: string[]) => void
  addChapter: (title: string) => void
  deleteChapter: (chapterId: string) => void
  addScene: (chapterId: string, title: string) => void
  deleteScene: (sceneId: string) => void
  duplicateScene: (sceneId: string) => void
  addCharacter: (character: Omit<ICharacter, "id" | "createdAt" | "updatedAt">) => void
  updateCharacter: (character: ICharacter) => void
  deleteCharacter: (characterId: string) => void
  addLocation: (location: Omit<ILocation, "id" | "createdAt" | "updatedAt">) => void
  updateLocation: (location: ILocation) => void
  deleteLocation: (locationId: string) => void
  setViewMode: (mode: ViewMode) => void
  setSelectedItem: (item: ISelectedItem) => void
}
