"use client";

import { FocusModeToggle } from "@/components/focus-mode/focus-mode-manager";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import type { ViewMode } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Edit3,
  Grid3X3,
  List,
  SplitSquareHorizontal,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ViewModeToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  projectTitle?: string;
  className?: string;
  isSplitScreenActive?: boolean;
  onSplitScreenToggle?: () => void;
}

const VIEW_MODE_OPTIONS = [
  {
    mode: "writing" as ViewMode,
    label: "Escrita",
    icon: Edit3,
    description: "Modo de escrita focado",
  },
  {
    mode: "corkboard" as ViewMode,
    label: "Cortiça",
    icon: Grid3X3,
    description: "Visualização em quadro de cortiça",
  },
  {
    mode: "outliner" as ViewMode,
    label: "Estrutura",
    icon: List,
    description: "Visualização em lista estruturada",
  },
];

export function ViewModeToolbar({
  viewMode,
  onViewModeChange,
  projectTitle,
  className,
  isSplitScreenActive = false,
  onSplitScreenToggle,
}: ViewModeToolbarProps) {
  const router = useRouter();

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between px-6 py-3 bg-background border-b border-border shadow-lg",
        "relative overflow-hidden",
        className
      )}
    >
      {/* Left Section - Back Button */}
      <div className="flex items-center relative z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={handleBackToDashboard}
          className="h-8 px-3 border-primary text-primary hover:bg-primary/10 hover:border-primary/70 transition-all duration-200 shadow-sm hover:shadow-md rounded-lg"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>

      {/* Center Section - Project Title */}
      {projectTitle && (
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="flex items-center space-x-2 bg-background border border-border px-4 py-2 rounded-full shadow-sm">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <h1 className="text-base font-semibold text-primary truncate max-w-md">
              {projectTitle}
            </h1>
          </div>
        </div>
      )}

      {/* Right Section - View Mode Toggles */}
      <div className="flex items-center space-x-1 bg-background rounded-lg p-1 border border-border shadow-sm relative z-10">
        {VIEW_MODE_OPTIONS.map(({ mode, label, icon: Icon, description }) => {
          const isActive = viewMode === mode;
          return (
            <Button
              key={mode}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange(mode)}
              className={cn(
                "h-8 px-3 text-xs font-medium transition-all duration-200 rounded-md",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm hover:shadow-md"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/10 border-0"
              )}
              title={description}
            >
              <Icon className="h-3.5 w-3.5 mr-1.5" />
              {label}
            </Button>
          );
        })}
      </div>

      {/* Far Right Section - Split Screen, Theme and Focus Mode */}
      <div className="flex items-center space-x-2 relative z-10">
        {onSplitScreenToggle && (
          <Button
            variant={isSplitScreenActive ? "default" : "outline"}
            size="sm"
            onClick={onSplitScreenToggle}
            className={cn(
              "h-8 w-8 p-0 transition-all duration-200 shadow-sm hover:shadow-md rounded-lg",
              isSplitScreenActive
                ? "bg-primary text-primary-foreground"
                : "border-primary text-primary hover:bg-primary/10 hover:border-primary/70"
            )}
            title="Tela Dividida"
          >
            <SplitSquareHorizontal className="h-4 w-4" />
          </Button>
        )}
        <ThemeToggle className="h-8 w-8 border-primary text-primary hover:bg-primary/10 hover:border-primary/70 transition-all duration-200 shadow-sm hover:shadow-md rounded-lg" />
        <FocusModeToggle className="h-8 w-8 border-primary text-primary hover:bg-primary/10 hover:border-primary/70 transition-all duration-200 shadow-sm hover:shadow-md rounded-lg" />
      </div>
    </div>
  );
}
