"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PageSize } from "@/lib/extensions/page-format";
import { cn } from "@/lib/utils";
import { Book, BookOpen, Bookmark, FileText, Monitor } from "lucide-react";
import * as React from "react";

interface PageFormatOption {
  value: PageSize;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  dimensions?: string;
}

const pageFormatOptions: PageFormatOption[] = [
  {
    value: "default",
    label: "Padrão",
    description: "Formato livre para escrita digital",
    icon: Monitor,
  },
  {
    value: "a4",
    label: "A4",
    description: "Formato padrão internacional",
    icon: FileText,
    dimensions: "21 × 29.7 cm",
  },
  {
    value: "a5",
    label: "A5",
    description: "Formato compacto",
    icon: Bookmark,
    dimensions: "14.8 × 21 cm",
  },
  {
    value: "16x23",
    label: "16×23",
    description: "Formato brasileiro comum",
    icon: Book,
    dimensions: "16 × 23 cm",
  },
  {
    value: "14x21",
    label: "14×21",
    description: "Formato pocket brasileiro",
    icon: BookOpen,
    dimensions: "14 × 21 cm",
  },
];

interface PageFormatSelectorProps {
  value?: PageSize;
  onValueChange?: (value: PageSize) => void;
  className?: string;
  size?: "sm" | "default";
}

export function PageFormatSelector({
  value = "default",
  onValueChange,
  className,
  size = "default",
}: PageFormatSelectorProps) {
  const [currentValue, setCurrentValue] = React.useState<PageSize>(value);

  // Sync with external value changes
  React.useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const selectedOption = pageFormatOptions.find(
    (option) => option.value === currentValue
  );
  const SelectedIcon = selectedOption?.icon || Monitor;

  const handleValueChange = (newValue: PageSize) => {
    setCurrentValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <Select value={currentValue} onValueChange={handleValueChange}>
      <SelectTrigger
        className={cn("w-fit min-w-[140px] gap-2", className)}
        size={size}
      >
        <div className="flex items-center gap-2">
          <SelectedIcon className="h-4 w-4 text-[#9192FA]" />
          <SelectValue placeholder="Formato da página">
            <span className="font-medium">{selectedOption?.label}</span>
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent className="w-[280px]">
        {pageFormatOptions.map((option) => {
          const Icon = option.icon;
          return (
            <SelectItem
              key={option.value}
              value={option.value}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-3 w-full">
                <Icon className="h-4 w-4 shrink-0 " />
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{option.label}</span>
                    {option.dimensions && (
                      <span className="text-xs text-muted-foreground">
                        {option.dimensions}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground line-clamp-1">
                    {option.description}
                  </span>
                </div>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

export default PageFormatSelector;
