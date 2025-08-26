"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import React from "react";

interface FocusModeManagerProps {
  children: React.ReactNode;
  className?: string;
}

interface FocusModeContextType {
  isFocusMode: boolean;
  toggleFocusMode: () => void;
  exitFocusMode: () => void;
}

const FocusModeContext = React.createContext<FocusModeContextType | undefined>(
  undefined
);

export function useFocusMode() {
  const context = React.useContext(FocusModeContext);
  if (!context) {
    throw new Error("useFocusMode must be used within a FocusModeManager");
  }
  return context;
}

export function FocusModeManager({
  children,
  className,
}: FocusModeManagerProps) {
  const [isFocusMode, setIsFocusMode] = React.useState(false);

  const toggleFocusMode = React.useCallback(() => {
    setIsFocusMode((prev) => !prev);
  }, []);

  const exitFocusMode = React.useCallback(() => {
    setIsFocusMode(false);
  }, []);

  // Handle escape key to exit focus mode
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFocusMode) {
        exitFocusMode();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFocusMode, exitFocusMode]);

  const contextValue = React.useMemo(
    () => ({
      isFocusMode,
      toggleFocusMode,
      exitFocusMode,
    }),
    [isFocusMode, toggleFocusMode, exitFocusMode]
  );

  return (
    <FocusModeContext.Provider value={contextValue}>
      <div
        className={cn(
          "relative transition-all duration-300 ease-in-out",
          isFocusMode && "focus-mode-active",
          className
        )}
      >
        {children}
      </div>
    </FocusModeContext.Provider>
  );
}

// Focus Mode Toggle Button Component
export function FocusModeToggle({ className }: { className?: string }) {
  const { isFocusMode, toggleFocusMode } = useFocusMode();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleFocusMode}
      className={cn("h-8 w-8 p-0", className)}
      title={isFocusMode ? "Sair do modo foco" : "Entrar no modo foco"}
    >
      {isFocusMode ? (
        <EyeOff className="h-4 w-4" />
      ) : (
        <Eye className="h-4 w-4" />
      )}
    </Button>
  );
}

// Hook to conditionally hide elements in focus mode
export function useFocusModeHidden() {
  const { isFocusMode } = useFocusMode();
  return isFocusMode;
}
