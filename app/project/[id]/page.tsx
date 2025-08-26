"use client";

import { TiptapEditor } from "@/components/editor/tiptap-editor";
import {
  FocusModeManager,
  useFocusMode,
} from "@/components/focus-mode/focus-mode-manager";
import { FocusModeOverlay } from "@/components/focus-mode/focus-mode-overlay";
import { MetadataPanel } from "@/components/metadata/metadata-panel";
import { MobileBottomBar } from "@/components/mobile/mobile-bottom-bar";
import { MobileNavigation } from "@/components/mobile/mobile-navigation";
import { NavigationPanel } from "@/components/navigation/navigation-panel";
import { ViewModeToolbar } from "@/components/navigation/view-mode-toolbar";
import { CorkboardView } from "@/components/project-structure/corkboard-view";
import { Button } from "@/components/ui/button";
import { useDeviceInfo } from "@/hooks/use-mobile";
import {
  IntegratedProjectProvider,
  useIntegratedProject,
} from "@/lib/contexts/integrated-project-context";
import { useSettings } from "@/lib/contexts/settings-context";
import type { ViewMode } from "@/lib/types";
import { BookOpen, FileText, Grid3X3, List } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, use, useCallback, useMemo, useState, useRef } from "react";
import { useAutoSave, useAutoSaveStatus } from "@/hooks/use-auto-save";

const ProjectEditorContent = memo(function ProjectEditorContent() {
  const router = useRouter();
  const { settings } = useSettings();
  const {
    state,
    project,
    chapters,
    scenes,
    characters,
    isLoadingProject,
    projectError,
    getCurrentScene,
    setSelectedItem,
    setViewMode,
    toggleChapter,
    createChapter,
    createScene,
    createCharacter,
    updateScene,
    updateCharacter,
    updateChapter,
  } = useIntegratedProject();
  const deviceInfo = useDeviceInfo();

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Memoized data with proper fallbacks
  const memoizedChapters = useMemo(() => chapters || [], [chapters]);
  const memoizedScenes = useMemo(() => scenes || [], [scenes]);
  const memoizedCharacters = useMemo(() => characters || [], [characters]);

  // Memoized handlers
  const handleItemSelect = useCallback(
    (item: any) => {
      setSelectedItem(item);
      // Automatically switch to writing mode when a scene is selected
      if (item?.type === "scene") {
        setViewMode("writing");
      }
    },
    [setSelectedItem, setViewMode]
  );

  const handleAddChapter = useCallback(async () => {
    await createChapter("Novo Capítulo");
  }, [createChapter]);

  const handleAddScene = useCallback(
    async (chapterId: string) => {
      await createScene(chapterId, "Nova Cena");
    },
    [createScene]
  );

  const handleAddCharacter = useCallback(async () => {
    await createCharacter("Novo Personagem");
  }, [createCharacter]);

  const handleSceneSelect = useCallback(
    (sceneId: string) => {
      setSelectedItem({ type: "scene", id: sceneId });
    },
    [setSelectedItem]
  );

  const { selectedItem, viewMode } = state;
  const currentScene = getCurrentScene();

  // Auto-save configuration with optimized debounce
  const autoSave = useAutoSave(
    async () => {
      if (currentScene?.id && pendingContent.current) {
        await updateScene(currentScene.id, { content: pendingContent.current });
        pendingContent.current = null;
      }
    },
    {
      debounceDelay: 3000, // 3 seconds - more time to let user finish typing
      interval: 60000, // 1 minute backup save
      showNotifications: false, // Disable notifications for better UX
      enabled: true,
    }
  );

  // Ref to store pending content for auto-save
  const pendingContent = useRef<any>(null);

  // Auto-save status for UI feedback
  const autoSaveStatus = useAutoSaveStatus(autoSave);

  // Memoize editor onChange handler with auto-save integration
  const handleEditorChange = useCallback(
    (content: any) => {
      if (currentScene?.id && content) {
        // Validate content structure
        if (!content.type || !Array.isArray(content.content)) {
          console.warn("Invalid content structure received:", content);
          return;
        }

        // Extract text content for comparison
        const extractText = (contentObj: any): string => {
          if (!contentObj || !Array.isArray(contentObj.content)) return "";
          return contentObj.content
            .map((node: any) => {
              if (node.type === "text") return node.text || "";
              if (node.content) return extractText(node);
              return "";
            })
            .join("");
        };

        const currentText = extractText(currentScene.content || {});
        const newText = extractText(content);

        // Only trigger auto-save if text content is actually different
        if (currentText !== newText) {
          pendingContent.current = content;
          autoSave.markAsChanged();
        }
      }
    },
    [currentScene?.id, currentScene?.content, autoSave]
  );

  // Loading state
  if (isLoadingProject) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando projeto...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (projectError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Erro ao carregar projeto</p>
          <Button onClick={() => router.push("/")} variant="outline">
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // No project state
  if (!project) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Projeto não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <FocusModeManager>
      <ProjectEditorInner
        router={router}
        settings={settings}
        state={state}
        project={project}
        chapters={chapters}
        scenes={scenes}
        characters={characters}
        isLoadingProject={isLoadingProject}
        projectError={projectError}
        getCurrentScene={getCurrentScene}
        setSelectedItem={setSelectedItem}
        setViewMode={setViewMode}
        toggleChapter={toggleChapter}
        createChapter={createChapter}
        createScene={createScene}
        createCharacter={createCharacter}
        updateScene={updateScene}
        updateCharacter={updateCharacter}
        updateChapter={updateChapter}
        deviceInfo={deviceInfo}
        viewMode={viewMode}
        selectedItem={selectedItem}
        currentScene={currentScene}
        handleEditorChange={handleEditorChange}
        memoizedChapters={memoizedChapters}
        memoizedScenes={memoizedScenes}
        memoizedCharacters={memoizedCharacters}
        handleItemSelect={handleItemSelect}
        handleAddChapter={handleAddChapter}
        handleAddScene={handleAddScene}
        handleAddCharacter={handleAddCharacter}
        isMobileNavOpen={isMobileNavOpen}
        setIsMobileNavOpen={setIsMobileNavOpen}
        handleSceneSelect={handleSceneSelect}
        autoSaveStatus={autoSaveStatus}
      />
    </FocusModeManager>
  );
});

