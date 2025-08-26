"use client";

import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
  disabled?: boolean;
}

export function ColorPicker({
  value,
  onChange,
  className,
  disabled = false,
}: ColorPickerProps) {
  const [color, setColor] = useState(value);
  const [isOpen, setIsOpen] = useState(false);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    onChange(newColor);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    if (/^#[0-9A-F]{6}$/i.test(newColor) || newColor === "") {
      setColor(newColor);
      if (newColor !== "") {
        onChange(newColor);
      }
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[200px] justify-start text-left font-normal",
            !color && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <div
            className="w-4 h-4 rounded border border-gray-300 mr-2"
            style={{ backgroundColor: color || "#ffffff" }}
          />
          {color || "Selecionar cor"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="space-y-3">
          <HexColorPicker
            color={color || "#ffffff"}
            onChange={handleColorChange}
            className="w-full"
          />
          <Input
            value={color || ""}
            onChange={handleInputChange}
            placeholder="#000000"
            className="font-mono text-sm"
          />
          <div className="flex gap-2 flex-wrap">
            {[
              "#000000",
              "#ffffff",
              "#ef4444",
              "#f97316",
              "#eab308",
              "#22c55e",
              "#3b82f6",
              "#8b5cf6",
              "#ec4899",
            ].map((presetColor) => (
              <button
                key={presetColor}
                className="w-6 h-6 rounded border border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: presetColor }}
                onClick={() => handleColorChange(presetColor)}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}