"use client";

import { useEditor } from "@tiptap/react";
import * as React from "react";

// --- Tiptap Core Extensions ---
import { Extension } from "@tiptap/core";
import CharacterCount from "@tiptap/extension-character-count";
import Color from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import Placeholder from "@tiptap/extension-placeholder";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import { Selection } from "@tiptap/extensions";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { StarterKit } from "@tiptap/starter-kit";

// --- New Extensions ---
import { Blockquote } from "@tiptap/extension-blockquote";
import { Code } from "@tiptap/extension-code";
import { CodeBlock } from "@tiptap/extension-code-block";
import DropCursor from "@tiptap/extension-dropcursor";
import { Focus } from "@tiptap/extension-focus";
import { HardBreak } from "@tiptap/extension-hard-break";
import { Link } from "@tiptap/extension-link";
import { Mention } from "@tiptap/extension-mention";
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from "@tiptap/extension-table";
import { Youtube } from "@tiptap/extension-youtube";
import { TextStyleKit } from "@tiptap/extension-text-style";
// History extension removed - using StarterKit's built-in history

// --- Tiptap Node ---
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";

// --- Utils ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";
import { cn } from "@/lib/utils";

// --- Components ---
import { EditorContentWrapper } from "./editor-content-wrapper";
import { WriterStatsPanel } from "./writer-stats-panel";
import { WriterToolbarContent } from "./writer-toolbar-content";

// --- Hooks ---
import { useDeviceInfo } from "@/hooks/use-mobile";

interface TiptapEditorProps {
  content: any;
  onChange: (content: any) => void;
  placeholder?: string;
  className?: string;
  characters?: any[];
  locations?: any[];
  readOnly?: boolean;
}

