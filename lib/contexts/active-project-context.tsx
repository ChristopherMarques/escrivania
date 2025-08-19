"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type {
  IProject,
  IScene,
  IChapter,
  ICharacter,
  ILocation,
  ISelectedItem,
  ViewMode,
  IProjectActions,
} from "../types"

interface ActiveProjectState {
  projectData: IProject | null
  selectedItem: ISelectedItem | null
  viewMode: ViewMode
  loading: boolean
}

type ActiveProjectAction =
  | { type: "SET_PROJECT_DATA"; payload: IProject }
  | { type: "UPDATE_SCENE_CONTENT"; payload: { sceneId: string; content: any } }
  | { type: "UPDATE_SCENE_SYNOPSIS"; payload: { sceneId: string; synopsis: string } }
  | { type: "UPDATE_SCENE_STATUS"; payload: { sceneId: string; status: IScene["status"] } }
  | { type: "UPDATE_SCENE_TAGS"; payload: { sceneId: string; tags: string[] } }
  | { type: "ADD_CHAPTER"; payload: IChapter }
  | { type: "DELETE_CHAPTER"; payload: string }
  | { type: "ADD_SCENE"; payload: { chapterId: string; scene: IScene } }
  | { type: "DELETE_SCENE"; payload: string }
  | { type: "DUPLICATE_SCENE"; payload: { originalId: string; newScene: IScene } }
  | { type: "ADD_CHARACTER"; payload: ICharacter }
  | { type: "UPDATE_CHARACTER"; payload: ICharacter }
  | { type: "DELETE_CHARACTER"; payload: string }
  | { type: "ADD_LOCATION"; payload: ILocation }
  | { type: "UPDATE_LOCATION"; payload: ILocation }
  | { type: "DELETE_LOCATION"; payload: string }
  | { type: "SET_VIEW_MODE"; payload: ViewMode }
  | { type: "SET_SELECTED_ITEM"; payload: ISelectedItem }
  | { type: "SET_LOADING"; payload: boolean }

const initialState: ActiveProjectState = {
  projectData: null,
  selectedItem: null,
  viewMode: "writing",
  loading: true,
}

