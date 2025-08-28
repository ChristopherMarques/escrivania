"use client";

import { useIntegratedProject } from "@/lib/contexts/integrated-project-context";
import type { Location } from "@/lib/types";
import { useState } from "react";
import { LocationDetail } from "./location-detail";
import { LocationForm } from "./location-form";
import { LocationList } from "./location-list";

type ViewMode = "list" | "detail" | "form";
type FormMode = "create" | "edit";

interface LocationManagerState {
  viewMode: ViewMode;
  formMode: FormMode;
  selectedLocation: Location | null;
  isLoading: boolean;
}

export function LocationManager() {
  const {
    locations,
    isLoadingLocations,
    createLocation,
    updateLocation,
    deleteLocation,
  } = useIntegratedProject();

  const [state, setState] = useState<LocationManagerState>({
    viewMode: "list",
    formMode: "create",
    selectedLocation: null,
    isLoading: false,
  });

  const handleCreateLocation = () => {
    setState({
      viewMode: "form",
      formMode: "create",
      selectedLocation: null,
      isLoading: false,
    });
  };

  const handleEditLocation = (location: Location) => {
    setState({
      viewMode: "form",
      formMode: "edit",
      selectedLocation: location,
      isLoading: false,
    });
  };

  const handleViewLocation = (location: Location) => {
    setState({
      viewMode: "detail",
      formMode: "create",
      selectedLocation: location,
      isLoading: false,
    });
  };

  const handleDeleteLocation = async (location: Location) => {
    if (!location.id) return;

    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      await deleteLocation(location.id);

      // Se estamos visualizando o local que foi excluído, voltar para a lista
      if (
        state.viewMode === "detail" &&
        state.selectedLocation?.id === location.id
      ) {
        setState({
          viewMode: "list",
          formMode: "create",
          selectedLocation: null,
          isLoading: false,
        });
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error("Erro ao excluir local:", error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleSaveLocation = async (locationData: Partial<Location>) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      let savedLocation: Location;

      if (state.formMode === "create") {
        savedLocation = await createLocation(locationData);
      } else {
        if (!state.selectedLocation?.id) {
          throw new Error("ID do local não encontrado para edição");
        }
        savedLocation = await updateLocation(
          state.selectedLocation.id,
          locationData
        );
      }

      // Após salvar, ir para a visualização do local
      setState({
        viewMode: "detail",
        formMode: "create",
        selectedLocation: savedLocation,
        isLoading: false,
      });
    } catch (error) {
      console.error("Erro ao salvar local:", error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleCancelForm = () => {
    if (state.selectedLocation) {
      // Se estava editando, voltar para a visualização
      setState({
        viewMode: "detail",
        formMode: "create",
        selectedLocation: state.selectedLocation,
        isLoading: false,
      });
    } else {
      // Se estava criando, voltar para a lista
      setState({
        viewMode: "list",
        formMode: "create",
        selectedLocation: null,
        isLoading: false,
      });
    }
  };

  const handleBackToList = () => {
    setState({
      viewMode: "list",
      formMode: "create",
      selectedLocation: null,
      isLoading: false,
    });
  };

  const handleEditFromDetail = () => {
    if (state.selectedLocation) {
      setState((prev) => ({
        ...prev,
        viewMode: "form",
        formMode: "edit",
      }));
    }
  };

  const handleDeleteFromDetail = async () => {
    if (state.selectedLocation) {
      await handleDeleteLocation(state.selectedLocation);
    }
  };

  // Renderização condicional baseada no modo de visualização
  switch (state.viewMode) {
    case "list":
      return (
        <LocationList
          locations={locations || []}
          isLoading={isLoadingLocations}
          onCreate={handleCreateLocation}
          onView={handleViewLocation}
          onEdit={handleEditLocation}
          onDelete={handleDeleteLocation}
        />
      );

    case "form":
      return (
        <LocationForm
          location={state.selectedLocation || undefined}
          mode={state.formMode}
          onSave={handleSaveLocation}
          onCancel={handleCancelForm}
          isLoading={state.isLoading}
        />
      );

    case "detail":
      if (!state.selectedLocation) {
        // Se não há local selecionado, voltar para a lista
        setState({
          viewMode: "list",
          formMode: "create",
          selectedLocation: null,
          isLoading: false,
        });
        return null;
      }

      return (
        <LocationDetail
          location={state.selectedLocation}
          onEdit={handleEditFromDetail}
          onDelete={handleDeleteFromDetail}
          onBack={handleBackToList}
          isDeleting={state.isLoading}
        />
      );

    default:
      return (
        <LocationList
          locations={locations || []}
          isLoading={isLoadingLocations}
          onCreate={handleCreateLocation}
          onView={handleViewLocation}
          onEdit={handleEditLocation}
          onDelete={handleDeleteLocation}
        />
      );
  }
}
