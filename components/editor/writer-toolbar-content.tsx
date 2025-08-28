"use client";

import { PageFormatSelector } from "@/components/editor/page-format-selector";
import type { PageSize } from "@/lib/extensions/page-format";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/ui/color-picker";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Check,
  ChevronsUpDown,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  ImageIcon,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

interface WriterToolbarContentProps {
  editor: Editor;
  wordCount: number;
  characterCount: number;
  readingTime: number;
  className?: string;
}

export function WriterToolbarContent({
  editor,
  wordCount,
  characterCount,
  readingTime,
  className,
}: WriterToolbarContentProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [highlightColor, setHighlightColor] = useState("#fef3c7");
  const [textColor, setTextColor] = useState("#1f2937");
  const [customFontSize, setCustomFontSize] = useState("");
  const [currentFontFamily, setCurrentFontFamily] = useState("Inter");
  const [currentFontSize, setCurrentFontSize] = useState("16px");
  const [fontSizeComboOpen, setFontSizeComboOpen] = useState(false);
  const [currentPageFormat, setCurrentPageFormat] =
    useState<PageSize>("default");

  // Handler para mudança de formato de página
  const handlePageFormatChange = useCallback(
    (pageSize: PageSize) => {
      if (editor) {
        editor.chain().focus().setPageFormat(pageSize).run();
        setCurrentPageFormat(pageSize);
      }
    },
    [editor]
  );

  // Lista expandida de fontes do Google Fonts com fallbacks
  const fontFamilies = useMemo(
    () => [
      // Sans-serif populares
      { name: "Inter", value: "Inter, sans-serif" },
      { name: "Roboto", value: "Roboto, sans-serif" },
      { name: "Open Sans", value: "'Open Sans', sans-serif" },
      { name: "Lato", value: "Lato, sans-serif" },
      { name: "Montserrat", value: "Montserrat, sans-serif" },
      { name: "Source Sans Pro", value: "'Source Sans Pro', sans-serif" },
      { name: "Raleway", value: "Raleway, sans-serif" },
      { name: "Ubuntu", value: "Ubuntu, sans-serif" },
      { name: "Nunito", value: "Nunito, sans-serif" },
      { name: "Poppins", value: "Poppins, sans-serif" },
      { name: "Oswald", value: "Oswald, sans-serif" },
      { name: "PT Sans", value: "'PT Sans', sans-serif" },
      { name: "Roboto Condensed", value: "'Roboto Condensed', sans-serif" },
      { name: "Noto Sans", value: "'Noto Sans', sans-serif" },
      { name: "Fira Sans", value: "'Fira Sans', sans-serif" },
      { name: "Work Sans", value: "'Work Sans', sans-serif" },
      { name: "Barlow", value: "Barlow, sans-serif" },
      { name: "DM Sans", value: "'DM Sans', sans-serif" },
      { name: "Manrope", value: "Manrope, sans-serif" },
      { name: "Rubik", value: "Rubik, sans-serif" },
      { name: "Karla", value: "Karla, sans-serif" },
      { name: "Mulish", value: "Mulish, sans-serif" },
      { name: "Quicksand", value: "Quicksand, sans-serif" },
      { name: "Heebo", value: "Heebo, sans-serif" },
      { name: "Oxygen", value: "Oxygen, sans-serif" },
      { name: "Cabin", value: "Cabin, sans-serif" },
      { name: "Titillium Web", value: "'Titillium Web', sans-serif" },
      { name: "Varela Round", value: "'Varela Round', sans-serif" },
      { name: "Muli", value: "Muli, sans-serif" },
      { name: "Dosis", value: "Dosis, sans-serif" },
      { name: "Exo 2", value: "'Exo 2', sans-serif" },
      { name: "Hind", value: "Hind, sans-serif" },
      { name: "Libre Franklin", value: "'Libre Franklin', sans-serif" },
      { name: "Comfortaa", value: "Comfortaa, sans-serif" },
      { name: "Assistant", value: "Assistant, sans-serif" },
      { name: "Overpass", value: "Overpass, sans-serif" },
      { name: "Arimo", value: "Arimo, sans-serif" },
      { name: "Asap", value: "Asap, sans-serif" },
      { name: "Catamaran", value: "Catamaran, sans-serif" },
      { name: "Prompt", value: "Prompt, sans-serif" },
      { name: "Kanit", value: "Kanit, sans-serif" },
      { name: "Sarabun", value: "Sarabun, sans-serif" },
      { name: "IBM Plex Sans", value: "'IBM Plex Sans', sans-serif" },
      { name: "Red Hat Display", value: "'Red Hat Display', sans-serif" },
      { name: "Lexend", value: "Lexend, sans-serif" },
      { name: "Space Grotesk", value: "'Space Grotesk', sans-serif" },
      { name: "Plus Jakarta Sans", value: "'Plus Jakarta Sans', sans-serif" },
      { name: "Outfit", value: "Outfit, sans-serif" },
      { name: "Figtree", value: "Figtree, sans-serif" },
      { name: "Sora", value: "Sora, sans-serif" },

      // Serif clássicas
      { name: "Playfair Display", value: "'Playfair Display', serif" },
      { name: "Merriweather", value: "Merriweather, serif" },
      { name: "Lora", value: "Lora, serif" },
      { name: "PT Serif", value: "'PT Serif', serif" },
      { name: "Crimson Text", value: "'Crimson Text', serif" },
      { name: "Libre Baskerville", value: "'Libre Baskerville', serif" },
      { name: "Cormorant Garamond", value: "'Cormorant Garamond', serif" },
      { name: "Crimson Pro", value: "'Crimson Pro', serif" },
      { name: "Spectral", value: "Spectral, serif" },
      { name: "Bitter", value: "Bitter, serif" },
      { name: "Vollkorn", value: "Vollkorn, serif" },
      { name: "Alegreya", value: "Alegreya, serif" },
      { name: "Cardo", value: "Cardo, serif" },
      { name: "Gentium Plus", value: "'Gentium Plus', serif" },
      { name: "Neuton", value: "Neuton, serif" },
      { name: "Old Standard TT", value: "'Old Standard TT', serif" },
      { name: "Rokkitt", value: "Rokkitt, serif" },
      { name: "Arvo", value: "Arvo, serif" },
      { name: "Domine", value: "Domine, serif" },
      { name: "Noticia Text", value: "'Noticia Text', serif" },
      { name: "Tinos", value: "Tinos, serif" },
      { name: "Gelasio", value: "Gelasio, serif" },
      { name: "Literata", value: "Literata, serif" },
      { name: "Source Serif Pro", value: "'Source Serif Pro', serif" },
      { name: "IBM Plex Serif", value: "'IBM Plex Serif', serif" },
      { name: "Zilla Slab", value: "'Zilla Slab', serif" },
      { name: "Slabo 27px", value: "'Slabo 27px', serif" },
      { name: "Crete Round", value: "'Crete Round', serif" },
      { name: "Yrsa", value: "Yrsa, serif" },
      { name: "Frank Ruhl Libre", value: "'Frank Ruhl Libre', serif" },
      { name: "Cormorant", value: "Cormorant, serif" },
      { name: "Libre Caslon Text", value: "'Libre Caslon Text', serif" },
      { name: "Proza Libre", value: "'Proza Libre', serif" },
      { name: "Faustina", value: "Faustina, serif" },
      { name: "Petrona", value: "Petrona, serif" },
      { name: "Newsreader", value: "Newsreader, serif" },

      // Monospace para código
      { name: "Source Code Pro", value: "'Source Code Pro', monospace" },
      { name: "JetBrains Mono", value: "'JetBrains Mono', monospace" },
      { name: "Fira Code", value: "'Fira Code', monospace" },
      { name: "Inconsolata", value: "Inconsolata, monospace" },
      { name: "Roboto Mono", value: "'Roboto Mono', monospace" },
      { name: "Ubuntu Mono", value: "'Ubuntu Mono', monospace" },
      { name: "Space Mono", value: "'Space Mono', monospace" },
      { name: "IBM Plex Mono", value: "'IBM Plex Mono', monospace" },
      { name: "Cousine", value: "Cousine, monospace" },
      { name: "PT Mono", value: "'PT Mono', monospace" },
      { name: "Overpass Mono", value: "'Overpass Mono', monospace" },
      { name: "Fira Mono", value: "'Fira Mono', monospace" },
      { name: "Anonymous Pro", value: "'Anonymous Pro', monospace" },
      { name: "Cutive Mono", value: "'Cutive Mono', monospace" },
      { name: "Nova Mono", value: "'Nova Mono', monospace" },
      { name: "VT323", value: "VT323, monospace" },
      { name: "Share Tech Mono", value: "'Share Tech Mono', monospace" },
      { name: "B612 Mono", value: "'B612 Mono', monospace" },
      { name: "Azeret Mono", value: "'Azeret Mono', monospace" },
      { name: "Red Hat Mono", value: "'Red Hat Mono', monospace" },
    ],
    []
  );

  // Sincroniza o estado com o editor atual
  useEffect(() => {
    if (!editor) return;

    const updateCurrentStyles = () => {
      // Atualiza a família da fonte atual
      const fontFamily = editor.getAttributes("textStyle").fontFamily;
      if (fontFamily) {
        const foundFont = fontFamilies.find((f) => f.value === fontFamily);
        if (foundFont) {
          setCurrentFontFamily(foundFont.value);
        }
      }

      // Atualiza o tamanho da fonte atual
      const fontSize = editor.getAttributes("textStyle").fontSize;
      if (fontSize) {
        setCurrentFontSize(fontSize);
      }

      // Atualiza a cor do texto atual
      const color = editor.getAttributes("textStyle").color;
      if (color) {
        setTextColor(color);
      }

      // Atualiza o formato de página atual
      const pageSize = editor.getAttributes("doc").pageSize;
      if (pageSize && pageSize !== currentPageFormat) {
        setCurrentPageFormat(pageSize as PageSize);
      }
    };

    // Atualiza quando a seleção muda
    editor.on("selectionUpdate", updateCurrentStyles);
    editor.on("transaction", updateCurrentStyles);

    return () => {
      editor.off("selectionUpdate", updateCurrentStyles);
      editor.off("transaction", updateCurrentStyles);
    };
  }, [editor, fontFamilies, currentPageFormat]);

  // Lista de tamanhos de fonte comuns
  const fontSizes = useMemo(
    () => [
      "8px",
      "9px",
      "10px",
      "11px",
      "12px",
      "14px",
      "16px",
      "18px",
      "20px",
      "24px",
      "28px",
      "32px",
      "36px",
      "48px",
      "60px",
      "72px",
    ],
    []
  );

  const addImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file && editor) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const src = e.target?.result as string;
          editor.chain().focus().setImage({ src }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl("");
    }
  }, [editor, linkUrl]);

  const unsetLink = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
  }, [editor]);

  const handleSetTextColor = useCallback(
    (color: string) => {
      if (!editor) return;
      editor.chain().focus().setColor(color).run();
    },
    [editor]
  );

  const setFontFamily = useCallback(
    (fontFamily: string) => {
      if (!editor) return;
      editor.chain().focus().setFontFamily(fontFamily).run();
    },
    [editor]
  );

  const setFontSize = useCallback(
    (fontSize: string) => {
      if (!editor) return;
      editor.chain().focus().setFontSize(fontSize).run();
    },
    [editor]
  );

  const handleCustomFontSize = useCallback(
    (value: string) => {
      const numValue = parseInt(value);
      if (!isNaN(numValue) && numValue >= 8 && numValue <= 200) {
        const fontSize = `${numValue}px`;
        setFontSize(fontSize);
        setCustomFontSize("");
      }
    },
    [setFontSize]
  );

  const setHighlight = useCallback(
    (color: string) => {
      if (!editor) return;
      editor.chain().focus().setHighlight({ color }).run();
      setHighlightColor(color);
    },
    [editor]
  );

  // Paletas de cores predefinidas para texto
  const textColorPalette = useMemo(
    () => [
      { name: "Preto", value: "#1f2937", category: "neutral" },
      { name: "Cinza Escuro", value: "#374151", category: "neutral" },
      { name: "Cinza", value: "#6b7280", category: "neutral" },
      { name: "Branco", value: "#ffffff", category: "neutral" },
      { name: "Escrivania Roxo", value: "#9192FA", category: "brand" },
      { name: "Escrivania Azul", value: "#60A5FA", category: "brand" },
      { name: "Vermelho", value: "#dc2626", category: "semantic" },
      { name: "Laranja", value: "#ea580c", category: "semantic" },
      { name: "Âmbar", value: "#d97706", category: "semantic" },
      { name: "Verde", value: "#16a34a", category: "semantic" },
      { name: "Azul", value: "#2563eb", category: "semantic" },
      { name: "Índigo", value: "#4f46e5", category: "semantic" },
      { name: "Roxo", value: "#9333ea", category: "semantic" },
      { name: "Rosa", value: "#e11d48", category: "semantic" },
    ],
    []
  );

  // Paletas de cores predefinidas para destaque
  const highlightColorPalette = useMemo(
    () => [
      { name: "Amarelo Suave", value: "#fef3c7", category: "warm" },
      { name: "Verde Suave", value: "#d1fae5", category: "warm" },
      { name: "Azul Suave", value: "#dbeafe", category: "cool" },
      { name: "Rosa Suave", value: "#fce7f3", category: "warm" },
      { name: "Roxo Suave", value: "#e9d5ff", category: "cool" },
      { name: "Laranja Suave", value: "#fed7aa", category: "warm" },
      { name: "Escrivania Roxo Suave", value: "#e0e7ff", category: "brand" },
      { name: "Escrivania Azul Suave", value: "#dbeafe", category: "brand" },
      { name: "Cinza Suave", value: "#f3f4f6", category: "neutral" },
    ],
    []
  );

  const removeHighlight = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().unsetHighlight().run();
  }, [editor]);

  // Funções removidas - FontFamily e FontSize não estão configuradas no editor

  const ToolbarButton = ({
    onClick,
    isActive,
    children,
    tooltip,
    className,
    ...props
  }: {
    onClick?: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    tooltip?: string;
    className?: string;
    [key: string]: any;
  }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={onClick}
          className={cn(
            "border-[#9192FA] text-[#9192FA] hover:bg-[#9192FA] hover:text-white",
            isActive && "bg-[#9192FA] text-white",
            className
          )}
          {...props}
        >
          {children}
        </Button>
      </TooltipTrigger>
      {tooltip && (
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      )}
    </Tooltip>
  );

  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex flex-wrap items-center gap-1 p-3 border-b border-primary/30 relative overflow-hidden",
          "bg-gradient-to-r from-white/80 via-white/60 to-white/80 backdrop-blur-md",
          "before:absolute before:bg-gradient-to-r before:from-escrivania-purple-500/5 before:via-transparent before:to-escrivania-blue-500/5",
          "shadow-xs",
          className
        )}
      >
        {/* Toolbar Background Enhancement */}
        <div className="absolute top-0 left-1/4 w-8 h-8 bg-gradient-to-br from-escrivania-purple-400/2 to-escrivania-blue-400/2 rounded-full blur-2xl" />
        <div className="absolute top-0 right-1/3 w-12 h-12 bg-gradient-to-tr from-escrivania-blue-400/8 to-escrivania-purple-400/8 rounded-full blur-lg" />

        {/* Content */}
        <div className="relative z-10 flex flex-wrap items-center gap-1 w-full">
          {/* Main Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Page Format */}
            <div className="flex items-center space-x-1 border-r border-slate-300 pr-2">
              <PageFormatSelector
                value={currentPageFormat}
                onValueChange={handlePageFormatChange}
                className="border-[#9192FA] text-[#9192FA] hover:bg-[#9192FA] hover:text-white"
              />
            </div>

            {/* Font Controls */}
            <div className="flex items-center space-x-1 border-r border-slate-300 pr-2">
              {/* Font Family Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <ToolbarButton className="px-4 py-1 text-sm min-w-[140px] justify-between">
                    {fontFamilies.find((f) => f.value === currentFontFamily)
                      ?.name || "Inter"}
                  </ToolbarButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 max-h-64 overflow-y-auto">
                  {fontFamilies.map((font) => (
                    <DropdownMenuItem
                      key={font.value}
                      onClick={() => setFontFamily(font.value)}
                      className="cursor-pointer"
                      style={{ fontFamily: font.value }}
                    >
                      {font.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Font Size Combobox */}
              <Popover
                open={fontSizeComboOpen}
                onOpenChange={setFontSizeComboOpen}
              >
                <PopoverTrigger asChild>
                  <ToolbarButton
                    role="combobox"
                    aria-expanded={fontSizeComboOpen}
                    className="px-3 py-1 text-sm min-w-[80px] justify-between"
                  >
                    {currentFontSize}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </ToolbarButton>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Digite ou selecione tamanho..."
                      className="h-9"
                    />
                    <CommandEmpty>
                      <div className="p-2">
                        <div className="text-sm text-muted-foreground mb-2">
                          Tamanho personalizado
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="8-200"
                            value={customFontSize}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (
                                value === "" ||
                                (/^\d+$/.test(value) && parseInt(value) <= 200)
                              ) {
                                setCustomFontSize(value);
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                if (
                                  customFontSize &&
                                  parseInt(customFontSize) >= 8 &&
                                  parseInt(customFontSize) <= 200
                                ) {
                                  handleCustomFontSize(customFontSize);
                                  setFontSizeComboOpen(false);
                                }
                              }
                            }}
                            className="h-8 text-xs"
                            min="8"
                            max="200"
                          />
                          <Button
                            size="sm"
                            onClick={() => {
                              if (
                                customFontSize &&
                                parseInt(customFontSize) >= 8 &&
                                parseInt(customFontSize) <= 200
                              ) {
                                handleCustomFontSize(customFontSize);
                                setFontSizeComboOpen(false);
                              }
                            }}
                            disabled={
                              !customFontSize ||
                              parseInt(customFontSize) < 8 ||
                              parseInt(customFontSize) > 200
                            }
                            className="h-8 px-2"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        </div>
                        {customFontSize &&
                          (parseInt(customFontSize) < 8 ||
                            parseInt(customFontSize) > 200) && (
                            <div className="text-xs text-red-500 mt-1">
                              Tamanho deve estar entre 8px e 200px
                            </div>
                          )}
                      </div>
                    </CommandEmpty>
                    <CommandList>
                      <CommandGroup heading="Tamanhos comuns">
                        {fontSizes.map((size) => (
                          <CommandItem
                            key={size}
                            value={size}
                            onSelect={() => {
                              setFontSize(size);
                              setFontSizeComboOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                currentFontSize === size
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {size}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Color Controls */}
            <div className="flex items-center space-x-1 border-r border-slate-300 pr-2">
              {/* Text Color */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <ToolbarButton
                    className="px-2 py-1 gap-1"
                    tooltip="Cor do texto"
                  >
                    <div className="flex items-center gap-1">
                      <div
                        className="w-4 h-4 rounded border border-gray-300 shadow-sm"
                        style={{ backgroundColor: textColor }}
                      />
                      <span className="text-xs hidden sm:inline">A</span>
                    </div>
                  </ToolbarButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 p-0">
                  <div className="p-4">
                    <DropdownMenuLabel className="text-sm font-medium text-gray-900 mb-3">
                      Cor do Texto
                    </DropdownMenuLabel>

                    {/* Paleta de cores organizadas por categoria */}
                    <div className="space-y-4">
                      {/* Cores da marca */}
                      <div>
                        <div className="text-xs font-medium text-gray-600 mb-2">
                          Cores da Marca
                        </div>
                        <div className="grid grid-cols-8 gap-1">
                          {textColorPalette
                            .filter((color) => color.category === "brand")
                            .map((color) => (
                              <Tooltip key={color.value}>
                                <TooltipTrigger asChild>
                                  <button
                                    className={cn(
                                      "w-6 h-6 rounded border-2 cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-md",
                                      textColor === color.value
                                        ? "border-escrivania-purple-500 ring-2 ring-escrivania-purple-200"
                                        : "border-gray-200 hover:border-gray-300"
                                    )}
                                    style={{ backgroundColor: color.value }}
                                    onClick={() =>
                                      handleSetTextColor(color.value)
                                    }
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{color.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            ))}
                        </div>
                      </div>

                      {/* Cores neutras */}
                      <div>
                        <div className="text-xs font-medium text-gray-600 mb-2">
                          Cores Neutras
                        </div>
                        <div className="grid grid-cols-8 gap-1">
                          {textColorPalette
                            .filter((color) => color.category === "neutral")
                            .map((color) => (
                              <Tooltip key={color.value}>
                                <TooltipTrigger asChild>
                                  <button
                                    className={cn(
                                      "w-6 h-6 rounded border-2 cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-md",
                                      textColor === color.value
                                        ? "border-escrivania-purple-500 ring-2 ring-escrivania-purple-200"
                                        : "border-gray-200 hover:border-gray-300"
                                    )}
                                    style={{ backgroundColor: color.value }}
                                    onClick={() =>
                                      handleSetTextColor(color.value)
                                    }
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{color.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            ))}
                        </div>
                      </div>

                      {/* Cores semânticas */}
                      <div>
                        <div className="text-xs font-medium text-gray-600 mb-2">
                          Cores Semânticas
                        </div>
                        <div className="grid grid-cols-8 gap-1">
                          {textColorPalette
                            .filter((color) => color.category === "semantic")
                            .map((color) => (
                              <Tooltip key={color.value}>
                                <TooltipTrigger asChild>
                                  <button
                                    className={cn(
                                      "w-6 h-6 rounded border-2 cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-md",
                                      textColor === color.value
                                        ? "border-escrivania-purple-500 ring-2 ring-escrivania-purple-200"
                                        : "border-gray-200 hover:border-gray-300"
                                    )}
                                    style={{ backgroundColor: color.value }}
                                    onClick={() =>
                                      handleSetTextColor(color.value)
                                    }
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{color.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            ))}
                        </div>
                      </div>

                      {/* Seletor de cor personalizada */}
                      <div className="pt-2 border-t border-gray-200">
                        <div className="text-xs font-medium text-gray-600 mb-2">
                          Cor Personalizada
                        </div>
                        <ColorPicker
                          value={textColor}
                          onChange={handleSetTextColor}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Highlight Color */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <ToolbarButton
                    className="px-2 py-1 gap-1"
                    tooltip="Cor de destaque"
                  >
                    <div className="flex items-center gap-1">
                      <Highlighter className="w-4 h-4" />
                      <div
                        className="w-3 h-3 rounded border border-gray-300 shadow-sm"
                        style={{ backgroundColor: highlightColor }}
                      />
                    </div>
                  </ToolbarButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 p-0">
                  <div className="p-4">
                    <DropdownMenuLabel className="text-sm font-medium text-gray-900 mb-3">
                      Cor de Destaque
                    </DropdownMenuLabel>

                    {/* Paleta de cores de destaque organizadas */}
                    <div className="space-y-4">
                      {/* Cores da marca para destaque */}
                      <div>
                        <div className="text-xs font-medium text-gray-600 mb-2">
                          Cores da Marca
                        </div>
                        <div className="grid grid-cols-8 gap-1">
                          {highlightColorPalette
                            .filter((color) => color.category === "brand")
                            .map((color) => (
                              <Tooltip key={color.value}>
                                <TooltipTrigger asChild>
                                  <button
                                    className={cn(
                                      "w-6 h-6 rounded border-2 cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-md",
                                      highlightColor === color.value
                                        ? "border-escrivania-purple-500 ring-2 ring-escrivania-purple-200"
                                        : "border-gray-200 hover:border-gray-300"
                                    )}
                                    style={{ backgroundColor: color.value }}
                                    onClick={() => setHighlight(color.value)}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{color.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            ))}
                        </div>
                      </div>

                      {/* Cores quentes */}
                      <div>
                        <div className="text-xs font-medium text-gray-600 mb-2">
                          Tons Quentes
                        </div>
                        <div className="grid grid-cols-8 gap-1">
                          {highlightColorPalette
                            .filter((color) => color.category === "warm")
                            .map((color) => (
                              <Tooltip key={color.value}>
                                <TooltipTrigger asChild>
                                  <button
                                    className={cn(
                                      "w-6 h-6 rounded border-2 cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-md",
                                      highlightColor === color.value
                                        ? "border-escrivania-purple-500 ring-2 ring-escrivania-purple-200"
                                        : "border-gray-200 hover:border-gray-300"
                                    )}
                                    style={{ backgroundColor: color.value }}
                                    onClick={() => setHighlight(color.value)}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{color.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            ))}
                        </div>
                      </div>

                      {/* Cores frias */}
                      <div>
                        <div className="text-xs font-medium text-gray-600 mb-2">
                          Tons Frios
                        </div>
                        <div className="grid grid-cols-8 gap-1">
                          {highlightColorPalette
                            .filter((color) => color.category === "cool")
                            .map((color) => (
                              <Tooltip key={color.value}>
                                <TooltipTrigger asChild>
                                  <button
                                    className={cn(
                                      "w-6 h-6 rounded border-2 cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-md",
                                      highlightColor === color.value
                                        ? "border-escrivania-purple-500 ring-2 ring-escrivania-purple-200"
                                        : "border-gray-200 hover:border-gray-300"
                                    )}
                                    style={{ backgroundColor: color.value }}
                                    onClick={() => setHighlight(color.value)}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{color.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            ))}
                        </div>
                      </div>

                      {/* Cores neutras */}
                      <div>
                        <div className="text-xs font-medium text-gray-600 mb-2">
                          Tons Neutros
                        </div>
                        <div className="grid grid-cols-8 gap-1">
                          {highlightColorPalette
                            .filter((color) => color.category === "neutral")
                            .map((color) => (
                              <Tooltip key={color.value}>
                                <TooltipTrigger asChild>
                                  <button
                                    className={cn(
                                      "w-6 h-6 rounded border-2 cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-md",
                                      highlightColor === color.value
                                        ? "border-escrivania-purple-500 ring-2 ring-escrivania-purple-200"
                                        : "border-gray-200 hover:border-gray-300"
                                    )}
                                    style={{ backgroundColor: color.value }}
                                    onClick={() => setHighlight(color.value)}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{color.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            ))}
                        </div>
                      </div>

                      {/* Seletor de cor personalizada e ações */}
                      <div className="pt-2 border-t border-gray-200 space-y-3">
                        <div>
                          <div className="text-xs font-medium text-gray-600 mb-2">
                            Cor Personalizada
                          </div>
                          <ColorPicker
                            value={highlightColor}
                            onChange={setHighlight}
                            className="w-full"
                          />
                        </div>

                        <ToolbarButton
                          onClick={removeHighlight}
                          className="w-full bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                          tooltip="Remover destaque do texto"
                        >
                          Remover Destaque
                        </ToolbarButton>
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {/* Text Formatting */}
            <div className="flex items-center space-x-1 border-r border-slate-300 pr-2">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive("bold")}
                tooltip="Negrito (Ctrl+B)"
              >
                <Bold className="w-4 h-4" />
              </ToolbarButton>

              <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive("italic")}
                tooltip="Itálico (Ctrl+I)"
              >
                <Italic className="w-4 h-4" />
              </ToolbarButton>

              <ToolbarButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive("underline")}
                tooltip="Sublinhado (Ctrl+U)"
              >
                <UnderlineIcon className="w-4 h-4" />
              </ToolbarButton>

              <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive("strike")}
                tooltip="Riscado"
              >
                <Strikethrough className="w-4 h-4" />
              </ToolbarButton>
            </div>

            {/* Headings */}
            <div className="flex items-center space-x-1 border-r border-slate-300 pr-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <ToolbarButton className="justify-between">
                    <Heading1 className="w-4 h-4" />
                  </ToolbarButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                  >
                    <Heading1 className="w-4 h-4 mr-2" />
                    Título 1
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                  >
                    <Heading2 className="w-4 h-4 mr-2" />
                    Título 2
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                  >
                    <Heading3 className="w-4 h-4 mr-2" />
                    Título 3
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Lists */}
            <div className="flex items-center space-x-1 border-r border-slate-300 pr-2">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive("bulletList")}
                tooltip="Lista com marcadores"
              >
                <List className="w-4 h-4" />
              </ToolbarButton>

              <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive("orderedList")}
                tooltip="Lista numerada"
              >
                <ListOrdered className="w-4 h-4" />
              </ToolbarButton>
            </div>

            {/* Alignment */}
            <div className="flex items-center space-x-1 border-r border-slate-300 pr-2">
              <ToolbarButton
                onClick={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
                isActive={editor.isActive({ textAlign: "left" })}
                tooltip="Alinhar à esquerda"
              >
                <AlignLeft className="w-4 h-4" />
              </ToolbarButton>

              <ToolbarButton
                onClick={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
                isActive={editor.isActive({ textAlign: "center" })}
                tooltip="Centralizar"
              >
                <AlignCenter className="w-4 h-4" />
              </ToolbarButton>

              <ToolbarButton
                onClick={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
                isActive={editor.isActive({ textAlign: "right" })}
                tooltip="Alinhar à direita"
              >
                <AlignRight className="w-4 h-4" />
              </ToolbarButton>

              <ToolbarButton
                onClick={() =>
                  editor.chain().focus().setTextAlign("justify").run()
                }
                isActive={editor.isActive({ textAlign: "justify" })}
                tooltip="Justificar"
              >
                <AlignJustify className="w-4 h-4" />
              </ToolbarButton>
            </div>

            {/* Quote */}
            <div className="flex items-center space-x-1 border-r border-slate-300 pr-2">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive("blockquote")}
                tooltip="Citação"
              >
                <Quote className="w-4 h-4" />
              </ToolbarButton>
            </div>

            {/* Media */}
            <div className="flex items-center space-x-1 border-r border-slate-300 pr-2">
              <ToolbarButton
                onClick={addImage}
                className="justify-between"
                tooltip="Inserir imagem"
              >
                <ImageIcon className="w-4 h-4" />
              </ToolbarButton>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <ToolbarButton>
                    <LinkIcon className="w-4 h-4" />
                  </ToolbarButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80">
                  <div className="p-3">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Cole o link aqui..."
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setLink();
                          }
                        }}
                      />
                      <ToolbarButton onClick={setLink} tooltip="Adicionar link">
                        Adicionar
                      </ToolbarButton>
                    </div>
                    {editor.isActive("link") && (
                      <ToolbarButton
                        onClick={unsetLink}
                        className="mt-2 w-full bg-transparent"
                        tooltip="Remover link do texto"
                      >
                        Remover link
                      </ToolbarButton>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* History */}
            <div className="flex items-center space-x-1">
              <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                tooltip="Desfazer (Ctrl+Z)"
              >
                <Undo className="w-4 h-4" />
              </ToolbarButton>

              <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                tooltip="Refazer (Ctrl+Y)"
              >
                <Redo className="w-4 h-4" />
              </ToolbarButton>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
