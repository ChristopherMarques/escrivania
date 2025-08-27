"use client";

import { PageFormatSelector } from "@/components/editor/page-format-selector";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/ui/color-picker";
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
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  ImageIcon,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Palette,
  Quote,
  Redo,
  Strikethrough,
  Type,
  Underline as UnderlineIcon,
  Undo,
} from "lucide-react";
import { useState } from "react";

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
  const [textColor, setTextColorState] = useState("#000000");
  const [highlightColor, setHighlightColor] = useState("#ffff00");
  const [currentFontFamily, setCurrentFontFamily] = useState("Inter");
  const [currentFontSize, setCurrentFontSize] = useState("16");

  const addImage = () => {
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
  };

  const setLink = () => {
    if (!editor) return;
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl("");
    }
  };

  const unsetLink = () => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
  };

  const setTextColor = (color: string) => {
    if (!editor) return;
    editor.chain().focus().setColor(color).run();
    setTextColorState(color);
  };

  const setHighlight = (color: string) => {
    if (!editor) return;
    editor.chain().focus().setHighlight({ color }).run();
    setHighlightColor(color);
  };

  const removeHighlight = () => {
    if (!editor) return;
    editor.chain().focus().unsetHighlight().run();
  };

  const setFontFamily = (fontFamily: string) => {
    if (!editor) return;
    editor.chain().focus().setFontFamily(fontFamily).run();
    setCurrentFontFamily(fontFamily);
  };

  const setFontSize = (fontSize: string) => {
    if (!editor) return;
    editor.chain().focus().setFontSize(`${fontSize}px`).run();
    setCurrentFontSize(fontSize);
  };

  const fontFamilies = [
    { name: "Inter", value: "Inter, sans-serif" },
    { name: "Times New Roman", value: "Times New Roman, serif" },
    { name: "Arial", value: "Arial, sans-serif" },
    { name: "Helvetica", value: "Helvetica, sans-serif" },
    { name: "Georgia", value: "Georgia, serif" },
    { name: "Courier New", value: "Courier New, monospace" },
    { name: "Verdana", value: "Verdana, sans-serif" },
    { name: "Trebuchet MS", value: "Trebuchet MS, sans-serif" },
    { name: "Comic Sans MS", value: "Comic Sans MS, cursive" },
    { name: "Impact", value: "Impact, sans-serif" },
  ];

  const fontSizes = [
    "8",
    "9",
    "10",
    "11",
    "12",
    "14",
    "16",
    "18",
    "20",
    "24",
    "28",
    "32",
    "36",
    "48",
    "72",
  ];
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
              <PageFormatSelector className="border-[#9192FA] text-[#9192FA] hover:bg-[#9192FA] hover:text-white" />
            </div>

            {/* Font Controls */}
            <div className="flex items-center space-x-1 border-r border-slate-300 pr-2">
              {/* Font Family */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <ToolbarButton className="min-w-[120px] justify-between">
                    <Type className="w-4 h-4 mr-2" />
                    {fontFamilies.find((f) => f.value === currentFontFamily)
                      ?.name || "Inter"}
                  </ToolbarButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuLabel>Fonte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {fontFamilies.map((font) => (
                    <DropdownMenuItem
                      key={font.value}
                      onClick={() => setFontFamily(font.value)}
                      style={{ fontFamily: font.value }}
                    >
                      {font.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Font Size */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <ToolbarButton className="min-w-[60px] justify-between">
                    {currentFontSize}px
                  </ToolbarButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-32">
                  <DropdownMenuLabel>Tamanho</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {fontSizes.map((size) => (
                    <DropdownMenuItem
                      key={size}
                      onClick={() => setFontSize(size)}
                    >
                      {size}px
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Color Controls */}
            <div className="flex items-center space-x-1 border-r border-slate-300 pr-2">
              {/* Text Color */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <ToolbarButton className="justify-between">
                    <Palette className="w-4 h-4" />
                  </ToolbarButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64">
                  <DropdownMenuLabel>Cor do Texto</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="p-3">
                    <ColorPicker
                      value={textColor}
                      onChange={setTextColor}
                      className="w-full"
                    />
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Highlight Color */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <ToolbarButton className="justify-between">
                    <Highlighter className="w-4 h-4" />
                  </ToolbarButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64">
                  <DropdownMenuLabel>Cor de Destaque</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="p-3 space-y-2">
                    <ColorPicker
                      value={highlightColor}
                      onChange={setHighlight}
                      className="w-full"
                    />
                    <ToolbarButton
                      onClick={removeHighlight}
                      className="w-full"
                      tooltip="Remover destaque do texto"
                    >
                      Remover Destaque
                    </ToolbarButton>
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