const ProjectEditorInner = memo(function ProjectEditorInner({
  router,
  settings,
  state,
  project,
  chapters,
  scenes,
  characters,
  isLoadingProject,
  projectError,
  getCurrentScene,
  setSelectedItem,
  setViewMode,
  toggleChapter,
  createChapter,
  createScene,
  createCharacter,
  updateScene,
  updateCharacter,
  updateChapter,
  deviceInfo,
  viewMode,
  selectedItem,
  currentScene,
  handleEditorChange,
  memoizedChapters,
  memoizedScenes,
  memoizedCharacters,
  handleItemSelect,
  handleAddChapter,
  handleAddScene,
  handleAddCharacter,
  isMobileNavOpen,
  setIsMobileNavOpen,
  handleSceneSelect,
  autoSaveStatus,
}: any) {
  const { isFocusMode, exitFocusMode, toggleFocusMode } = useFocusMode();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Focus Mode Overlay */}
      <FocusModeOverlay
        isOpen={isFocusMode}
        onClose={exitFocusMode}
        content={currentScene?.content || null}
        onChange={handleEditorChange}
        characters={memoizedCharacters}
        locations={[]}
        autoSaveStatus={autoSaveStatus}
      />
      {/* Mobile Navigation */}
      {deviceInfo.isMobile && (
        <MobileNavigation
          project={project}
          chapters={memoizedChapters}
          scenes={memoizedScenes}
          characters={memoizedCharacters}
          selectedItem={selectedItem}
          onItemSelect={handleItemSelect}
          onAddChapter={handleAddChapter}
          onAddScene={handleAddScene}
          onAddCharacter={handleAddCharacter}
          onAddLocation={() => {}}
          expandedChapters={state.expandedChapters}
          onToggleChapter={toggleChapter}
        />
      )}

      {/* Desktop Navigation Panel */}
      {!deviceInfo.isMobile && (
        <div className="w-64 flex-shrink-0">
          <NavigationPanel
            project={project}
            chapters={memoizedChapters}
            scenes={memoizedScenes}
            characters={memoizedCharacters}
            selectedItem={selectedItem}
            onItemSelect={handleItemSelect}
            onAddChapter={handleAddChapter}
            onAddScene={handleAddScene}
            onAddCharacter={handleAddCharacter}
            onAddLocation={() => {}}
            expandedChapters={state.expandedChapters}
            onToggleChapter={toggleChapter}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* View Mode Toolbar */}
        {!deviceInfo.isMobile && (
          <ViewModeToolbar
            viewMode={viewMode}
            onViewModeChange={(mode) => setViewMode(mode as ViewMode)}
            projectTitle={project?.title}
          />
        )}

        {/* Content based on view mode */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          <div className="flex-1 overflow-hidden min-w-0">
            {viewMode === "writing" ? (
              selectedItem?.type === "scene" && currentScene ? (
                <div className="h-full flex flex-col">
                  {/* Auto-save status indicator */}
                  <div className="flex-shrink-0 px-4 py-2 border-b bg-muted/30">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {currentScene.title}
                      </div>
                      <div className={`text-xs ${autoSaveStatus.statusColor}`}>
                        {autoSaveStatus.statusText}
                      </div>
                    </div>
                  </div>
                  <TiptapEditor
                    content={currentScene.content || {}}
                    onChange={handleEditorChange}
                    placeholder="Comece a escrever sua cena..."
                    className="flex-1"
                    characters={memoizedCharacters}
                    locations={[]}
                  />
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4" />
                    <p>Selecione uma cena para começar a escrever</p>
                  </div>
                </div>
              )
            ) : viewMode === "corkboard" ? (
              <CorkboardView
                chapters={memoizedChapters}
                scenes={memoizedScenes}
                selectedChapterId={
                  selectedItem?.type === "chapter" ? selectedItem.id : undefined
                }
                onSceneSelect={handleSceneSelect}
                onSceneUpdate={updateScene}
                onSceneCreate={handleAddScene}
                onSceneDelete={async (sceneId) => {
                  // TODO: Implement scene deletion
                  console.log("Delete scene:", sceneId);
                }}
                className="h-full"
              />
            ) : viewMode === "outliner" ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <List className="h-12 w-12 mx-auto mb-4" />
                  <p>Modo Estrutura em desenvolvimento</p>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Grid3X3 className="h-12 w-12 mx-auto mb-4" />
                  <p>Selecione um modo de visualização</p>
                </div>
              </div>
            )}
          </div>

          {/* Metadata Panel */}
          {(selectedItem?.type === "character" ||
            selectedItem?.type === "scene" ||
            selectedItem?.type === "chapter") && (
            <MetadataPanel
              project={project}
              chapters={memoizedChapters}
              scenes={memoizedScenes}
              characters={memoizedCharacters}
              selectedItem={selectedItem}
              onUpdateItem={async (type: string, id: string, data: any) => {
                if (type === "character") {
                  await updateCharacter(id, data);
                } else if (type === "scene") {
                  await updateScene(id, data);
                } else if (type === "chapter") {
                  await updateChapter(id, data);
                }
              }}
              className={`${deviceInfo.isMacbook ? "w-64" : "w-80"}`}
            />
          )}
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      {deviceInfo.isMobile && (
        <MobileBottomBar
          viewMode={viewMode}
          onViewModeChange={(mode) => setViewMode(mode as ViewMode)}
          onFocusMode={toggleFocusMode}
          onSplitScreen={() => {}}
          showWritingActions={viewMode === "writing" && !!currentScene}
        />
      )}
    </div>
  );
});

export default function ProjectEditor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;

  return (
    <IntegratedProjectProvider projectId={projectId}>
      <ProjectEditorContent />
    </IntegratedProjectProvider>
  );
}
