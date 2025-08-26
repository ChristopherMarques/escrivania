"use client";

import { getClient, type Tables } from "@/lib/supabase";
import React, { createContext, useContext, useEffect, useReducer } from "react";
import { useAuth } from "./AuthContext";

// Use getClient() types
export type Project = Tables<"projects">;
export type Chapter = Tables<"chapters">;
export type Scene = Tables<"scenes">;
export type Character = Tables<"characters">;
export type Synopsis = Tables<"synopses">;

interface ProjectState {
  projects: Project[];
  chapters: Chapter[];
  scenes: Scene[];
  characters: Character[];
  synopses: Synopsis[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
}

type ProjectAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_PROJECTS"; payload: Project[] }
  | { type: "SET_CHAPTERS"; payload: Chapter[] }
  | { type: "SET_SCENES"; payload: Scene[] }
  | { type: "SET_CHARACTERS"; payload: Character[] }
  | { type: "SET_SYNOPSES"; payload: Synopsis[] }
  | { type: "SET_CURRENT_PROJECT"; payload: Project | null }
  | { type: "ADD_PROJECT"; payload: Project }
  | { type: "UPDATE_PROJECT"; payload: Project }
  | { type: "DELETE_PROJECT"; payload: string }
  | { type: "ADD_CHAPTER"; payload: Chapter }
  | { type: "UPDATE_CHAPTER"; payload: Chapter }
  | { type: "DELETE_CHAPTER"; payload: string }
  | { type: "ADD_SCENE"; payload: Scene }
  | { type: "UPDATE_SCENE"; payload: Scene }
  | { type: "DELETE_SCENE"; payload: string }
  | { type: "ADD_CHARACTER"; payload: Character }
  | { type: "UPDATE_CHARACTER"; payload: Character }
  | { type: "DELETE_CHARACTER"; payload: string }
  | { type: "ADD_SYNOPSIS"; payload: Synopsis }
  | { type: "UPDATE_SYNOPSIS"; payload: Synopsis }
  | { type: "DELETE_SYNOPSIS"; payload: string };

const initialState: ProjectState = {
  projects: [],
  chapters: [],
  scenes: [],
  characters: [],
  synopses: [],
  currentProject: null,
  loading: false,
  error: null,
};

function projectReducer(
  state: ProjectState,
  action: ProjectAction
): ProjectState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_PROJECTS":
      return { ...state, projects: action.payload };
    case "SET_CHAPTERS":
      return { ...state, chapters: action.payload };
    case "SET_SCENES":
      return { ...state, scenes: action.payload };
    case "SET_CHARACTERS":
      return { ...state, characters: action.payload };
    case "SET_SYNOPSES":
      return { ...state, synopses: action.payload };
    case "SET_CURRENT_PROJECT":
      return { ...state, currentProject: action.payload };
    case "ADD_PROJECT":
      return { ...state, projects: [...state.projects, action.payload] };
    case "UPDATE_PROJECT":
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
        currentProject:
          state.currentProject?.id === action.payload.id
            ? action.payload
            : state.currentProject,
      };
    case "DELETE_PROJECT":
      return {
        ...state,
        projects: state.projects.filter((p) => p.id !== action.payload),
        currentProject:
          state.currentProject?.id === action.payload
            ? null
            : state.currentProject,
      };
    case "ADD_CHAPTER":
      return { ...state, chapters: [...state.chapters, action.payload] };
    case "UPDATE_CHAPTER":
      return {
        ...state,
        chapters: state.chapters.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case "DELETE_CHAPTER":
      return {
        ...state,
        chapters: state.chapters.filter((c) => c.id !== action.payload),
      };
    case "ADD_SCENE":
      return { ...state, scenes: [...state.scenes, action.payload] };
    case "UPDATE_SCENE":
      return {
        ...state,
        scenes: state.scenes.map((s) =>
          s.id === action.payload.id ? action.payload : s
        ),
      };
    case "DELETE_SCENE":
      return {
        ...state,
        scenes: state.scenes.filter((s) => s.id !== action.payload),
      };
    case "ADD_CHARACTER":
      return { ...state, characters: [...state.characters, action.payload] };
    case "UPDATE_CHARACTER":
      return {
        ...state,
        characters: state.characters.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case "DELETE_CHARACTER":
      return {
        ...state,
        characters: state.characters.filter((c) => c.id !== action.payload),
      };
    case "ADD_SYNOPSIS":
      return { ...state, synopses: [...state.synopses, action.payload] };
    case "UPDATE_SYNOPSIS":
      return {
        ...state,
        synopses: state.synopses.map((s) =>
          s.id === action.payload.id ? action.payload : s
        ),
      };
    case "DELETE_SYNOPSIS":
      return {
        ...state,
        synopses: state.synopses.filter((s) => s.id !== action.payload),
      };
    default:
      return state;
  }
}

