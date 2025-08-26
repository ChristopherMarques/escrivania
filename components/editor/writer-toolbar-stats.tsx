"use client";

import { Clock, FileText, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

interface WriterToolbarStatsProps {
  wordCount: number;
  characterCount: number;
  readingTime: number;
  className?: string;
}

export function WriterToolbarStats({
  wordCount,
  characterCount,
  readingTime,
  className,
}: WriterToolbarStatsProps) {
  const stats = [
    {
      icon: FileText,
      value: `${wordCount}p`,
      tooltip: `${wordCount} palavras escritas`,
    },
    {
      icon: Hash,
      value: `${characterCount}c`,
      tooltip: `${characterCount} caracteres (incluindo espaços)`,
    },
    {
      icon: Clock,
      value: `${readingTime}min`,
      tooltip: `Aproximadamente ${readingTime} minutos de leitura`,
    },
  ];

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 border-l border-gray-200 ml-2",
        "dark:border-gray-700",
        className
      )}
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={cn(
              "flex items-center gap-1.5 text-xs text-gray-600",
              "dark:text-gray-400 whitespace-nowrap"
            )}
            title={stat.tooltip}
          >
            <Icon className="w-3.5 h-3.5 opacity-70" />
            <span className="font-medium">{stat.value}</span>
          </div>
        );
      })}
    </div>
  );
}
