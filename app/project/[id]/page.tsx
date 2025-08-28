"use client";

import { SceneHeader } from "@/components/editor/scene-header";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import {
  FocusModeManager,
  useFocusMode,
} from "@/components/focus-mode/focus-mode-manager";
import { FocusModeOverlay } from "@/components/focus-mode/focus-mode-overlay";
import { MetadataPanel } from "@/components/metadata/metadata-panel";
import { MobileBottomBar } from "@/components/mobile/mobile-bottom-bar";
import { MobileNavigation } from "@/components/mobile/mobile-navigation";
import { CharacterCreationModal } from "@/components/modals/character-creation-modal";
import { LocationCreationModal } from "@/components/modals/location-creation-modal";
import { NavigationPanel } from "@/components/navigation/navigation-panel";
import { ViewModeToolbar } from "@/components/navigation/view-mode-toolbar";
import { CorkboardView } from "@/components/project-structure/corkboard-view";
import { SplitScreenManager } from "@/components/split-screen/split-screen-manager";
import { FullPageBookLoader } from "@/components/ui/book-loader";
import { Button } from "@/components/ui/button";
import { useAutoSave, useAutoSaveStatus } from "@/hooks/use-auto-save";
import { useDeviceInfo } from "@/hooks/use-mobile";
import {
  IntegratedProjectProvider,
  useIntegratedProject,
} from "@/lib/contexts/integrated-project-context";
import { useSettings } from "@/lib/contexts/settings-context";
import type { ViewMode } from "@/lib/types";
import { BookOpen, FileText, Grid3X3, List } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, use, useCallback, useMemo, useRef, useState } from "react";

