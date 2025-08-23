"use client";

import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { MetadataPanel } from "@/components/metadata/metadata-panel";
import { MobileBottomBar } from "@/components/mobile/mobile-bottom-bar";
import { MobileNavigation } from "@/components/mobile/mobile-navigation";
import { NavigationPanel } from "@/components/navigation/navigation-panel";
import { Button } from "@/components/ui/button";
import { useDeviceInfo } from "@/hooks/use-mobile";
import {
  IntegratedProjectProvider,
  useIntegratedProject,
} from "@/lib/contexts/integrated-project-context";
import { useSettings } from "@/lib/contexts/settings-context";
import type { ViewMode } from "@/lib/types";
import { BookOpen, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, use, useCallback, useMemo, useState } from "react";

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
  } = useIntegratedProject();
  const deviceInfo = useDeviceInfo();

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Memoized data with proper fallbacks
  const memoizedChapters = useMemo(() => chapters || [], [chapters]);
  const memoizedScenes = useMemo(() => scenes || [], [scenes]);
  const memoizedCharacters = useMemo(() => characters || [], [characters]);

  // Memoized handlers
  const handleItemSelect = useCallback((item: any) => {
    setSelectedItem(item);
  }, [setSelectedItem]);

  const handleAddChapter = useCallback(async () => {
    await createChapter("Novo Capítulo");
  }, [createChapter]);

  const handleAddScene = useCallback(async (chapterId: string) => {
    await createScene(chapterId, "Nova Cena");
  }, [createScene]);

  const handleAddCharacter = useCallback(async () => {
    await createCharacter("Novo Personagem");
  }, [createCharacter]);

  const { selectedItem, viewMode } = state;
  const currentScene = getCurrentScene();

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

  console.log("projeto", project)

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
    <>
      <div className="flex h-screen overflow-hidden">
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
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor */}
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 overflow-hidden">
              {selectedItem?.type === "scene" && currentScene ? (
                 <TiptapEditor
                   content={currentScene.content || ""}
                   onChange={async (content: string) => {
                     if (currentScene?.id) {
                       await updateScene(currentScene.id, { content });
                     }
                   }}
                   placeholder="Comece a escrever sua cena..."
                   className="h-full"
                   characters={memoizedCharacters}
                   locations={[]}
                 />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4" />
                    <p>Selecione uma cena para começar a escrever</p>
                  </div>
                </div>
              )}
            </div>

            {/* Metadata Panel */}
             {selectedItem?.type === "character" && (
               <MetadataPanel
                 project={project}
                 chapters={memoizedChapters}
                 scenes={memoizedScenes}
                 characters={memoizedCharacters}
                 selectedItem={selectedItem}
                 onUpdateItem={async (type: string, id: string, data: any) => {
                   if (type === "character") {
                     await updateCharacter(id, data);
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
            onFocusMode={() => {}}
            onSplitScreen={() => {}}
            showWritingActions={viewMode === "writing" && !!currentScene}
          />
        )}
      </div>
    </>
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
