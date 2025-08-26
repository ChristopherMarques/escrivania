"use client";

import {
  useChapters,
  useCreateChapter,
  useDeleteChapter,
  useReorderChapters,
  useUpdateChapter,
} from "@/hooks/use-chapters";
import {
  useCharacters,
  useCreateCharacter,
  useDeleteCharacter,
  useUpdateCharacter,
} from "@/hooks/use-characters";
import { useProject } from "@/hooks/use-projects";
import {
  useCreateScene,
  useDeleteScene,
  useReorderScenes,
  useScenesByProject,
  useUpdateScene,
} from "@/hooks/use-scenes";
import {
  useCreateSynopsis,
  useDeleteSynopsis,
  useSynopses,
  useUpdateSynopsis,
} from "@/hooks/use-synopses";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables } from "@/lib/supabase";
import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import type { ISelectedItem, ViewMode } from "../types";

interface IntegratedProjectState {
  selectedItem: ISelectedItem | null;
  viewMode: ViewMode;
  expandedChapters: Set<string>;
}

interface IntegratedProjectContextType {
  // State
  state: IntegratedProjectState;

  // Data from React Query
  project: Tables<"projects"> | undefined;
  chapters: Tables<"chapters">[] | undefined;
  scenes: Tables<"scenes">[] | undefined;
  characters: Tables<"characters">[] | undefined;
  synopses: Tables<"synopses">[] | undefined;

  // Loading states
  isLoadingProject: boolean;
  isLoadingChapters: boolean;
  isLoadingScenes: boolean;
  isLoadingCharacters: boolean;
  isLoadingSynopses: boolean;

  // Error states
  projectError: Error | null;

  // Current items (memoized)
  getCurrentScene: () => Tables<"scenes"> | undefined;
  getCurrentCharacter: () => Tables<"characters"> | undefined;
  getCurrentChapter: () => Tables<"chapters"> | undefined;

  // Actions (memoized)
  setSelectedItem: (item: ISelectedItem) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleChapter: (chapterId: string) => void;

  // CRUD Actions (memoized)
  createChapter: (title: string, synopsis?: string) => Promise<void>;
  updateChapter: (
    id: string,
    data: Partial<Tables<"chapters">>
  ) => Promise<void>;
  deleteChapter: (id: string) => Promise<void>;
  reorderChapters: (
    chapters: { id: string; order_index: number }[]
  ) => Promise<void>;

  createScene: (
    chapterId: string,
    title: string,
    content?: string
  ) => Promise<void>;
  updateScene: (id: string, data: Partial<Tables<"scenes">>) => Promise<void>;
  deleteScene: (id: string) => Promise<void>;
  reorderScenes: (
    scenes: { id: string; order_index: number }[]
  ) => Promise<void>;

  createCharacter: (
    name: string,
    description?: string,
    role?: string
  ) => Promise<void>;
  updateCharacter: (
    id: string,
    data: Partial<Tables<"characters">>
  ) => Promise<void>;
  deleteCharacter: (id: string) => Promise<void>;

  createSynopsis: (title: string, content?: string) => Promise<void>;
  updateSynopsis: (
    id: string,
    data: Partial<Tables<"synopses">>
  ) => Promise<void>;
  deleteSynopsis: (id: string) => Promise<void>;
}

const IntegratedProjectContext = createContext<
  IntegratedProjectContextType | undefined
>(undefined);

interface IntegratedProjectProviderProps {
  children: React.ReactNode;
  projectId: string;
}