interface ProjectContextType {
  state: ProjectState;
  // Project actions
  createProject: (
    data: Omit<Project, "id" | "created_at" | "updated_at">
  ) => Promise<void>;
  updateProject: (
    id: string,
    data: Partial<Omit<Project, "id" | "created_at" | "updated_at">>
  ) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;

  // Chapter actions
  createChapter: (
    data: Omit<Chapter, "id" | "created_at" | "updated_at">
  ) => Promise<void>;
  updateChapter: (
    id: string,
    data: Partial<Omit<Chapter, "id" | "created_at" | "updated_at">>
  ) => Promise<void>;
  deleteChapter: (id: string) => Promise<void>;

  // Scene actions
  createScene: (
    data: Omit<Scene, "id" | "created_at" | "updated_at">
  ) => Promise<void>;
  updateScene: (
    id: string,
    data: Partial<Omit<Scene, "id" | "created_at" | "updated_at">>
  ) => Promise<void>;
  deleteScene: (id: string) => Promise<void>;

  // Character actions
  createCharacter: (
    data: Omit<Character, "id" | "created_at" | "updated_at">
  ) => Promise<void>;
  updateCharacter: (
    id: string,
    data: Partial<Omit<Character, "id" | "created_at" | "updated_at">>
  ) => Promise<void>;
  deleteCharacter: (id: string) => Promise<void>;

  // Synopsis actions
  createSynopsis: (
    data: Omit<Synopsis, "id" | "created_at" | "updated_at">
  ) => Promise<void>;
  updateSynopsis: (
    id: string,
    data: Partial<Omit<Synopsis, "id" | "created_at" | "updated_at">>
  ) => Promise<void>;
  deleteSynopsis: (id: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(projectReducer, initialState);
  const { user } = useAuth();

  const createProject = async (
    data: Omit<Project, "id" | "created_at" | "updated_at">
  ) => {
    if (!user) {
      dispatch({ type: "SET_ERROR", payload: "Usuário não autenticado" });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null }); // Limpar erros anteriores

    try {
      // Primeiro, vamos tentar inserir o usuário na tabela users se não existir
      const { error: userError } = await getClient()
        .from("users")
        .upsert(
          {
            id: user.id,
            email: user.email,
            name: user.name || null,
            avatar_url: user.image || null,
          },
          { onConflict: "id" }
        );

      if (userError) {
        console.error("Erro ao inserir usuário:", userError);
        throw new Error(`Erro ao inserir usuário: ${userError.message}`);
      }

      // Verificar se o usuário foi inserido/existe
      const { data: existingUser, error: checkUserError } = await getClient()
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single();

      if (checkUserError || !existingUser) {
        console.error("Usuário não encontrado após upsert:", checkUserError);
        throw new Error("Falha ao verificar usuário na base de dados");
      }

      // Agora inserir o projeto
      const { data: project, error } = await getClient()
        .from("projects")
        .insert([
          {
            ...data,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("getClient() error:", error);
        throw new Error(`Erro do banco de dados: ${error.message}`);
      }

      if (!project) {
        throw new Error("Projeto não foi criado corretamente");
      }

      dispatch({ type: "ADD_PROJECT", payload: project });
    } catch (error) {
      console.error("Error creating project:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Falha ao criar projeto";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const updateProject = async (
    id: string,
    data: Partial<Omit<Project, "id" | "created_at" | "updated_at">>
  ) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { data: project, error } = await getClient()
        .from("projects")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      dispatch({ type: "UPDATE_PROJECT", payload: project });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to update project",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const deleteProject = async (id: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { error } = await getClient()
        .from("projects")
        .delete()
        .eq("id", id);

      if (error) throw error;

      dispatch({ type: "DELETE_PROJECT", payload: id });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to delete project",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const setCurrentProject = (project: Project | null) => {
    dispatch({ type: "SET_CURRENT_PROJECT", payload: project });
  };

  const createChapter = async (
    data: Omit<Chapter, "id" | "created_at" | "updated_at">
  ) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { data: chapter, error } = await getClient()
        .from("chapters")
        .insert([data])
        .select()
        .single();

      if (error) throw error;

      dispatch({ type: "ADD_CHAPTER", payload: chapter });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to create chapter",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const updateChapter = async (
    id: string,
    data: Partial<Omit<Chapter, "id" | "created_at" | "updated_at">>
  ) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { data: chapter, error } = await getClient()
        .from("chapters")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      dispatch({ type: "UPDATE_CHAPTER", payload: chapter });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to update chapter",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const deleteChapter = async (id: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { error } = await getClient()
        .from("chapters")
        .delete()
        .eq("id", id);

      if (error) throw error;

      dispatch({ type: "DELETE_CHAPTER", payload: id });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to delete chapter",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const createScene = async (
    data: Omit<Scene, "id" | "created_at" | "updated_at">
  ) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { data: scene, error } = await getClient()
        .from("scenes")
        .insert([data])
        .select()
        .single();

      if (error) throw error;

      dispatch({ type: "ADD_SCENE", payload: scene });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to create scene",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const updateScene = async (
    id: string,
    data: Partial<Omit<Scene, "id" | "created_at" | "updated_at">>
  ) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { data: scene, error } = await getClient()
        .from("scenes")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      dispatch({ type: "UPDATE_SCENE", payload: scene });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to update scene",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const deleteScene = async (id: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { error } = await getClient().from("scenes").delete().eq("id", id);

      if (error) throw error;

      dispatch({ type: "DELETE_SCENE", payload: id });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to delete scene",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const createCharacter = async (
    data: Omit<Character, "id" | "created_at" | "updated_at">
  ) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { data: character, error } = await getClient()
        .from("characters")
        .insert([data])
        .select()
        .single();

