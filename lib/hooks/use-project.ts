import { useActiveProject } from "../contexts/active-project-context"

export function useProject() {
  const context = useActiveProject()

  if (!context) {
    throw new Error("useProject must be used within an ActiveProjectProvider")
  }

  return {
    // State
    project: context.state.projectData,
    selectedItem: context.state.selectedItem,
    viewMode: context.state.viewMode,
    loading: context.state.loading,

    // Current items
    currentScene: context.getCurrentScene(),
    currentCharacter: context.getCurrentCharacter(),
    currentLocation: context.getCurrentLocation(),

    // Actions
    actions: {
      loadProject: context.loadProject,
      updateSceneContent: context.updateSceneContent,
      updateSceneSynopsis: context.updateSceneSynopsis,
      updateSceneStatus: context.updateSceneStatus,
      updateSceneTags: context.updateSceneTags,
      addChapter: context.addChapter,
      deleteChapter: context.deleteChapter,
      addScene: context.addScene,
      deleteScene: context.deleteScene,
      duplicateScene: context.duplicateScene,
      addCharacter: context.addCharacter,
      updateCharacter: context.updateCharacter,
      deleteCharacter: context.deleteCharacter,
      addLocation: context.addLocation,
      updateLocation: context.updateLocation,
      deleteLocation: context.deleteLocation,
      setViewMode: context.setViewMode,
      setSelectedItem: context.setSelectedItem,
      toggleChapter: context.toggleChapter,
    },
  }
}