function activeProjectReducer(state: ActiveProjectState, action: ActiveProjectAction): ActiveProjectState {
  if (!state.projectData && action.type !== "SET_PROJECT_DATA" && action.type !== "SET_LOADING") {
    return state
  }

  switch (action.type) {
    case "SET_PROJECT_DATA":
      return { ...state, projectData: action.payload, loading: false }
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.payload }
    case "SET_SELECTED_ITEM":
      return { ...state, selectedItem: action.payload }
    case "UPDATE_SCENE_CONTENT":
      return {
        ...state,
        projectData: {
          ...state.projectData!,
          manuscript: state.projectData!.manuscript.map((chapter) => ({
            ...chapter,
            scenes: chapter.scenes.map((scene) =>
              scene.id === action.payload.sceneId
                ? { ...scene, content: action.payload.content, updatedAt: new Date().toISOString() }
                : scene,
            ),
          })),
        },
      }
    case "UPDATE_SCENE_SYNOPSIS":
      return {
        ...state,
        projectData: {
          ...state.projectData!,
          manuscript: state.projectData!.manuscript.map((chapter) => ({
            ...chapter,
            scenes: chapter.scenes.map((scene) =>
              scene.id === action.payload.sceneId
                ? { ...scene, synopsis: action.payload.synopsis, updatedAt: new Date().toISOString() }
                : scene,
            ),
          })),
        },
      }
    case "UPDATE_SCENE_STATUS":
      return {
        ...state,
        projectData: {
          ...state.projectData!,
          manuscript: state.projectData!.manuscript.map((chapter) => ({
            ...chapter,
            scenes: chapter.scenes.map((scene) =>
              scene.id === action.payload.sceneId
                ? { ...scene, status: action.payload.status, updatedAt: new Date().toISOString() }
                : scene,
            ),
          })),
        },
      }
    case "UPDATE_SCENE_TAGS":
      return {
        ...state,
        projectData: {
          ...state.projectData!,
          manuscript: state.projectData!.manuscript.map((chapter) => ({
            ...chapter,
            scenes: chapter.scenes.map((scene) =>
              scene.id === action.payload.sceneId
                ? { ...scene, tags: action.payload.tags, updatedAt: new Date().toISOString() }
                : scene,
            ),
          })),
        },
      }
    case "ADD_CHARACTER":
      return {
        ...state,
        projectData: {
          ...state.projectData!,
          characters: [...state.projectData!.characters, action.payload],
        },
      }
    case "UPDATE_CHARACTER":
      return {
        ...state,
        projectData: {
          ...state.projectData!,
          characters: state.projectData!.characters.map((char) =>
            char.id === action.payload.id ? action.payload : char,
          ),
        },
      }
    case "DELETE_CHARACTER":
      return {
        ...state,
        projectData: {
          ...state.projectData!,
          characters: state.projectData!.characters.filter((char) => char.id !== action.payload),
        },
      }
    case "ADD_LOCATION":
      return {
        ...state,
        projectData: {
          ...state.projectData!,
          locations: [...state.projectData!.locations, action.payload],
        },
      }
    case "UPDATE_LOCATION":
      return {
        ...state,
        projectData: {
          ...state.projectData!,
          locations: state.projectData!.locations.map((loc) => (loc.id === action.payload.id ? action.payload : loc)),
        },
      }
    case "DELETE_LOCATION":
      return {
        ...state,
        projectData: {
          ...state.projectData!,
          locations: state.projectData!.locations.filter((loc) => loc.id !== action.payload),
        },
      }
    case "ADD_CHAPTER":
      return {
        ...state,
        projectData: {
          ...state.projectData!,
          manuscript: [...state.projectData!.manuscript, action.payload],
        },
      }
    case "DELETE_CHAPTER":
      return {
        ...state,
        projectData: {
          ...state.projectData!,
          manuscript: state.projectData!.manuscript.filter((chapter) => chapter.id !== action.payload),
        },
      }
    case "ADD_SCENE":
      return {
        ...state,
        projectData: {
          ...state.projectData!,
          manuscript: state.projectData!.manuscript.map((chapter) =>
            chapter.id === action.payload.chapterId
              ? { ...chapter, scenes: [...chapter.scenes, action.payload.scene] }
              : chapter,
          ),
        },
      }
    case "DELETE_SCENE":
      return {
        ...state,
        projectData: {
          ...state.projectData!,
          manuscript: state.projectData!.manuscript.map((chapter) => ({
            ...chapter,
            scenes: chapter.scenes.filter((scene) => scene.id !== action.payload),
          })),
        },
      }
    case "DUPLICATE_SCENE":
      return {
        ...state,
        projectData: {
          ...state.projectData!,
          manuscript: state.projectData!.manuscript.map((chapter) =>
            chapter.scenes.some((s) => s.id === action.payload.originalId)
              ? { ...chapter, scenes: [...chapter.scenes, action.payload.newScene] }
              : chapter,
          ),
        },
      }
    case "TOGGLE_CHAPTER":
      return {
        ...state,
        projectData: {
          ...state.projectData!,
          manuscript: state.projectData!.manuscript.map((chapter) =>
            chapter.id === action.payload ? { ...chapter, expanded: !chapter.expanded } : chapter,
          ),
        },
      }
    default:
      return state
  }
}

interface ActiveProjectContextType extends IProjectActions {
  state: ActiveProjectState
  loadProject: (projectId: string) => void
  toggleChapter: (chapterId: string) => void
  getCurrentScene: () => IScene | undefined
  getCurrentCharacter: () => ICharacter | undefined
  getCurrentLocation: () => ILocation | undefined
}

const ActiveProjectContext = createContext<ActiveProjectContextType | undefined>(undefined)