// Custom Mention extension for @characters and #locations
const MentionExtension = Extension.create({
  name: "mention",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("mention"),
        props: {
          decorations: (state) => {
            const decorations: Decoration[] = [];
            const doc = state.doc;

            doc.descendants((node, pos) => {
              if (node.isText) {
                const text = node.text || "";

                // Match @mentions for characters
                const characterMatches = text.matchAll(/@(\w+)/g);
                for (const match of characterMatches) {
                  const start = pos + (match.index || 0);
                  const end = start + match[0].length;
                  decorations.push(
                    Decoration.inline(start, end, {
                      class:
                        "mention-character bg-escrivania-purple-100 text-escrivania-purple-700 px-1 rounded cursor-pointer",
                      "data-mention-type": "character",
                      "data-mention-name": match[1],
                    })
                  );
                }

                // Match #mentions for locations
                const locationMatches = text.matchAll(/#(\w+)/g);
                for (const match of locationMatches) {
                  const start = pos + (match.index || 0);
                  const end = start + match[0].length;
                  decorations.push(
                    Decoration.inline(start, end, {
                      class:
                        "mention-location bg-escrivania-blue-100 text-escrivania-blue-700 px-1 rounded cursor-pointer",
                      "data-mention-type": "location",
                      "data-mention-name": match[1],
                    })
                  );
                }
              }
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});

export function TiptapEditor({
  content,
  onChange,
  placeholder = "Comece a escrever sua história aqui...",
  className = "",
  characters = [],
  locations = [],
  readOnly = false,
}: TiptapEditorProps) {
  const deviceInfo = useDeviceInfo();
  const [wordCount, setWordCount] = React.useState(0);
  const [characterCount, setCharacterCount] = React.useState(0);
  const [readingTime, setReadingTime] = React.useState(0);
  const [paragraphCount, setParagraphCount] = React.useState(0);
  const [writingGoal, setWritingGoal] = React.useState(500); // Meta de palavras
  const [sessionStartTime] = React.useState(Date.now());
  const [sessionWordCount, setSessionWordCount] = React.useState(0);

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editable: !readOnly,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label":
          "Área principal de conteúdo, comece a digitar para inserir texto.",
        class: `enhanced-writer-editor ${className} ${deviceInfo.isMobile ? 'mobile-editor' : deviceInfo.isTablet ? 'tablet-editor' : 'desktop-editor'}`,
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: false, // Disabled to use custom Link extension
        blockquote: false, // Disabled to use custom Blockquote extension
        codeBlock: false, // Disabled to use custom CodeBlock extension
        hardBreak: false, // Disabled to use custom HardBreak extension
        // history is enabled by default in StarterKit
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      // Core Extensions
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: "highlight",
        },
      }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      Color,
      CharacterCount,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
      Underline,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
      // New Extensions - Marks
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-escrivania-blue-600 underline cursor-pointer",
        },
      }),
      Code.configure({
        HTMLAttributes: {
          class:
            "bg-muted text-muted-foreground px-1 py-0.5 rounded text-sm font-mono",
        },
      }),
      // New Extensions - Nodes
      Blockquote.configure({
        HTMLAttributes: {
          class: "border-l-4 border-border pl-4 italic text-muted-foreground",
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class:
            "bg-secondary text-secondary-foreground p-4 rounded-lg font-mono text-sm overflow-x-auto",
        },
      }),
      HardBreak,
      Mention.configure({
        HTMLAttributes: {
          class:
            "mention bg-escrivania-blue-100 text-escrivania-blue-800 px-2 py-1 rounded-full text-sm",
        },
        suggestion: {
          items: ({ query }) => {
            return [
              "Protagonist",
              "Antagonist",
              "Supporting Character",
              "Love Interest",
              "Mentor",
              "Sidekick",
            ]
              .filter((item) =>
                item.toLowerCase().startsWith(query.toLowerCase())
              )
              .slice(0, 5);
          },
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse border border-border w-full",
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: "border border-border",
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: "border border-border bg-muted font-semibold p-2",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-gray-300 p-2",
        },
      }),
      Youtube.configure({
        width: deviceInfo.isMobile ? 320 : 
               deviceInfo.isTablet ? 480 : 
               deviceInfo.isMacbook ? 560 : // Otimizado para MacBook Pro M1 13"
               deviceInfo.isNotebook ? 640 : 
               720, // Desktop grandes
        height: deviceInfo.isMobile ? 240 : 
                deviceInfo.isTablet ? 360 : 
                deviceInfo.isMacbook ? 315 : // Proporção 16:9 para MacBook Pro M1
                deviceInfo.isNotebook ? 480 : 
                540, // Desktop grandes
        HTMLAttributes: {
          class: "youtube-embed rounded-lg",
        },
      }),
      // New Extensions - Functionality
      DropCursor.configure({
        color: "oklch(0.75 0.15 200)", // Usando a cor azul do projeto
        width: 2,
      }),
      Focus.configure({
        className: "has-focus",
        mode: "all",
      }),
      // History extension removed - using StarterKit's built-in history
      // Text Style Extensions
      TextStyleKit,
      // Custom Extensions
      MentionExtension,
    ],
    content,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange(json);

      // Update counts
      const stats = editor.storage.characterCount;
      const words = stats.words();
      const characters = stats.characters();

      setWordCount(words);
      setCharacterCount(characters);

      // Calculate reading time (average 200 words per minute)
      setReadingTime(Math.ceil(words / 200));

      // Count paragraphs
      const text = editor.getText();
      const paragraphs = text
        .split("\n\n")
        .filter((p) => p.trim().length > 0).length;
      setParagraphCount(paragraphs);
    },
  });

  React.useEffect(() => {
    if (editor && content !== editor.getJSON()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Calculate writing session stats
  const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 60000); // minutes
  const wordsPerMinute =
    sessionDuration > 0 ? Math.round(sessionWordCount / sessionDuration) : 0;
  const goalProgress = Math.round((wordCount / writingGoal) * 100);

  // Update session word count when content changes
  React.useEffect(() => {
    if (wordCount > sessionWordCount) {
      setSessionWordCount(wordCount);
    }
  }, [wordCount, sessionWordCount]);

  const toggleHighlight = React.useCallback(
    (color: string) => {
      if (!editor) return;

      if (editor.isActive("highlight", { color })) {
        editor.chain().focus().unsetHighlight().run();
      } else {
        editor.chain().focus().setHighlight({ color }).run();
      }
    },
    [editor]
  );

  if (!editor) {
    return null;
  }

  const getMinHeight = () => {
    if (deviceInfo.isMobile) return "min-h-[400px]";
    if (deviceInfo.isTablet) return "min-h-[500px]";
    if (deviceInfo.isMacbook) return "min-h-[550px]"; // Otimizado para MacBook Pro M1 13"
    if (deviceInfo.isNotebook) return "min-h-[580px]";
    return "min-h-[650px]"; // Desktop grandes
  };

  const getToolbarVisibility = () => {
    if (readOnly) return false;
    if (deviceInfo.isMobile) return false; // Hide toolbar on mobile for cleaner interface
    return true; // Show toolbar on tablet, notebook, macbook and desktop
  };

  const getStatsVisibility = () => {
    if (readOnly) return false;
    if (deviceInfo.isMobile) return false; // Hide stats on mobile
    if (deviceInfo.isTablet) return false; // Hide stats on tablet
    return true; // Show stats on notebook, macbook and desktop
  };

  return (
    <div
      className={cn(
        "flex flex-col w-full h-full max-h-screen",
        getMinHeight(),
        "bg-background rounded-lg dark:bg-gray-900",
        "overflow-hidden",
        deviceInfo.isMobile && "text-sm",
        deviceInfo.isTablet && "text-base",
        deviceInfo.isMacbook && "text-base", // Tamanho de texto otimizado para MacBook Pro M1
        deviceInfo.isNotebook && "text-base",
        deviceInfo.isDesktop && "text-lg",
        className
      )}
    >
      {/* Toolbar - Hidden on mobile and read-only mode */}
      {getToolbarVisibility() && (
        <div className="flex-shrink-0">
          <WriterToolbarContent
            editor={editor}
            wordCount={wordCount}
            characterCount={characterCount}
            readingTime={readingTime}
          />
        </div>
      )}

      {/* Editor Content */}
      <div className={cn(
        "flex-1 overflow-hidden",
        deviceInfo.isMobile && "p-2",
        deviceInfo.isTablet && "p-3",
        deviceInfo.isMacbook && "p-4", // Padding otimizado para MacBook Pro M1
        deviceInfo.isNotebook && "p-4",
        deviceInfo.isDesktop && "p-6" // Mais espaço em desktops grandes
      )}>
        <EditorContentWrapper editor={editor} />
      </div>

      {/* Stats Panel - Hidden on mobile/tablet and read-only mode */}
      {getStatsVisibility() && (
        <div className="flex-shrink-0">
          <WriterStatsPanel
            wordCount={wordCount}
            characterCount={characterCount}
            readingTime={readingTime}
            writingGoal={writingGoal}
            sessionWordCount={sessionWordCount}
            sessionDuration={sessionDuration}
            wordsPerMinute={wordsPerMinute}
            goalProgress={goalProgress}
          />
        </div>
      )}
    </div>
  );
}
