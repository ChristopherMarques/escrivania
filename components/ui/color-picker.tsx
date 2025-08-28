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

  // Paleta de cores premium alinhada com a marca
  const presetColors = [
    // Cores da marca Escrivania
    "#9192FA", // Escrivania Purple
    "#60A5FA", // Escrivania Blue
    "#e0e7ff", // Escrivania Purple Light
    "#dbeafe", // Escrivania Blue Light

    // Cores neutras sofisticadas
    "#1f2937", // Gray 800
    "#374151", // Gray 700
    "#6b7280", // Gray 500
    "#9ca3af", // Gray 400
    "#d1d5db", // Gray 300
    "#f3f4f6", // Gray 100
    "#ffffff", // White
    "#000000", // Black

    // Cores semânticas modernas
    "#dc2626", // Red 600
    "#ea580c", // Orange 600
    "#d97706", // Amber 600
    "#16a34a", // Green 600
    "#2563eb", // Blue 600
    "#4f46e5", // Indigo 600
    "#9333ea", // Purple 600
    "#e11d48", // Rose 600

    // Tons pastéis para destaque
    "#fef3c7", // Amber 100
    "#d1fae5", // Green 100
    "#fce7f3", // Pink 100
    "#e9d5ff", // Purple 100
  ];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[200px] justify-start text-left font-normal border-escrivania-purple-200 hover:border-escrivania-purple-300 transition-colors",
            !color && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <div
            className="w-4 h-4 rounded border-2 border-gray-200 mr-2 shadow-sm"
            style={{ backgroundColor: color || "#ffffff" }}
          />
          <span className="truncate">
            {color ? (
              <span className="font-mono text-xs">{color.toUpperCase()}</span>
            ) : (
              "Selecionar cor"
            )}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="text-sm font-medium text-gray-900">
            Seletor de Cor
          </div>

          {/* Color Picker */}
          <div className="space-y-3">
            <HexColorPicker
              color={color || "#ffffff"}
              onChange={handleColorChange}
              className="w-full !h-32"
            />

            {/* Input para código hex */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Código Hexadecimal
              </label>
              <Input
                value={color || ""}
                onChange={handleInputChange}
                placeholder="#000000"
                className="font-mono text-sm border-gray-200 focus:border-escrivania-purple-300 focus:ring-escrivania-purple-200"
              />
            </div>
          </div>

          {/* Paleta de cores predefinidas */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600">
              Cores Predefinidas
            </label>
            <div className="grid grid-cols-8 gap-1.5">
              {presetColors.map((presetColor) => (
                <button
                  key={presetColor}
                  className={cn(
                    "w-7 h-7 rounded border-2 cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-md",
                    color === presetColor
                      ? "border-escrivania-purple-500 ring-2 ring-escrivania-purple-200"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                  style={{ backgroundColor: presetColor }}
                  onClick={() => handleColorChange(presetColor)}
                  title={presetColor.toUpperCase()}
                />
              ))}
            </div>
          </div>

          {/* Preview da cor atual */}
          {color && (
            <div className="pt-2 border-t border-gray-200">
              <div className="text-xs font-medium text-gray-600 mb-2">
                Cor Atual
              </div>
              <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-md">
                <div
                  className="w-8 h-8 rounded border-2 border-gray-200 shadow-sm"
                  style={{ backgroundColor: color }}
                />
                <div className="flex-1">
                  <div className="font-mono text-sm font-medium">
                    {color.toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-500">
                    Clique para copiar
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