export function ActiveProjectProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(activeProjectReducer, initialState)

  // Auto-save project data to localStorage
  useEffect(() => {
    if (state.projectData && !state.loading) {
      const saveData = async () => {
        try {
          localStorage.setItem(`escrivania-project-${state.projectData!.id}`, JSON.stringify(state.projectData))
        } catch (error) {
          console.error("Error saving project data:", error)
        }
      }

      const timeoutId = setTimeout(saveData, 1000) // Debounce saves
      return () => clearTimeout(timeoutId)
    }
  }, [state.projectData, state.loading])

  const loadProject = (projectId: string) => {
    dispatch({ type: "SET_LOADING", payload: true })

    try {
      const stored = localStorage.getItem(`escrivania-project-${projectId}`)
      if (stored) {
        const projectData = JSON.parse(stored)
        dispatch({ type: "SET_PROJECT_DATA", payload: projectData })

        // Set initial selection to first scene if available
        const firstScene = projectData.manuscript?.flatMap((c: IChapter) => c.scenes)[0]
        if (firstScene) {
          dispatch({ type: "SET_SELECTED_ITEM", payload: { type: "scene", id: firstScene.id } })
        }
      } else {
        const now = new Date().toISOString()
        const initialProjectData: IProject = {
          id: projectId,
          title: "Novo Projeto",
          description: "",
          wordGoal: 50000,
          manuscript: [
            {
              id: "chapter-1",
              title: "Capítulo 1: O Início",
              expanded: true,
              synopsis: "",
              createdAt: now,
              updatedAt: now,
              scenes: [
                {
                  id: "scene-1-1",
                  title: "Cena 1.1: O Encontro",
                  content: "",
                  status: "idea",
                  synopsis: "",
                  tags: [],
                  wordCount: 0,
                  createdAt: now,
                  updatedAt: now,
                },
              ],
            },
          ],
          characters: [],
          locations: [],
          notes: [],
          tags: [],
          settings: {
            viewMode: "writing",
          },
          createdAt: now,
          updatedAt: now,
        }

        dispatch({ type: "SET_PROJECT_DATA", payload: initialProjectData })
        dispatch({ type: "SET_SELECTED_ITEM", payload: { type: "scene", id: "scene-1-1" } })
      }
    } catch (error) {
      console.error("Error loading project:", error)
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const updateSceneContent = (sceneId: string, content: any) => {
    dispatch({ type: "UPDATE_SCENE_CONTENT", payload: { sceneId, content } })
  }

  const updateSceneSynopsis = (sceneId: string, synopsis: string) => {
    dispatch({ type: "UPDATE_SCENE_SYNOPSIS", payload: { sceneId, synopsis } })
  }

  const updateSceneStatus = (sceneId: string, status: IScene["status"]) => {
    dispatch({ type: "UPDATE_SCENE_STATUS", payload: { sceneId, status } })
  }

  const updateSceneTags = (sceneId: string, tags: string[]) => {
    dispatch({ type: "UPDATE_SCENE_TAGS", payload: { sceneId, tags } })
  }

  const addChapter = (title: string) => {
    const now = new Date().toISOString()
    const newChapter: IChapter = {
      id: `chapter-${Date.now()}`,
      title,
      expanded: true,
      synopsis: "",
      scenes: [],
      createdAt: now,
      updatedAt: now,
    }
    dispatch({ type: "ADD_CHAPTER", payload: newChapter })
  }

  const deleteChapter = (chapterId: string) => {
    dispatch({ type: "DELETE_CHAPTER", payload: chapterId })
  }

  const addScene = (chapterId: string, title: string) => {
    const now = new Date().toISOString()
    const newScene: IScene = {
      id: `scene-${Date.now()}`,
      title,
      content: "",
      status: "idea",
      synopsis: "",
      tags: [],
      wordCount: 0,
      createdAt: now,
      updatedAt: now,
    }
    dispatch({ type: "ADD_SCENE", payload: { chapterId, scene: newScene } })
  }

  const deleteScene = (sceneId: string) => {
    dispatch({ type: "DELETE_SCENE", payload: sceneId })
  }

  const duplicateScene = (sceneId: string) => {
    const scene = state.projectData?.manuscript.flatMap((c) => c.scenes).find((s) => s.id === sceneId)
    if (scene) {
      const now = new Date().toISOString()
      const newScene: IScene = {
        ...scene,
        id: `scene-${Date.now()}`,
        title: `${scene.title} (Cópia)`,
        createdAt: now,
        updatedAt: now,
      }
      dispatch({ type: "DUPLICATE_SCENE", payload: { originalId: sceneId, newScene } })
    }
  }

  const addCharacter = (characterData: Omit<ICharacter, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString()
    const newCharacter: ICharacter = {
      ...characterData,
      id: `character-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    }
    dispatch({ type: "ADD_CHARACTER", payload: newCharacter })
  }

  const updateCharacter = (character: ICharacter) => {
    const updatedCharacter = { ...character, updatedAt: new Date().toISOString() }
    dispatch({ type: "UPDATE_CHARACTER", payload: updatedCharacter })
  }

  const deleteCharacter = (characterId: string) => {
    dispatch({ type: "DELETE_CHARACTER", payload: characterId })
  }

  const addLocation = (locationData: Omit<ILocation, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString()
    const newLocation: ILocation = {
      ...locationData,
      id: `location-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    }
    dispatch({ type: "ADD_LOCATION", payload: newLocation })
  }

  const updateLocation = (location: ILocation) => {
    const updatedLocation = { ...location, updatedAt: new Date().toISOString() }
    dispatch({ type: "UPDATE_LOCATION", payload: updatedLocation })
  }

  const deleteLocation = (locationId: string) => {
    dispatch({ type: "DELETE_LOCATION", payload: locationId })
  }

  const setViewMode = (mode: ViewMode) => {
    dispatch({ type: "SET_VIEW_MODE", payload: mode })
  }

  const setSelectedItem = (item: ISelectedItem) => {
    dispatch({ type: "SET_SELECTED_ITEM", payload: item })
  }

  const toggleChapter = (chapterId: string) => {
    dispatch({ type: "TOGGLE_CHAPTER", payload: chapterId })
  }

  const getCurrentScene = (): IScene | undefined => {
    if (!state.projectData || !state.selectedItem || state.selectedItem.type !== "scene") {
      return undefined
    }
    return state.projectData.manuscript.flatMap((c) => c.scenes).find((s) => s.id === state.selectedItem!.id)
  }

  const getCurrentCharacter = (): ICharacter | undefined => {
    if (!state.projectData || !state.selectedItem || state.selectedItem.type !== "character") {
      return undefined
    }
    return state.projectData.characters.find((c) => c.id === state.selectedItem!.id)
  }

  const getCurrentLocation = (): ILocation | undefined => {
    if (!state.projectData || !state.selectedItem || state.selectedItem.type !== "location") {
      return undefined
    }
    return state.projectData.locations.find((l) => l.id === state.selectedItem!.id)
  }

  return (
    <ActiveProjectContext.Provider
      value={{
        state,
        loadProject,
        updateSceneContent,
        updateSceneSynopsis,
        updateSceneStatus,
        updateSceneTags,
        addChapter,
        deleteChapter,
        addScene,
        deleteScene,
        duplicateScene,
        addCharacter,
        updateCharacter,
        deleteCharacter,
        addLocation,
        updateLocation,
        deleteLocation,
        setViewMode,
        setSelectedItem,
        toggleChapter,
        getCurrentScene,
        getCurrentCharacter,
        getCurrentLocation,
      }}
    >
      {children}
    </ActiveProjectContext.Provider>
  )
}

export function useActiveProject() {
  const context = useContext(ActiveProjectContext)
  if (context === undefined) {
    throw new Error("useActiveProject must be used within an ActiveProjectProvider")
  }
  return context
}
