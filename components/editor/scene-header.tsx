"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, Clock, Save } from "lucide-react";

interface SceneHeaderProps {
  sceneTitle: string;
  autoSaveStatus: {
    statusText: string;
    statusColor: string;
  };
  onNewScene?: () => void;
  className?: string;
}

export function SceneHeader({
  sceneTitle,
  autoSaveStatus,
  onNewScene,
  className,
}: SceneHeaderProps) {
  const getStatusIcon = () => {
    if (autoSaveStatus.statusText.includes("Salvando")) {
      return <Clock className="h-3 w-3" />;
    }
    if (autoSaveStatus.statusText.includes("Salvo")) {
      return <CheckCircle className="h-3 w-3" />;
    }
    if (autoSaveStatus.statusText.includes("Erro")) {
      return <AlertCircle className="h-3 w-3" />;
    }
    return <Save className="h-3 w-3" />;
  };

  const getStatusVariant = () => {
    if (autoSaveStatus.statusText.includes("Salvando")) {
      return "secondary";
    }
    if (autoSaveStatus.statusText.includes("Salvo")) {
      return "default";
    }
    if (autoSaveStatus.statusText.includes("Erro")) {
      return "destructive";
    }
    return "outline";
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 bg-gradient-to-r from-white/95 via-white/90 to-white/95 backdrop-blur-sm border-b border-white/60 shadow-sm",
        className
      )}
    >
      {/* Scene title at start and save status at end */}
      <div className="flex items-center justify-between w-full">
        <h3 className="font-semibold text-lg text-primary">{sceneTitle}</h3>
        <Badge
          variant={getStatusVariant()}
          className={cn(
            "text-xs flex items-center gap-1.5 px-2 py-1 rounded-full transition-all duration-200 text-primary",
            autoSaveStatus.statusText.includes("Salvando") &&
              "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200",
            autoSaveStatus.statusText.includes("Salvo") &&
              "bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-200",
            autoSaveStatus.statusText.includes("Erro") &&
              "bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-200"
          )}
        >
          {getStatusIcon()}
          {autoSaveStatus.statusText}
        </Badge>
      </div>
    </div>
  );
}
