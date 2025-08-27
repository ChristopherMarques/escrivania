"use client";

import { useEditor } from "@tiptap/react";
import { debounce } from "lodash";
import * as React from "react";
const { useCallback, useMemo, useEffect, memo } = React;

// --- Tiptap Core Extensions ---
import { Extension } from "@tiptap/core";
import CharacterCount from "@tiptap/extension-character-count";
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
import DropCursor from "@tiptap/extension-dropcursor";
import { Focus } from "@tiptap/extension-focus";
import { FontFamily } from "@tiptap/extension-font-family";
import { FontSize } from "@tiptap/extension-font-size";
// Removed Gapcursor - using StarterKit version
import { Highlight } from "@tiptap/extension-highlight";
import { Mention } from "@tiptap/extension-mention";
import { Color, TextStyle } from "@tiptap/extension-text-style";
// History extension removed - using StarterKit's built-in history

// --- Tiptap Node ---
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";

// --- Custom Extensions ---
// Removed EnhancedEnter and SmartDeletion - using StarterKit defaults
import { ImageTextFlow } from "@/lib/extensions/image-text-flow";
import { PageFormat } from "@/lib/extensions/page-format";

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

export const TiptapEditor = memo(function TiptapEditor({
  content,
  onChange,
  placeholder = "Comece a escrever sua história aqui...",
  className = "",
  characters = [],
  locations = [],
  readOnly = false,
}: TiptapEditorProps) {
  const deviceInfo = useDeviceInfo();

  // Memoize debounced onChange function for performance optimization
  const debouncedOnChange = useMemo(
    () =>
      debounce((content: any) => {
        onChange?.(content);
      }, 300), // Increased debounce time for better performance
    [onChange]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedOnChange.cancel();
    };
  }, [debouncedOnChange]);
  const [wordCount, setWordCount] = React.useState(0);
  const [characterCount, setCharacterCount] = React.useState(0);
  const [readingTime, setReadingTime] = React.useState(0);
  const [paragraphCount, setParagraphCount] = React.useState(0);
  const [writingGoal, setWritingGoal] = React.useState(500); // Meta de palavras
  const [sessionStartTime] = React.useState(Date.now());
  const [sessionWordCount, setSessionWordCount] = React.useState(0);

  // Memoize extensions for better performance
  const extensions = useMemo(
    () => [
      StarterKit.configure({
        horizontalRule: false,
        blockquote: false,
        // Keep default history for undo/redo functionality
        history: {
          depth: 100,
          newGroupDelay: 500,
        },
        // Keep default hardBreak for line breaks
        hardBreak: {
          keepMarks: false,
        },
        paragraph: {
          HTMLAttributes: {
            class: "tiptap-paragraph",
          },
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        // Enable gapcursor for better navigation
        gapcursor: true,
      }),
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
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: "tiptap-image",
        },
      }),
      Typography,
      Superscript,
      Subscript,
      Selection,
      Color,
      TextStyle,
      FontFamily.configure({
        types: ["textStyle"],
      }),
      FontSize.configure({
        types: ["textStyle"],
      }),
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
      Blockquote.configure({
        HTMLAttributes: {
          class: "border-l-4 border-border pl-4 italic text-muted-foreground",
        },
      }),
      // Remove duplicate HardBreak - using StarterKit's version
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
      DropCursor.configure({
        color: "oklch(0.75 0.15 200)",
        width: 2,
      }),
      // Remove duplicate Gapcursor - using StarterKit's version
      Focus.configure({
        className: "has-focus",
        mode: "all",
      }),
      // Remove EnhancedEnter - using StarterKit's default behavior
      ImageTextFlow.configure({
        autoAddParagraphs: false,
        enableArrowNavigation: false,
        enableEnterNavigation: false,
      }),
      // Remove SmartDeletion - using StarterKit's default behavior
      MentionExtension,
      PageFormat,
    ],
    [placeholder]
  );

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editable: !readOnly,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        spellcheck: "true",
        "aria-label":
          "Área principal de conteúdo, comece a digitar para inserir texto.",
        class: `enhanced-writer-editor ${className} ${
          deviceInfo.isMobile
            ? "mobile-editor"
            : deviceInfo.isTablet
              ? "tablet-editor"
              : "desktop-editor"
        }`,
      },
      // Performance optimizations
      scrollThreshold: 100,
      scrollMargin: 50,
      handleKeyDown: (view, event) => {
        // Let TipTap handle all key events naturally
        return false;
      },
    },
    // Performance optimizations
    parseOptions: {
      preserveWhitespace: "full",
    },
    enableInputRules: true,
    enablePasteRules: true,
    injectCSS: false, // We handle CSS ourselves
    extensions,
    content:
      content && typeof content === "object" && content.type
        ? content
        : {
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: [],
              },
            ],
          },
    onUpdate: useCallback(
      ({ editor }: { editor: any }) => {
        const json = editor.getJSON();
        debouncedOnChange(json);

        // Update counts with throttling for better performance
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
          .filter((p: string) => p.trim().length > 0).length;
        setParagraphCount(paragraphs);
      },
      [debouncedOnChange]
    ),
  });

  // Prevent infinite loops by tracking content updates
  const [isUpdatingContent, setIsUpdatingContent] = React.useState(false);

  // Sync content with editor when content prop changes
  React.useEffect(() => {
    if (
      editor &&
      content !== undefined &&
      !isUpdatingContent &&
      !editor.isFocused
    ) {
      const currentContent = editor.getJSON();

      // Extract text for comparison to avoid JSON stringify issues
      const extractText = (contentObj: any): string => {
        if (!contentObj || !Array.isArray(contentObj.content)) return "";
        return contentObj.content
          .map((node: any) => {
            if (node.type === "text") return node.text || "";
            if (node.content) return extractText(node);
            return "";
          })
          .join("");
      };

      const currentText = extractText(currentContent);
      const newText = extractText(content);

      // Only update if text content is actually different
      if (currentText !== newText) {
        setIsUpdatingContent(true);

        // Use requestAnimationFrame for better performance
        requestAnimationFrame(() => {
          if (editor && !editor.isDestroyed) {
            editor.commands.setContent(content);
          }
          // Reset flag after a short delay
          setTimeout(() => setIsUpdatingContent(false), 100);
        });
      }
    }
  }, [editor, content, isUpdatingContent]);

  // Calculate writing session stats (client-side only to avoid hydration mismatch)
  const [sessionDuration, setSessionDuration] = React.useState(0);
  const [wordsPerMinute, setWordsPerMinute] = React.useState(0);
  const goalProgress = Math.round((wordCount / writingGoal) * 100);

  React.useEffect(() => {
    const duration = Math.floor((Date.now() - sessionStartTime) / 60000); // minutes
    setSessionDuration(duration);
    setWordsPerMinute(
      duration > 0 ? Math.round(sessionWordCount / duration) : 0
    );
  }, [sessionStartTime, sessionWordCount]);

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

  // Memoize responsive calculations - moved before conditional return
  const minHeight = useMemo(() => {
    if (deviceInfo.isMobile) return "min-h-[400px]";
    if (deviceInfo.isTablet) return "min-h-[500px]";
    if (deviceInfo.isMacbook) return "min-h-[550px]"; // Otimizado para MacBook Pro M1 13"
    if (deviceInfo.isNotebook) return "min-h-[580px]";
    return "min-h-[650px]"; // Desktop grandes
  }, [deviceInfo]);

  const toolbarVisibility = useMemo(() => {
    if (readOnly) return false;
    if (deviceInfo.isMobile) return false; // Hide toolbar on mobile for cleaner interface
    return true; // Show toolbar on tablet, notebook, macbook and desktop
  }, [readOnly, deviceInfo.isMobile]);

  const statsVisibility = useMemo(() => {
    if (readOnly) return false;
    if (deviceInfo.isMobile) return false; // Hide stats on mobile
    if (deviceInfo.isTablet) return false; // Hide stats on tablet
    return true; // Show stats on notebook, macbook and desktop
  }, [readOnly, deviceInfo.isMobile, deviceInfo.isTablet]);

  if (!editor) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-col w-full h-full relative",
        minHeight,
        "overflow-hidden",
        deviceInfo.isMobile && "text-sm",
        deviceInfo.isTablet && "text-base",
        deviceInfo.isMacbook && "text-base", // Tamanho de texto otimizado para MacBook Pro M1
        deviceInfo.isNotebook && "text-base",
        deviceInfo.isDesktop && "text-lg",
        className
      )}
    >
      {/* Editor Background - Clean design without borders */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/98 via-white/95 to-white/90 backdrop-blur-sm" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          background: `linear-gradient(135deg, var(--primary)/0.04 0%, var(--secondary)/0.02 50%, var(--primary)/0.04 100%)`,
        }}
      />

      {/* Gradient Blobs for Visual Enhancement */}
      <div
        className="absolute top-4 right-4 w-32 h-32 rounded-full blur-3xl animate-pulse opacity-20"
        style={{
          background: `linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)`,
        }}
      />
      <div
        className="absolute bottom-8 left-8 w-24 h-24 rounded-full blur-2xl animate-pulse opacity-15"
        style={{
          background: `linear-gradient(45deg, var(--secondary) 0%, var(--primary) 100%)`,
          animationDelay: "1.5s",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col w-full h-full">
        {/* Toolbar - Hidden on mobile and read-only mode */}
        {toolbarVisibility && (
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
        <div
          className={cn(
            "flex-1 overflow-hidden h-full",
            deviceInfo.isMobile && "p-2",
            deviceInfo.isTablet && "p-3",
            deviceInfo.isMacbook && "p-4", // Padding otimizado para MacBook Pro M1
            deviceInfo.isNotebook && "p-4",
            deviceInfo.isDesktop && "p-6" // Mais espaço em desktops grandes
          )}
        >
          <EditorContentWrapper editor={editor} />
        </div>

        {/* Stats Panel - Hidden on mobile/tablet and read-only mode */}
        {statsVisibility && (
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
    </div>
  );
});