      if (error) throw error;

      dispatch({ type: "ADD_CHARACTER", payload: character });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to create character",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const updateCharacter = async (
    id: string,
    data: Partial<Omit<Character, "id" | "created_at" | "updated_at">>
  ) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { data: character, error } = await getClient()
        .from("characters")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      dispatch({ type: "UPDATE_CHARACTER", payload: character });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to update character",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const deleteCharacter = async (id: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { error } = await getClient()
        .from("characters")
        .delete()
        .eq("id", id);

      if (error) throw error;

      dispatch({ type: "DELETE_CHARACTER", payload: id });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to delete character",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const createSynopsis = async (
    data: Omit<Synopsis, "id" | "created_at" | "updated_at">
  ) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { data: synopsis, error } = await getClient()
        .from("synopses")
        .insert([data])
        .select()
        .single();

      if (error) throw error;

      dispatch({ type: "ADD_SYNOPSIS", payload: synopsis });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to create synopsis",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const updateSynopsis = async (
    id: string,
    data: Partial<Omit<Synopsis, "id" | "created_at" | "updated_at">>
  ) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { data: synopsis, error } = await getClient()
        .from("synopses")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      dispatch({ type: "UPDATE_SYNOPSIS", payload: synopsis });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to update synopsis",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const deleteSynopsis = async (id: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { error } = await getClient()
        .from("synopses")
        .delete()
        .eq("id", id);

      if (error) throw error;

      dispatch({ type: "DELETE_SYNOPSIS", payload: id });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to delete synopsis",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Load data functions
  const loadProjects = async () => {
    if (!user) return;

    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { data, error } = await getClient()
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      dispatch({ type: "SET_PROJECTS", payload: data || [] });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to load projects",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const loadProjectData = async (projectId: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      // Load chapters
      const { data: chapters, error: chaptersError } = await getClient()
        .from("chapters")
        .select("*")
        .eq("project_id", projectId)
        .order("order_index", { ascending: true });

      if (chaptersError) throw chaptersError;

      // Load scenes - get scenes for all chapters of this project
      let scenes: Scene[] = [];
      if (chapters && chapters.length > 0) {
        const chapterIds = chapters.map(chapter => chapter.id);
        const { data: scenesData, error: scenesError } = await getClient()
          .from("scenes")
          .select("*")
          .in("chapter_id", chapterIds)
          .order("order_index", { ascending: true });

        if (scenesError) throw scenesError;
        scenes = scenesData || [];
      }

      // Load characters
      const { data: characters, error: charactersError } = await getClient()
        .from("characters")
        .select("*")
        .eq("project_id", projectId)
        .order("name", { ascending: true });

      if (charactersError) throw charactersError;

      // Load synopses
      const { data: synopses, error: synopsesError } = await getClient()
        .from("synopses")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (synopsesError) throw synopsesError;

      dispatch({ type: "SET_CHAPTERS", payload: chapters || [] });
      dispatch({ type: "SET_SCENES", payload: scenes || [] });
      dispatch({ type: "SET_CHARACTERS", payload: characters || [] });
      dispatch({ type: "SET_SYNOPSES", payload: synopses || [] });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error
            ? error.message
            : "Failed to load project data",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Load projects when user changes
  useEffect(() => {
    if (user) {
      const loadProjects = async () => {
        dispatch({ type: "SET_LOADING", payload: true });
        try {
          const { data, error } = await getClient()
            .from("projects")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          if (error) throw error;

          dispatch({ type: "SET_PROJECTS", payload: data || [] });
        } catch (error) {
          dispatch({
            type: "SET_ERROR",
            payload:
              error instanceof Error
                ? error.message
                : "Failed to load projects",
          });
        } finally {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      };
      loadProjects();
    } else {
      dispatch({ type: "SET_PROJECTS", payload: [] });
      dispatch({ type: "SET_CHAPTERS", payload: [] });
      dispatch({ type: "SET_SCENES", payload: [] });
      dispatch({ type: "SET_CHARACTERS", payload: [] });
      dispatch({ type: "SET_SYNOPSES", payload: [] });
      dispatch({ type: "SET_CURRENT_PROJECT", payload: null });
    }
  }, [user]);

  // Load project data when current project changes
  useEffect(() => {
    if (state.currentProject) {
      const loadProjectData = async (projectId: string) => {
        dispatch({ type: "SET_LOADING", payload: true });
        try {
          // Load chapters
          const { data: chapters, error: chaptersError } = await getClient()
            .from("chapters")
            .select("*")
            .eq("project_id", projectId)
            .order("order_index", { ascending: true });

          if (chaptersError) throw chaptersError;

          // Load scenes - get scenes for all chapters of this project
          let scenes: Scene[] = [];
          if (chapters && chapters.length > 0) {
            const chapterIds = chapters.map(chapter => chapter.id);
            const { data: scenesData, error: scenesError } = await getClient()
              .from("scenes")
              .select("*")
              .in("chapter_id", chapterIds)
              .order("order_index", { ascending: true });

            if (scenesError) throw scenesError;
            scenes = scenesData || [];
          }

          // Load characters
          const { data: characters, error: charactersError } = await getClient()
            .from("characters")
            .select("*")
            .eq("project_id", projectId)
            .order("name", { ascending: true });

          if (charactersError) throw charactersError;

          // Load synopses
          const { data: synopses, error: synopsesError } = await getClient()
            .from("synopses")
            .select("*")
            .eq("project_id", projectId)
            .order("created_at", { ascending: false });

          if (synopsesError) throw synopsesError;

          dispatch({ type: "SET_CHAPTERS", payload: chapters || [] });
          dispatch({ type: "SET_SCENES", payload: scenes || [] });
          dispatch({ type: "SET_CHARACTERS", payload: characters || [] });
          dispatch({ type: "SET_SYNOPSES", payload: synopses || [] });
        } catch (error) {
          dispatch({
            type: "SET_ERROR",
            payload:
              error instanceof Error
                ? error.message
                : "Failed to load project data",
          });
        } finally {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      };
      loadProjectData(state.currentProject.id);
    }
  }, [state.currentProject]);

  const value: ProjectContextType = {
    state,
    createProject,
    updateProject,
    deleteProject,
    setCurrentProject,
    createChapter,
    updateChapter,
    deleteChapter,
    createScene,
    updateScene,
    deleteScene,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    createSynopsis,
    updateSynopsis,
    deleteSynopsis,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
