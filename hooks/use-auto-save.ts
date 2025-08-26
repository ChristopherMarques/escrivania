"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast, useSonner } from "sonner";

interface AutoSaveOptions {
  /** Interval in milliseconds between auto-saves (default: 30000 = 30 seconds) */
  interval?: number;
  /** Delay in milliseconds after last change before saving (default: 2000 = 2 seconds) */
  debounceDelay?: number;
  /** Whether to show toast notifications for saves */
  showNotifications?: boolean;
  /** Whether auto-save is enabled */
  enabled?: boolean;
}

interface AutoSaveState {
  /** Whether there are unsaved changes */
  hasUnsavedChanges: boolean;
  /** Whether a save operation is currently in progress */
  isSaving: boolean;
  /** Timestamp of the last successful save */
  lastSaved: Date | null;
  /** Error from the last save attempt, if any */
  lastError: Error | null;
}

interface UseAutoSaveReturn extends AutoSaveState {
  /** Mark content as changed (triggers auto-save) */
  markAsChanged: () => void;
  /** Manually trigger a save */
  saveNow: () => Promise<void>;
  /** Mark content as saved */
  markAsSaved: () => void;
  /** Reset the auto-save state */
  reset: () => void;
}

/**
 * Hook for automatic saving functionality
 * @param saveFunction Function to call when saving
 * @param options Auto-save configuration options
 */
export function useAutoSave(
  saveFunction: () => Promise<void>,
  options: AutoSaveOptions = {}
): UseAutoSaveReturn {
  const {
    interval = 30000, // 30 seconds
    debounceDelay = 2000, // 2 seconds
    showNotifications = true,
    enabled = true,
  } = options;

  const { toasts } = useSonner();

  const [state, setState] = useState<AutoSaveState>({
    hasUnsavedChanges: false,
    isSaving: false,
    lastSaved: null,
    lastError: null,
  });

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastChangeTimeRef = useRef<number>(0);

  // Save function with error handling
  const performSave = useCallback(async () => {
    setState((currentState) => {
      if (
        !enabled ||
        currentState.isSaving ||
        !currentState.hasUnsavedChanges
      ) {
        return currentState;
      }
      return { ...currentState, isSaving: true, lastError: null };
    });

    try {
      await saveFunction();
      setState((prev) => ({
        ...prev,
        hasUnsavedChanges: false,
        isSaving: false,
        lastSaved: new Date(),
        lastError: null,
      }));

      if (showNotifications) {
        toast("Suas alterações foram salvas.");
      }
    } catch (error) {
      const errorObj =
        error instanceof Error ? error : new Error("Erro desconhecido");
      setState((prev) => ({
        ...prev,
        isSaving: false,
        lastError: errorObj,
      }));

      if (showNotifications) {
        toast("Erro ao salvar: " + errorObj.message);
      }
    }
  }, [enabled, saveFunction, showNotifications, toast]);

  // Mark content as changed
  const markAsChanged = useCallback(() => {
    if (!enabled) return;

    lastChangeTimeRef.current = Date.now();
    setState((prev) => ({ ...prev, hasUnsavedChanges: true }));

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new debounced save timeout
    saveTimeoutRef.current = setTimeout(() => {
      performSave();
    }, debounceDelay);
  }, [enabled, debounceDelay, performSave]);

  // Manual save
  const saveNow = useCallback(async () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
    await performSave();
  }, [performSave]);

  // Mark as saved (external save)
  const markAsSaved = useCallback(() => {
    setState((prev) => ({
      ...prev,
      hasUnsavedChanges: false,
      lastSaved: new Date(),
      lastError: null,
    }));
  }, []);

  // Reset state
  const reset = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setState({
      hasUnsavedChanges: false,
      isSaving: false,
      lastSaved: null,
      lastError: null,
    });
  }, []);

  // Set up periodic auto-save interval
  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      // Only save if there are changes and enough time has passed since last change
      setState((currentState) => {
        if (
          currentState.hasUnsavedChanges &&
          Date.now() - lastChangeTimeRef.current >= debounceDelay
        ) {
          performSave();
        }
        return currentState;
      });
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, interval, debounceDelay, performSave]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (state.hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue =
          "Você tem alterações não salvas. Deseja realmente sair?";
        return event.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [state.hasUnsavedChanges]);

  return {
    ...state,
    markAsChanged,
    saveNow,
    markAsSaved,
    reset,
  };
}

/**
 * Hook for displaying auto-save status
 */
export function useAutoSaveStatus(autoSaveState: AutoSaveState) {
  const getStatusText = useCallback(() => {
    if (autoSaveState.isSaving) {
      return "Salvando...";
    }
    if (autoSaveState.hasUnsavedChanges) {
      return "Alterações não salvas";
    }
    if (autoSaveState.lastSaved) {
      const now = new Date();
      const diff = now.getTime() - autoSaveState.lastSaved.getTime();
      const minutes = Math.floor(diff / 60000);

      if (minutes < 1) {
        return "Salvo agora";
      } else if (minutes === 1) {
        return "Salvo há 1 minuto";
      } else {
        return `Salvo há ${minutes} minutos`;
      }
    }
    return "Não salvo";
  }, [autoSaveState]);

  const getStatusColor = useCallback(() => {
    if (autoSaveState.isSaving) {
      return "text-blue-600 dark:text-blue-400";
    }
    if (autoSaveState.hasUnsavedChanges) {
      return "text-orange-600 dark:text-orange-400";
    }
    if (autoSaveState.lastError) {
      return "text-red-600 dark:text-red-400";
    }
    return "text-green-600 dark:text-green-400";
  }, [autoSaveState]);

  return {
    statusText: getStatusText(),
    statusColor: getStatusColor(),
  };
}
