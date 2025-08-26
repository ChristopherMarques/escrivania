"use client";

import React from "react";
import { ChevronDown, ChevronRight, Plus, FileText, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Chapter, Scene } from "@/lib/types";

interface ProjectTreeViewProps {
  chapters: Chapter[];
  selectedItemId?: string;
  onSelectItem: (type: "chapter" | "scene", id: string) => void;
  onAddChapter: () => void;
  onAddScene: (chapterId: string) => void;
  className?: string;
}

export function ProjectTreeView({
  chapters,
  selectedItemId,
  onSelectItem,
  onAddChapter,
  onAddScene,
  className,
}: ProjectTreeViewProps) {
  const [expandedChapters, setExpandedChapters] = React.useState<Set<string>>(
    new Set()
  );

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-gray-50 dark:bg-gray-900",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Estrutura
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddChapter}
          className="h-8 w-8 p-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto p-2">
        {chapters.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500 dark:text-gray-400">
            <Book className="h-8 w-8 mb-2" />
            <p className="text-sm text-center">
              Nenhum capítulo ainda.\nClique no + para começar.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {chapters.map((chapter) => {
              const isExpanded = expandedChapters.has(chapter.id);
              const isSelected = selectedItemId === chapter.id;

              return (
                <div key={chapter.id} className="space-y-1">
                  {/* Chapter Item */}
                  <div
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors",
                      "hover:bg-gray-100 dark:hover:bg-gray-800",
                      isSelected &&
                        "bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100"
                    )}
                    onClick={() => onSelectItem("chapter", chapter.id)}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleChapter(chapter.id);
                      }}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </Button>
                    <Book className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="flex-1 text-sm font-medium truncate">
                      {chapter.title || `Capítulo ${chapter.order}`}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddScene(chapter.id);
                      }}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Scenes */}
                  {isExpanded && (
                    <div className="ml-6 space-y-1">
                      {chapter.scenes.map((scene) => {
                        const isSceneSelected = selectedItemId === scene.id;

                        return (
                          <div
                            key={scene.id}
                            className={cn(
                              "flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors",
                              "hover:bg-gray-100 dark:hover:bg-gray-800",
                              isSceneSelected &&
                                "bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100"
                            )}
                            onClick={() => onSelectItem("scene", scene.id)}
                          >
                            <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            <span className="flex-1 text-sm truncate">
                              {scene.title || `Cena ${scene.order}`}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {scene.wordCount || 0}
                            </span>
                          </div>
                        );
                      })}
                      {chapter.scenes.length === 0 && (
                        <div className="flex items-center gap-2 p-2 text-gray-500 dark:text-gray-400">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm italic">Nenhuma cena</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
