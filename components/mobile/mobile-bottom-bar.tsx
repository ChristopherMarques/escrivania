"use client"

import { Button } from "@/components/ui/button"
import { Maximize, SplitSquareHorizontal, FileText, Grid3X3, List } from "lucide-react"

interface MobileBottomBarProps {
  viewMode: string
  onViewModeChange: (mode: string) => void
  onFocusMode: () => void
  onSplitScreen: () => void
  showWritingActions?: boolean
}

export function MobileBottomBar({
  viewMode,
  onViewModeChange,
  onFocusMode,
  onSplitScreen,
  showWritingActions = false,
}: MobileBottomBarProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-white/30 p-2">
      <div className="flex items-center justify-around">
        {/* View Mode Buttons */}
        <Button
          variant={viewMode === "writing" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("writing")}
          className="flex-1 mx-1"
        >
          <FileText className="w-4 h-4 mr-1" />
          <span className="text-xs">Escrita</span>
        </Button>

        <Button
          variant={viewMode === "corkboard" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("corkboard")}
          className="flex-1 mx-1"
        >
          <Grid3X3 className="w-4 h-4 mr-1" />
          <span className="text-xs">Cortiça</span>
        </Button>

        <Button
          variant={viewMode === "outliner" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("outliner")}
          className="flex-1 mx-1"
        >
          <List className="w-4 h-4 mr-1" />
          <span className="text-xs">Estrutura</span>
        </Button>

        {/* Writing Mode Actions */}
        {showWritingActions && (
          <>
            <Button variant="ghost" size="sm" onClick={onFocusMode} className="flex-1 mx-1">
              <Maximize className="w-4 h-4 mr-1" />
              <span className="text-xs">Foco</span>
            </Button>

            <Button variant="ghost" size="sm" onClick={onSplitScreen} className="flex-1 mx-1">
              <SplitSquareHorizontal className="w-4 h-4 mr-1" />
              <span className="text-xs">Dividir</span>
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
