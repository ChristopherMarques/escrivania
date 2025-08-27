"use client";

import { cn } from "@/lib/utils";
import { Clock, FileText, Hash, Target, Timer, TrendingUp } from "lucide-react";

interface WriterStatsPanelProps {
  wordCount: number;
  characterCount: number;
  readingTime: number;
  writingGoal: number;
  sessionWordCount: number;
  sessionDuration: number;
  wordsPerMinute: number;
  goalProgress: number;
  className?: string;
}

export function WriterStatsPanel({
  wordCount,
  characterCount,
  readingTime,
  writingGoal,
  sessionWordCount,
  sessionDuration,
  wordsPerMinute,
  goalProgress,
  className,
}: WriterStatsPanelProps) {
  const stats = [
    {
      icon: FileText,
      value: wordCount,
      label: "Palavras",
      color: "text-escrivania-blue-600",
      bgColor: "bg-escrivania-blue-50",
    },
    {
      icon: Target,
      value: `${goalProgress}%`,
      label: `Meta (${writingGoal})`,
      color: "text-escrivania-blue-700",
      bgColor: "bg-escrivania-blue-100",
      showProgress: true,
      progress: Math.min(goalProgress, 100),
    },
    {
      icon: Clock,
      value: readingTime,
      label: "Min. leitura",
      color: "text-escrivania-purple-600",
      bgColor: "bg-escrivania-purple-50",
    },
    {
      icon: TrendingUp,
      value: wordsPerMinute,
      label: "Palavras/min",
      color: "text-escrivania-purple-700",
      bgColor: "bg-escrivania-purple-100",
    },
    {
      icon: Timer,
      value: sessionDuration,
      label: "Min. sessão",
      color: "text-escrivania-blue-800",
      bgColor: "bg-escrivania-blue-200",
    },
    {
      icon: Hash,
      value: characterCount,
      label: "Caracteres",
      color: "text-muted-foreground",
      bgColor: "bg-muted/50",
    },
  ];

  return (
    <div
      className={cn(
        "relative overflow-hidden p-4 border-t border-primary/30",
        "bg-background",
        "shadow-lg ",
        className
      )}
    >
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={cn(
                "flex items-center gap-2 p-3 rounded-xl border border-border transition-all duration-200",
                "hover:border-primary/30 hover:shadow-lg hover:scale-105",
                "bg-background hover:bg-primary/5",
                "cursor-default group"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-7 h-7 rounded-md flex-shrink-0",
                  stat.bgColor,
                  "dark:bg-opacity-20"
                )}
              >
                <Icon className={cn("w-3.5 h-3.5", stat.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-foreground truncate">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {stat.label}
                </div>
                {stat.showProgress && (
                  <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                    <div
                      className="bg-primary h-1.5 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${Math.min(stat.progress, 100)}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