const ProjectEditorContent = memo(function ProjectEditorContent() {
  const router = useRouter();
  const { settings } = useSettings();
  const {
    state,
    project,
    chapters,
    scenes,
    characters,
    locations,
    isLoadingProject,
    projectError,
    getCurrentScene,
    setSelectedItem,
    setViewMode,
    toggleChapter,
    createChapter,
    createScene,
    createCharacter,
    createLocation,
    updateScene,
    updateCharacter,
    updateChapter,
    updateLocation,
  } = useIntegratedProject();
  const deviceInfo = useDeviceInfo();

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [isMetadataCollapsed, setIsMetadataCollapsed] = useState(false);
  const [isSplitScreenActive, setIsSplitScreenActive] = useState(false);
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Memoized data with proper fallbacks
  const memoizedChapters = useMemo(() => chapters || [], [chapters]);
  const memoizedScenes = useMemo(() => scenes || [], [scenes]);
  const memoizedCharacters = useMemo(() => characters || [], [characters]);
  const memoizedLocations = useMemo(() => locations || [], [locations]);

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

  const handleAddCharacter = useCallback(() => {
    setIsCharacterModalOpen(true);
  }, []);

  const handleAddLocation = useCallback(() => {
    setIsLocationModalOpen(true);
  }, []);

  const toggleNavigation = useCallback(() => {
    setIsNavCollapsed((prev) => !prev);
  }, []);

  const handleSceneSelect = useCallback(
    (sceneId: string) => {
      setSelectedItem({ type: "scene", id: sceneId });
    },
    [setSelectedItem]
  );

  const handleSplitScreenToggle = useCallback(() => {
    setIsSplitScreenActive((prev) => !prev);
  }, []);

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
    return <FullPageBookLoader text="Carregando projeto..." />;
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
        viewMode={state.viewMode}
        selectedItem={state.selectedItem}
        currentScene={currentScene}
        handleEditorChange={handleEditorChange}
        memoizedChapters={memoizedChapters}
        memoizedScenes={memoizedScenes}
        memoizedCharacters={memoizedCharacters}
        memoizedLocations={memoizedLocations}
        handleItemSelect={handleItemSelect}
        handleAddChapter={handleAddChapter}
        handleAddScene={handleAddScene}
        handleAddCharacter={handleAddCharacter}
        handleAddLocation={handleAddLocation}
        isMobileNavOpen={isMobileNavOpen}
        setIsMobileNavOpen={setIsMobileNavOpen}
        handleSceneSelect={handleSceneSelect}
        autoSaveStatus={autoSaveStatus}
        isNavCollapsed={isNavCollapsed}
        toggleNavigation={toggleNavigation}
        isMetadataCollapsed={isMetadataCollapsed}
        setIsMetadataCollapsed={setIsMetadataCollapsed}
        isSplitScreenActive={isSplitScreenActive}
        handleSplitScreenToggle={handleSplitScreenToggle}
        isCharacterModalOpen={isCharacterModalOpen}
        setIsCharacterModalOpen={setIsCharacterModalOpen}
        isLocationModalOpen={isLocationModalOpen}
        setIsLocationModalOpen={setIsLocationModalOpen}
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
  memoizedLocations,
  handleItemSelect,
  handleAddChapter,
  handleAddScene,
  handleAddCharacter,
  handleAddLocation,
  isMobileNavOpen,
  setIsMobileNavOpen,
  handleSceneSelect,
  autoSaveStatus,
  isNavCollapsed,
  toggleNavigation,
  isMetadataCollapsed,
  setIsMetadataCollapsed,
  isSplitScreenActive,
  handleSplitScreenToggle,
  isCharacterModalOpen,
  setIsCharacterModalOpen,
  isLocationModalOpen,
  setIsLocationModalOpen,
}: any) {
  const { isFocusMode, exitFocusMode, toggleFocusMode } = useFocusMode();

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-gradient-to-tr from-escrivania-purple-500/8 to-escrivania-blue-500/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-gradient-to-tl from-escrivania-blue-500/12 to-escrivania-purple-500/12 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-br from-escrivania-purple-500/6 to-escrivania-blue-500/6 rounded-full blur-3xl" />
      </div>

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
          locations={memoizedLocations}
          selectedItem={selectedItem}
          onItemSelect={handleItemSelect}
          onAddChapter={handleAddChapter}
          onAddScene={handleAddScene}
          onAddCharacter={handleAddCharacter}
          onAddLocation={handleAddLocation}
          expandedChapters={state.expandedChapters}
          onToggleChapter={toggleChapter}
        />
      )}

      {/* Desktop Navigation Panel */}
      {!deviceInfo.isMobile && (
        <div
          className={`${isNavCollapsed ? "w-16" : "w-64"} flex-shrink-0 transition-all duration-300 ease-in-out relative`}
        >
          {/* Navigation Panel */}
          <div
            className={`${isNavCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"} transition-all duration-300 ease-in-out h-full`}
          >
            <NavigationPanel
              project={project}
              chapters={memoizedChapters}
              scenes={memoizedScenes}
              characters={memoizedCharacters}
              locations={memoizedLocations}
              selectedItem={selectedItem}
              onItemSelect={handleItemSelect}
              onAddChapter={handleAddChapter}
              onAddScene={handleAddScene}
              onAddCharacter={handleAddCharacter}
              onAddLocation={handleAddLocation}
              expandedChapters={state.expandedChapters}
              onToggleChapter={toggleChapter}
            />
          </div>
          {/* Collapsed State Mini Navigation */}
          {isNavCollapsed && (
            <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/70 to-white/50 backdrop-blur-md border-r border-white/60 flex flex-col items-center py-6 gap-4 shadow-lg">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--secondary)]/20 border border-white/40 shadow-sm">
                <BookOpen className="h-5 w-5 text-[var(--primary)]" />
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-11 w-11 rounded-xl hover:bg-gradient-to-r hover:from-[var(--primary)]/10 hover:to-[var(--secondary)]/10 border border-transparent hover:border-[var(--primary)]/20 transition-all duration-200"
                  onClick={() => setViewMode("writing")}
                >
                  <FileText className="h-4 w-4 text-[var(--primary)]" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-11 w-11 rounded-xl hover:bg-gradient-to-r hover:from-[var(--primary)]/10 hover:to-[var(--secondary)]/10 border border-transparent hover:border-[var(--primary)]/20 transition-all duration-200"
                  onClick={() => setViewMode("corkboard")}
                >
                  <Grid3X3 className="h-4 w-4 text-[var(--primary)]" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-11 w-11 rounded-xl hover:bg-gradient-to-r hover:from-[var(--primary)]/10 hover:to-[var(--secondary)]/10 border border-transparent hover:border-[var(--primary)]/20 transition-all duration-200"
                  onClick={() => setViewMode("outline")}
                >
                  <List className="h-4 w-4 text-[var(--primary)]" />
                </Button>
              </div>
            </div>
          )}
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
            isSplitScreenActive={isSplitScreenActive}
            onSplitScreenToggle={handleSplitScreenToggle}
          />
        )}

        {/* Content based on view mode */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          {isSplitScreenActive ? (
            <SplitScreenManager
              isActive={isSplitScreenActive}
              currentScene={currentScene}
              characters={memoizedCharacters}
              locations={memoizedLocations}
              scenes={memoizedScenes}
              onSceneChange={handleEditorChange}
              onCreateScene={handleAddScene}
              onCreateCharacter={handleAddCharacter}
              onClose={handleSplitScreenToggle}
            />
          ) : (
            <div className="flex-1 overflow-hidden min-w-0">
              {viewMode === "writing" ? (
                selectedItem?.type === "scene" && currentScene ? (
                  <div className="h-full flex flex-col">
                    {/* Scene Header with Auto-save status and New Scene button */}
                    <SceneHeader
                      sceneTitle={currentScene.title}
                      autoSaveStatus={autoSaveStatus}
                      onNewScene={() => {
                        const chapterId = currentScene.chapter_id;
                        if (chapterId) {
                          handleAddScene(chapterId);
                        }
                      }}
                    />
                    <TiptapEditor
                      content={currentScene.content || {}}
                      onChange={handleEditorChange}
                      placeholder="Comece a escrever sua cena..."
                      className="flex-1 border-0"
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
                    selectedItem?.type === "chapter"
                      ? selectedItem.id
                      : undefined
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
          )}

          {/* Metadata Panel */}
          {(selectedItem?.type === "character" ||
            selectedItem?.type === "scene" ||
            selectedItem?.type === "chapter" ||
            selectedItem?.type === "location") && (
            <MetadataPanel
              project={project}
              chapters={memoizedChapters}
              scenes={memoizedScenes}
              characters={memoizedCharacters}
              locations={memoizedLocations}
              selectedItem={selectedItem}
              onUpdateItem={async (type: string, id: string, data: any) => {
                if (type === "character") {
                  await updateCharacter(id, data);
                } else if (type === "scene") {
                  await updateScene(id, data);
                } else if (type === "chapter") {
                  await updateChapter(id, data);
                } else if (type === "location") {
                  await updateLocation(id, data);
                }
              }}
              isCollapsed={isMetadataCollapsed}
              onToggleCollapse={() =>
                setIsMetadataCollapsed(!isMetadataCollapsed)
              }
              className={`transition-all duration-300 ${
                isMetadataCollapsed
                  ? "w-12"
                  : deviceInfo.isMacbook
                    ? "w-64"
                    : "w-80"
              }`}
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

      {/* Character Creation Modal */}
      <CharacterCreationModal
        isOpen={isCharacterModalOpen}
        onClose={() => setIsCharacterModalOpen(false)}
      />

      {/* Location Creation Modal */}
      <LocationCreationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
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
