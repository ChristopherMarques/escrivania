"use client";

import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
  Link,
  Unlink,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
    {
      icon: Code,
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive("code"),
      tooltip: "Código inline",
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
    {
      icon: Link,
      action: () => {
        const url = window.prompt("URL do link:");
        if (url) {
          editor.chain().focus().setLink({ href: url }).run();
        }
      },
      isActive: editor.isActive("link"),
      tooltip: "Inserir link",
    },
    {
      icon: Unlink,
      action: () => editor.chain().focus().unsetLink().run(),
      isActive: false,
      tooltip: "Remover link",
    },
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
      {/* Toolbar Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 w-full sm:w-auto">
        <div className="flex items-center gap-2 flex-nowrap">
          {renderButtonGroup(formatButtons, "format")}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
          {renderButtonGroup(headingButtons, "headings")}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
          {renderButtonGroup(listButtons, "lists")}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
          {renderButtonGroup(alignmentButtons, "alignment")}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
          {renderButtonGroup(actionButtons, "actions")}
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