export function IntegratedProjectProvider({
  children,
  projectId,
}: IntegratedProjectProviderProps) {
  const { user, loading: authLoading } = useAuth();

  // Local state with initial values
  const [state, setState] = useState<IntegratedProjectState>({
    selectedItem: null,
    viewMode: "writing" as ViewMode,
    expandedChapters: new Set<string>(),
  });

  // React Query hooks - wait for authentication to complete
  const {
    data: project,
    isLoading: isLoadingProject,
    error: projectError,
  } = useProject(projectId, user?.id || "");

  const { data: chapters = [], isLoading: isLoadingChapters } = useChapters(
    projectId,
    user?.id || ""
  );

  const { data: scenes = [], isLoading: isLoadingScenes } = useScenesByProject(
    projectId,
    user?.id || ""
  );

  const { data: characters = [], isLoading: isLoadingCharacters } =
    useCharacters(projectId, user?.id || "");

  const { data: synopses = [], isLoading: isLoadingSynopses } = useSynopses(
    projectId,
    user?.id || ""
  );

  // Mutation hooks
  const createChapterMutation = useCreateChapter();
  const updateChapterMutation = useUpdateChapter();
  const deleteChapterMutation = useDeleteChapter();
  const reorderChaptersMutation = useReorderChapters();

  const createSceneMutation = useCreateScene();
  const updateSceneMutation = useUpdateScene();
  const deleteSceneMutation = useDeleteScene();
  const reorderScenesMutation = useReorderScenes();

  const createCharacterMutation = useCreateCharacter();
  const updateCharacterMutation = useUpdateCharacter();
  const deleteCharacterMutation = useDeleteCharacter();

  const createSynopsisMutation = useCreateSynopsis();
  const updateSynopsisMutation = useUpdateSynopsis();
  const deleteSynopsisMutation = useDeleteSynopsis();

  // Memoized current item getters
  const getCurrentScene = useCallback(() => {
    if (state.selectedItem?.type !== "scene" || !scenes) return undefined;
    return scenes.find((scene) => scene.id === state.selectedItem?.id);
  }, [state.selectedItem, scenes]);

  const getCurrentCharacter = useCallback(() => {
    if (state.selectedItem?.type !== "character" || !characters)
      return undefined;
    return characters.find(
      (character) => character.id === state.selectedItem?.id
    );
  }, [state.selectedItem, characters]);

  const getCurrentChapter = useCallback(() => {
    if (state.selectedItem?.type !== "chapter" || !chapters) return undefined;
    return chapters.find((chapter) => chapter.id === state.selectedItem?.id);
  }, [state.selectedItem, chapters]);

  // Memoized state actions
  const setSelectedItem = useCallback((item: ISelectedItem) => {
    setState((prev) => ({ ...prev, selectedItem: item }));
  }, []);

  const setViewMode = useCallback((mode: ViewMode) => {
    setState((prev) => ({ ...prev, viewMode: mode }));
  }, []);

  const toggleChapter = useCallback((chapterId: string) => {
    setState((prev) => {
      const newExpandedChapters = new Set(prev.expandedChapters);
      if (newExpandedChapters.has(chapterId)) {
        newExpandedChapters.delete(chapterId);
      } else {
        newExpandedChapters.add(chapterId);
      }
      return { ...prev, expandedChapters: newExpandedChapters };
    });
  }, []);

  // Memoized CRUD actions
  const createChapter = useCallback(
    async (title: string, synopsis?: string) => {
      if (!user?.id) return;

      const maxOrder =
        chapters.length > 0
          ? Math.max(...chapters.map((c) => c.order_index))
          : 0;

      await createChapterMutation.mutateAsync({
        title,
        description: synopsis || "",
        project_id: projectId,
        order_index: maxOrder + 1,
        userId: user.id,
      });
    },
    [user?.id, projectId, createChapterMutation, chapters]
  );

  const updateChapter = useCallback(
    async (id: string, data: Partial<Tables<"chapters">>) => {
      if (!user?.id) return;
      await updateChapterMutation.mutateAsync({ id, data, userId: user.id });
    },
    [user?.id, updateChapterMutation]
  );

  const deleteChapter = useCallback(
    async (id: string) => {
      if (!user?.id) return;
      await deleteChapterMutation.mutateAsync({ id, userId: user.id });
    },
    [user?.id, deleteChapterMutation]
  );

  const reorderChapters = useCallback(
    async (chaptersData: { id: string; order_index: number }[]) => {
      if (!user?.id) return;
      await reorderChaptersMutation.mutateAsync({
        chapters: chaptersData,
        userId: user.id,
      });
    },
    [user?.id, reorderChaptersMutation]
  );

  const createScene = useCallback(
    async (chapterId: string, title: string, content?: string) => {
      if (!user?.id) return;

      const chapterScenes = scenes.filter((s) => s.chapter_id === chapterId);
      const maxOrder =
        chapterScenes.length > 0
          ? Math.max(...chapterScenes.map((s) => s.order_index))
          : 0;

      await createSceneMutation.mutateAsync({
        title,
        content: content || null,
        chapter_id: chapterId,
        order_index: maxOrder + 1,
        userId: user.id,
      });
    },
    [user?.id, createSceneMutation, scenes]
  );

  const updateScene = useCallback(
    async (id: string, data: Partial<Tables<"scenes">>) => {
      if (!user?.id) return;
      await updateSceneMutation.mutateAsync({ id, data, userId: user.id });
    },
    [user?.id, updateSceneMutation]
  );

  const deleteScene = useCallback(
    async (id: string) => {
      if (!user?.id) return;
      await deleteSceneMutation.mutateAsync({ id, userId: user.id });
    },
    [user?.id, deleteSceneMutation]
  );

  const reorderScenes = useCallback(
    async (scenesData: { id: string; order_index: number }[]) => {
      if (!user?.id) return;
      await reorderScenesMutation.mutateAsync({
        scenes: scenesData,
        userId: user.id,
      });
    },
    [user?.id, reorderScenesMutation]
  );

  const createCharacter = useCallback(
    async (name: string, description?: string, role?: string) => {
      if (!user?.id) return;
      await createCharacterMutation.mutateAsync({
        name,
        description: description || "",
        project_id: projectId,
        userId: user.id,
      });
    },
    [user?.id, projectId, createCharacterMutation]
  );

  const updateCharacter = useCallback(
    async (id: string, data: Partial<Tables<"characters">>) => {
      if (!user?.id) return;
      await updateCharacterMutation.mutateAsync({ id, data, userId: user.id });
    },
    [user?.id, updateCharacterMutation]
  );

  const deleteCharacter = useCallback(
    async (id: string) => {
      if (!user?.id) return;
      await deleteCharacterMutation.mutateAsync({ id, userId: user.id });
    },
    [user?.id, deleteCharacterMutation]
  );

  const createSynopsis = useCallback(
    async (title: string, content?: string) => {
      if (!user?.id) return;
      await createSynopsisMutation.mutateAsync({
        title,
        content: content || "",
        project_id: projectId,
        userId: user.id,
      });
    },
    [user?.id, projectId, createSynopsisMutation]
  );

  const updateSynopsis = useCallback(
    async (id: string, data: Partial<Tables<"synopses">>) => {
      if (!user?.id) return;
      await updateSynopsisMutation.mutateAsync({ id, data, userId: user.id });
    },
    [user?.id, updateSynopsisMutation]
  );

  const deleteSynopsis = useCallback(
    async (id: string) => {
      if (!user?.id) return;
      await deleteSynopsisMutation.mutateAsync({ id, userId: user.id });
    },
    [user?.id, deleteSynopsisMutation]
  );

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      state,
      project,
      chapters,
      scenes,
      characters,
      synopses,
      isLoadingProject,
      isLoadingChapters,
      isLoadingScenes,
      isLoadingCharacters,
      isLoadingSynopses,
      projectError,
      getCurrentScene,
      getCurrentCharacter,
      getCurrentChapter,
      setSelectedItem,
      setViewMode,
      toggleChapter,
      createChapter,
      updateChapter,
      deleteChapter,
      reorderChapters,
      createScene,
      updateScene,
      deleteScene,
      reorderScenes,
      createCharacter,
      updateCharacter,
      deleteCharacter,
      createSynopsis,
      updateSynopsis,
      deleteSynopsis,
    }),
    [
      state,
      project,
      chapters,
      scenes,
      characters,
      synopses,
      isLoadingProject,
      isLoadingChapters,
      isLoadingScenes,
      isLoadingCharacters,
      isLoadingSynopses,
      projectError,
      getCurrentScene,
      getCurrentCharacter,
      getCurrentChapter,
      setSelectedItem,
      setViewMode,
      toggleChapter,
      createChapter,
      updateChapter,
      deleteChapter,
      reorderChapters,
      createScene,
      updateScene,
      deleteScene,
      reorderScenes,
      createCharacter,
      updateCharacter,
      deleteCharacter,
      createSynopsis,
      updateSynopsis,
      deleteSynopsis,
    ]
  );

  return (
    <IntegratedProjectContext.Provider value={contextValue}>
      {children}
    </IntegratedProjectContext.Provider>
  );
}

export function useIntegratedProject() {
  const context = useContext(IntegratedProjectContext);
  if (context === undefined) {
    throw new Error(
      "useIntegratedProject must be used within an IntegratedProjectProvider"
    );
  }
  return context;
}
