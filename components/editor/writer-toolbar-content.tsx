"use client";

import { ColorPicker } from "@/components/ui/color-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PageSize } from "@/lib/extensions/page-format";
import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  AlignVerticalSpaceAround,
  AtSign,
  Bold,
  CheckSquare,
  CornerDownLeft,
  Hash,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  ImagePlus,
  Italic,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo,
  Strikethrough,
  Subscript,
  Superscript,
  Type,
  Underline,
  Undo,
} from "lucide-react";
import { PageFormatSelector } from "./page-format-selector";
import { WriterToolbarStats } from "./writer-toolbar-stats";

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
  const formatButtons = [
    {
      icon: Bold,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
      tooltip: "Negrito (Ctrl+B)",
    },
    {
      icon: Italic,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
      tooltip: "Itálico (Ctrl+I)",
    },
    {
      icon: Underline,
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive("underline"),
      tooltip: "Sublinhado (Ctrl+U)",
    },
    {
      icon: Strikethrough,
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive("strike"),
      tooltip: "Riscado",
    },
  ];

  const headingButtons = [
    {
      icon: Heading1,
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive("heading", { level: 1 }),
      tooltip: "Título 1",
    },
    {
      icon: Heading2,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive("heading", { level: 2 }),
      tooltip: "Título 2",
    },
    {
      icon: Heading3,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive("heading", { level: 3 }),
      tooltip: "Título 3",
    },
  ];

  const listButtons = [
    {
      icon: List,
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
      tooltip: "Lista com marcadores",
    },
    {
      icon: ListOrdered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
      tooltip: "Lista numerada",
    },
  ];

  const alignmentButtons = [
    {
      icon: AlignLeft,
      action: () => editor.chain().focus().setTextAlign("left").run(),
      isActive: editor.isActive({ textAlign: "left" }),
      tooltip: "Alinhar à esquerda",
    },
    {
      icon: AlignCenter,
      action: () => editor.chain().focus().setTextAlign("center").run(),
      isActive: editor.isActive({ textAlign: "center" }),
      tooltip: "Centralizar",
    },
    {
      icon: AlignRight,
      action: () => editor.chain().focus().setTextAlign("right").run(),
      isActive: editor.isActive({ textAlign: "right" }),
      tooltip: "Alinhar à direita",
    },
    {
      icon: AlignJustify,
      action: () => editor.chain().focus().setTextAlign("justify").run(),
      isActive: editor.isActive({ textAlign: "justify" }),
      tooltip: "Justificar",
    },
  ];

  const actionButtons = [
    {
      icon: Quote,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive("blockquote"),
      tooltip: "Citação",
    },

    {
      icon: Minus,
      action: () => editor.chain().focus().setHorizontalRule().run(),
      isActive: false,
      tooltip: "Linha horizontal",
    },
  ];

  const mediaButtons = [
    {
      icon: ImagePlus,
      action: () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            // Trigger the ImageUploadNode functionality
            const reader = new FileReader();
            reader.onload = () => {
              const dataUrl = reader.result as string;
              editor.chain().focus().setImage({ src: dataUrl }).run();
            };
            reader.readAsDataURL(file);
          }
        };
        input.click();
      },
      isActive: false,
      tooltip: "Inserir imagem",
    },
  ];

  const textStyleButtons = [
    {
      icon: Superscript,
      action: () => editor.chain().focus().toggleSuperscript().run(),
      isActive: editor.isActive("superscript"),
      tooltip: "Sobrescrito",
    },
    {
      icon: Subscript,
      action: () => editor.chain().focus().toggleSubscript().run(),
      isActive: editor.isActive("subscript"),
      tooltip: "Subscrito",
    },
    {
      icon: Highlighter,
      action: () => editor.chain().focus().toggleHighlight().run(),
      isActive: editor.isActive("highlight"),
      tooltip: "Destacar texto",
    },
  ];

  const mentionButtons = [
    {
      icon: AtSign,
      action: () => {
        const selection = editor.state.selection;
        const text = "@";
        editor.chain().focus().insertContent(text).run();
      },
      isActive: false,
      tooltip: "Mencionar personagem (@)",
    },
    {
      icon: Hash,
      action: () => {
        const selection = editor.state.selection;
        const text = "#";
        editor.chain().focus().insertContent(text).run();
      },
      isActive: false,
      tooltip: "Mencionar localização (#)",
    },
  ];

  const utilityButtons = [
    {
      icon: CornerDownLeft,
      action: () => editor.chain().focus().setHardBreak().run(),
      isActive: false,
      tooltip: "Quebra de linha forçada",
    },
    {
      icon: Type,
      action: () => {
        // Typography extension doesn't have a toggle command, but we can show its status
        // The Typography extension works automatically, so this button shows if it's enabled
        console.log(
          "Typography extension is active:",
          editor.extensionManager.extensions.find(
            (ext) => ext.name === "typography"
          )
        );
      },
      isActive: !!editor.extensionManager.extensions.find(
        (ext) => ext.name === "typography"
      ),
      tooltip: "Tipografia automática (ativa)",
    },
  ];

  const taskButtons = [
    {
      icon: CheckSquare,
      action: () => editor.chain().focus().toggleTaskList().run(),
      isActive: editor.isActive("taskList"),
      tooltip: "Lista de tarefas",
    },
  ];

  // Font families available
  const fontFamilies = [
    { value: "Inter", label: "Inter" },
    { value: "Arial", label: "Arial" },
    { value: "Helvetica", label: "Helvetica" },
    { value: "Times New Roman", label: "Times New Roman" },
    { value: "Georgia", label: "Georgia" },
    { value: "Courier New", label: "Courier New" },
    { value: "Verdana", label: "Verdana" },
  ];

  // Font sizes available
  const fontSizes = [
    { value: "12px", label: "12px" },
    { value: "14px", label: "14px" },
    { value: "16px", label: "16px" },
    { value: "18px", label: "18px" },
    { value: "20px", label: "20px" },
    { value: "24px", label: "24px" },
    { value: "32px", label: "32px" },
    { value: "48px", label: "48px" },
  ];

  // Line heights available
  const lineHeights = [
    { value: "1", label: "1.0" },
    { value: "1.15", label: "1.15" },
    { value: "1.5", label: "1.5" },
    { value: "1.75", label: "1.75" },
    { value: "2", label: "2.0" },
    { value: "2.5", label: "2.5" },
  ];

  const historyButtons = [
    {
      icon: Undo,
      action: () => editor.chain().focus().undo().run(),
      isActive: false,
      tooltip: "Desfazer (Ctrl+Z)",
      disabled: !editor.can().undo(),
    },
    {
      icon: Redo,
      action: () => editor.chain().focus().redo().run(),
      isActive: false,
      tooltip: "Refazer (Ctrl+Y)",
      disabled: !editor.can().redo(),
    },
  ];

  const renderButtonGroup = (buttons: any[], groupKey: string) => (
    <div key={groupKey} className="flex items-center gap-1">
      {buttons.map((button, index) => {
        const Icon = button.icon;
        return (
          <button
            key={index}
            onClick={button.action}
            disabled={button.disabled}
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200",
              "hover:bg-gray-100 dark:hover:bg-gray-700",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              button.isActive
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                : "text-gray-600 dark:text-gray-400"
            )}
            title={button.tooltip}
          >
            <Icon className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-start sm:items-center justify-between",
        "p-3 border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700",
        "gap-3 sm:gap-4",
        className
      )}
    >
      {/* Toolbar Buttons - Now with flex-wrap for natural line breaking */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 w-full sm:w-auto">
        <div className="flex items-center gap-2 flex-wrap">
          {renderButtonGroup(formatButtons, "format")}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 flex-shrink-0" />

          {/* Font Family Selector */}
          <Select
            value={editor.getAttributes("textStyle").fontFamily || "Inter"}
            onValueChange={(value) => {
              if (value === "Inter") {
                editor.chain().focus().unsetFontFamily().run();
              } else {
                editor.chain().focus().setFontFamily(value).run();
              }
            }}
          >
            <SelectTrigger className="w-32 h-8 text-xs">
              <Type className="w-3 h-3 mr-1" />
              <SelectValue placeholder="Fonte" />
            </SelectTrigger>
            <SelectContent>
              {fontFamilies.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Font Size Selector */}
          <Select
            value={editor.getAttributes("textStyle").fontSize || "16px"}
            onValueChange={(value) => {
              editor.chain().focus().setFontSize(value).run();
            }}
          >
            <SelectTrigger className="w-20 h-8 text-xs">
              <SelectValue placeholder="Tamanho" />
            </SelectTrigger>
            <SelectContent>
              {fontSizes.map((size) => (
                <SelectItem key={size.value} value={size.value}>
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Text Color Picker */}
          <ColorPicker
            value={editor.getAttributes("textStyle").color || "#000000"}
            onChange={(color) => {
              editor.chain().focus().setColor(color).run();
            }}
            className="w-40 h-8 text-xs"
          />

          {/* Background Color Picker */}
          <ColorPicker
            value={
              editor.getAttributes("textStyle").backgroundColor || "#ffffff"
            }
            onChange={(color) => {
              editor.chain().focus().setBackgroundColor(color).run();
            }}
            className="w-40 h-8 text-xs"
          />

          {/* Line Height Selector */}
          <Select
            value={editor.getAttributes("textStyle").lineHeight || "1.5"}
            onValueChange={(value) => {
              editor.chain().focus().setLineHeight(value).run();
            }}
          >
            <SelectTrigger className="w-24 h-8 text-xs">
              <AlignVerticalSpaceAround className="w-3 h-3 mr-1" />
              <SelectValue placeholder="Altura" />
            </SelectTrigger>
            <SelectContent>
              {lineHeights.map((height) => (
                <SelectItem key={height.value} value={height.value}>
                  {height.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Page Format Selector */}
          <PageFormatSelector
            value={
              (editor.storage.pageFormat?.pageSize as PageSize) ||
              (editor.getAttributes("doc").pageSize as PageSize) ||
              "default"
            }
            onValueChange={(pageSize: PageSize) => {
              editor.chain().focus().setPageFormat(pageSize).run();
            }}
            size="sm"
            className="h-8"
          />

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
          {renderButtonGroup(textStyleButtons, "textStyle")}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
          {renderButtonGroup(mentionButtons, "mentions")}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
          {renderButtonGroup(utilityButtons, "utilities")}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
          {renderButtonGroup(headingButtons, "headings")}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
          {renderButtonGroup(listButtons, "lists")}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
          {renderButtonGroup(taskButtons, "tasks")}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
          {renderButtonGroup(alignmentButtons, "alignment")}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
          {renderButtonGroup(actionButtons, "actions")}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
          {renderButtonGroup(mediaButtons, "media")}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
          {renderButtonGroup(historyButtons, "history")}
        </div>
      </div>

      {/* Stats - Hidden on mobile, shown on larger screens */}
      <div className="hidden sm:block flex-shrink-0">
        <WriterToolbarStats
          wordCount={wordCount}
          characterCount={characterCount}
          readingTime={readingTime}
        />
      </div>
    </div>
  );
}
