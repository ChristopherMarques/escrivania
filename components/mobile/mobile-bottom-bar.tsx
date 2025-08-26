"use client";

import { Button } from "@/components/ui/button";
import {
  Maximize,
  SplitSquareHorizontal,
  FileText,
  Grid3X3,
  List,
} from "lucide-react";
import { useDeviceInfo } from "@/hooks/use-mobile";

interface MobileBottomBarProps {
  viewMode: string;
  onViewModeChange: (mode: string) => void;
  onFocusMode: () => void;
  onSplitScreen: () => void;
  showWritingActions?: boolean;
}

export function MobileBottomBar({
  viewMode,
  onViewModeChange,
  onFocusMode,
  onSplitScreen,
  showWritingActions = false,
}: MobileBottomBarProps) {
  const deviceInfo = useDeviceInfo();

  // Only show on mobile and tablet devices
  if (!deviceInfo.isMobile && !deviceInfo.isTablet) {
    return null;
  }

  const getBottomBarClasses = () => {
    const baseClasses =
      "fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-white/30";
    if (deviceInfo.isMobile) {
      return `${baseClasses} p-2 pb-safe`;
    }
    return `${baseClasses} p-3`;
  };

  const getButtonClasses = () => {
    if (deviceInfo.isMobile) {
      return "flex-1 mx-0.5 h-10 text-xs px-2";
    }
    return "flex-1 mx-1 h-11 text-sm px-3";
  };

  const getIconSize = () => {
    return deviceInfo.isMobile ? "w-4 h-4" : "w-5 h-5";
  };

  return (
    <div className={getBottomBarClasses()}>
      <div className="flex items-center justify-around gap-1">
        {/* View Mode Buttons */}
        <Button
          variant={viewMode === "writing" ? "default" : "ghost"}
          size={deviceInfo.isMobile ? "sm" : "default"}
          onClick={() => onViewModeChange("writing")}
          className={getButtonClasses()}
        >
          <FileText
            className={`${getIconSize()} ${deviceInfo.isMobile ? "mr-1" : "mr-2"}`}
          />
          <span className={deviceInfo.isMobile ? "text-xs" : "text-sm"}>
            {deviceInfo.isMobile ? "Escrita" : "Escrita"}
          </span>
        </Button>

        <Button
          variant={viewMode === "corkboard" ? "default" : "ghost"}
          size={deviceInfo.isMobile ? "sm" : "default"}
          onClick={() => onViewModeChange("corkboard")}
          className={getButtonClasses()}
        >
          <Grid3X3
            className={`${getIconSize()} ${deviceInfo.isMobile ? "mr-1" : "mr-2"}`}
          />
          <span className={deviceInfo.isMobile ? "text-xs" : "text-sm"}>
            {deviceInfo.isMobile ? "Cortiça" : "Cortiça"}
          </span>
        </Button>

        <Button
          variant={viewMode === "outliner" ? "default" : "ghost"}
          size={deviceInfo.isMobile ? "sm" : "default"}
          onClick={() => onViewModeChange("outliner")}
          className={getButtonClasses()}
        >
          <List
            className={`${getIconSize()} ${deviceInfo.isMobile ? "mr-1" : "mr-2"}`}
          />
          <span className={deviceInfo.isMobile ? "text-xs" : "text-sm"}>
            {deviceInfo.isMobile ? "Estrutura" : "Estrutura"}
          </span>
        </Button>

        {/* Writing Mode Actions */}
        {showWritingActions && (
          <>
            <Button
              variant="ghost"
              size={deviceInfo.isMobile ? "sm" : "default"}
              onClick={onFocusMode}
              className={getButtonClasses()}
            >
              <Maximize
                className={`${getIconSize()} ${deviceInfo.isMobile ? "mr-1" : "mr-2"}`}
              />
              <span className={deviceInfo.isMobile ? "text-xs" : "text-sm"}>
                {deviceInfo.isMobile ? "Foco" : "Foco"}
              </span>
            </Button>

            <Button
              variant="ghost"
              size={deviceInfo.isMobile ? "sm" : "default"}
              onClick={onSplitScreen}
              className={getButtonClasses()}
            >
              <SplitSquareHorizontal
                className={`${getIconSize()} ${deviceInfo.isMobile ? "mr-1" : "mr-2"}`}
              />
              <span className={deviceInfo.isMobile ? "text-xs" : "text-sm"}>
                {deviceInfo.isMobile ? "Dividir" : "Dividir"}
              </span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
