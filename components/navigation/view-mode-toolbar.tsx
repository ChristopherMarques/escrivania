"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { ViewMode } from "@/lib/types";
import {
  ArrowLeft,
  Edit3,
  Grid3X3,
  List,
  Eye,
  EyeOff,
  Home,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { FocusModeToggle } from "@/components/focus-mode/focus-mode-manager";

interface ViewModeToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  projectTitle?: string;
  className?: string;
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
}: ViewModeToolbarProps) {
  const router = useRouter();

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 shadow-sm",
        className
      )}
    >
      {/* Left Section - Back Button and Project Title */}
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackToDashboard}
          className="h-8 px-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Dashboard
        </Button>

        {projectTitle && (
          <>
            <Separator orientation="vertical" className="h-4" />
            <h1 className="text-sm font-medium text-gray-900 truncate max-w-xs">
              {projectTitle}
            </h1>
          </>
        )}
      </div>

      {/* Center Section - View Mode Toggles */}
      <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
        {VIEW_MODE_OPTIONS.map(({ mode, label, icon: Icon, description }) => {
          const isActive = viewMode === mode;
          return (
            <Button
              key={mode}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange(mode)}
              className={cn(
                "h-8 px-3 text-xs font-medium transition-all",
                isActive
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              )}
              title={description}
            >
              <Icon className="h-3.5 w-3.5 mr-1.5" />
              {label}
            </Button>
          );
        })}
      </div>

      {/* Right Section - Focus Mode and Actions */}
      <div className="flex items-center space-x-2">
        <FocusModeToggle className="h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard")}
          className="h-8 px-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          title="Ir para o Dashboard"
        >
          <Home className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
