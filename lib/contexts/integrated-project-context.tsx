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
  useScenes,
  useUpdateScene,
} from "@/hooks/use-scenes";
import {
  useCreateSynopsis,
  useDeleteSynopsis,
  useSynopses,
  useUpdateSynopsis,
} from "@/hooks/use-synopses";
import { useUser } from "@/lib/hooks/use-auth";
import type { Tables } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import type React from "react";
import { createContext, useContext, useState } from "react";
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

  // Current items
  getCurrentScene: () => Tables<"scenes"> | undefined;
  getCurrentCharacter: () => Tables<"characters"> | undefined;
  getCurrentChapter: () => Tables<"chapters"> | undefined;

  // Actions
  setSelectedItem: (item: ISelectedItem) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleChapter: (chapterId: string) => void;

  // CRUD Actions
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
  const router = useRouter();
  const { user, loading: userLoading } = useUser();

  const [state, setState] = useState<IntegratedProjectState>({
    selectedItem: null,
    viewMode: "writing",
    expandedChapters: new Set<string>(),
  });

  // React Query hooks
  const { data: project, isLoading: isLoadingProject, error: projectError } = useProject(
    projectId,
    user?.id || ""
  );
  const { data: chapters = [], isLoading: isLoadingChapters } = useChapters(
    projectId,
    user?.id || ""
  );
  const { data: scenes = [], isLoading: isLoadingScenes } = useScenes(
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

  // Helper functions
  const getCurrentScene = (): Tables<"scenes"> | undefined => {
    if (!state.selectedItem || state.selectedItem.type !== "scene") {
      return undefined;
    }
    return scenes.find((s) => s.id === state.selectedItem!.id);
  };

  const getCurrentCharacter = (): Tables<"characters"> | undefined => {
    if (!state.selectedItem || state.selectedItem.type !== "character") {
      return undefined;
    }
    return characters.find((c) => c.id === state.selectedItem!.id);
  };

  const getCurrentChapter = (): Tables<"chapters"> | undefined => {
    if (!state.selectedItem || state.selectedItem.type !== "chapter") {
      return undefined;
    }
    return chapters.find((c) => c.id === state.selectedItem!.id);
  };

  // State actions
  const setSelectedItem = (item: ISelectedItem) => {
    setState((prev) => ({ ...prev, selectedItem: item }));
  };

  const setViewMode = (mode: ViewMode) => {
    setState((prev) => ({ ...prev, viewMode: mode }));
  };

  const toggleChapter = (chapterId: string) => {
    setState((prev) => {
      const newExpanded = new Set(prev.expandedChapters);
      if (newExpanded.has(chapterId)) {
        newExpanded.delete(chapterId);
      } else {
        newExpanded.add(chapterId);
      }
      return { ...prev, expandedChapters: newExpanded };
    });
  };

  // CRUD actions
  const createChapter = async (title: string, synopsis?: string) => {
    if (!user?.id) return;

    const maxOrder =
      chapters.length > 0 ? Math.max(...chapters.map((c) => c.order_index)) : 0;

    await createChapterMutation.mutateAsync({
      title,
      description: synopsis || "",
      project_id: projectId,
      order_index: maxOrder + 1,
      userId: user.id,
    });
  };

  const updateChapter = async (
    id: string,
    data: Partial<Tables<"chapters">>
  ) => {
    if (!user?.id) return;
    await updateChapterMutation.mutateAsync({ id, data, userId: user.id });
  };

  const deleteChapter = async (id: string) => {
    if (!user?.id) return;
    await deleteChapterMutation.mutateAsync({ id, userId: user.id });
  };

  const reorderChapters = async (
    chaptersData: { id: string; order_index: number }[]
  ) => {
    if (!user?.id) return;
    await reorderChaptersMutation.mutateAsync({
      chapters: chaptersData,
      userId: user.id,
    });
  };

  const createScene = async (
    chapterId: string,
    title: string,
    content?: string
  ) => {
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
  };

  const updateScene = async (id: string, data: Partial<Tables<"scenes">>) => {
    if (!user?.id) return;
    await updateSceneMutation.mutateAsync({ id, data, userId: user.id });
  };

  const deleteScene = async (id: string) => {
    if (!user?.id) return;
    await deleteSceneMutation.mutateAsync({ id, userId: user.id });
  };

  const reorderScenes = async (
    scenesData: { id: string; order_index: number }[]
  ) => {
    if (!user?.id) return;
    await reorderScenesMutation.mutateAsync({
      scenes: scenesData,
      userId: user.id,
    });
  };

  const createCharacter = async (name: string, description?: string) => {
    if (!user?.id) return;

    await createCharacterMutation.mutateAsync({
      name,
      description: description || "",
      project_id: projectId,
      userId: user.id,
    });
  };

  const updateCharacter = async (
    id: string,
    data: Partial<Tables<"characters">>
  ) => {
    if (!user?.id) return;
    await updateCharacterMutation.mutateAsync({ id, data, userId: user.id });
  };

  const deleteCharacter = async (id: string) => {
    if (!user?.id) return;
    await deleteCharacterMutation.mutateAsync({ id, userId: user.id });
  };

  const createSynopsis = async (title: string, content?: string) => {
    if (!user?.id) return;

    await createSynopsisMutation.mutateAsync({
      title,
      content: content || "",
      project_id: projectId,
      userId: user.id,
    });
  };

  const updateSynopsis = async (
    id: string,
    data: Partial<Tables<"synopses">>
  ) => {
    if (!user?.id) return;
    await updateSynopsisMutation.mutateAsync({ id, data, userId: user.id });
  };

  const deleteSynopsis = async (id: string) => {
    if (!user?.id) return;
    await deleteSynopsisMutation.mutateAsync({ id, userId: user.id });
  };

  return (
    <IntegratedProjectContext.Provider
      value={{
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
      }}
    >
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
