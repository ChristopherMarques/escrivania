"use client";

import { useEditor } from "@tiptap/react";
import { debounce } from "lodash";
import * as React from "react";
const { useCallback, useMemo, useEffect, memo } = React;

// --- Tiptap Core Extensions ---
import CharacterCount from "@tiptap/extension-character-count";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import Placeholder from "@tiptap/extension-placeholder";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import { StarterKit } from "@tiptap/starter-kit";

// --- Additional Extensions ---
import { Color } from "@tiptap/extension-color";
import { FontFamily } from "@tiptap/extension-font-family";
import { FontSize } from "@tiptap/extension-font-size";
import { Highlight } from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";

// --- Custom Extensions ---
import { PageFormat } from "@/lib/extensions/page-format";

// --- Tiptap Node ---
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";

// --- Utils ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";
import { cn } from "@/lib/utils";

// --- Components ---
import { Button } from "@/components/ui/button";
import { BarChart3, ChevronDown, ChevronUp, X } from "lucide-react";
import { EditorContentWrapper } from "./editor-content-wrapper";
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
  const [statsViewMode, setStatsViewMode] = React.useState<
    "hidden" | "compact" | "expanded"
  >("compact");

  // Memoize extensions for better performance
  const extensions = useMemo(
    () => [
      StarterKit.configure({
        horizontalRule: false,
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      FontFamily.configure({
        types: ["textStyle"],
      }),
      FontSize.configure({
        types: ["textStyle"],
      }),
      PageFormat.configure({
        types: ["doc"],
      }),
      Image,
      Typography,
      Superscript,
      Subscript,
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
        "aria-label":
          "Área principal de conteúdo, comece a digitar para inserir texto.",
        class: `enhanced-writer-editor ${className}`,
      },
    },
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
    // Show stats on screens wider than 1024px (tablets in landscape and larger)
    if (deviceInfo.width < 1024) return false;
    return true;
  }, [readOnly, deviceInfo.width]);

  if (!editor) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-col w-full h-screen relative",
        deviceInfo.isMobile && "text-sm",
        deviceInfo.isTablet && "text-base",
        deviceInfo.isMacbook && "text-base", // Tamanho de texto otimizado para MacBook Pro M1
        deviceInfo.isNotebook && "text-base",
        deviceInfo.isDesktop && "text-lg",
        className
      )}
    >
      {/* Editor Background - Clean design with dark mode support */}
      <div className="absolute inset-0 bg-background backdrop-blur-sm" />
      <div
        className="absolute inset-0 opacity-5 dark:opacity-10"
        style={{
          background: `linear-gradient(135deg, var(--primary)/0.04 0%, var(--secondary)/0.02 50%, var(--primary)/0.04 100%)`,
        }}
      />

      {/* Gradient Blobs for Visual Enhancement */}
      <div
        className="absolute top-4 right-4 w-32 h-32 rounded-full blur-3xl animate-pulse opacity-20 dark:opacity-30"
        style={{
          background: `linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)`,
        }}
      />
      <div
        className="absolute bottom-8 left-8 w-24 h-24 rounded-full blur-2xl animate-pulse opacity-15 dark:opacity-25"
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

        {/* Editor Content with Scroll */}
        <div
          className={cn(
            "flex-1 overflow-auto min-h-0",
            deviceInfo.isMobile && "p-2",
            deviceInfo.isTablet && "p-3",
            deviceInfo.isMacbook && "p-4", // Padding otimizado para MacBook Pro M1
            deviceInfo.isNotebook && "p-4",
            deviceInfo.isDesktop && "p-6" // Mais espaço em desktops grandes
          )}
        >
          <div className="h-full flex flex-col">
            <EditorContentWrapper editor={editor} className="flex-1" />
          </div>
        </div>
      </div>

      {/* Floating Stats Panel - Multiple view modes */}
      {statsVisibility && statsViewMode !== "hidden" && (
        <div
          className={cn(
            "fixed z-50 transition-all duration-300",
            statsViewMode === "compact"
              ? "bottom-4 right-4 w-auto"
              : "bottom-0 left-0 right-0 p-4"
          )}
        >
          {statsViewMode === "compact" ? (
            // Compact Mode - Small floating widget
            <div className="bg-background/95 backdrop-blur-md border border-primary/20 rounded-xl shadow-xl p-3 hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">
                    {wordCount}
                  </div>
                  <div className="text-xs text-muted-foreground">Palavras</div>
                </div>
                <div className="w-px h-8 bg-border"></div>
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">
                    {Math.round((wordCount / writingGoal) * 100)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Meta</div>
                </div>
                <div className="w-px h-8 bg-border"></div>
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">
                    {readingTime}
                  </div>
                  <div className="text-xs text-muted-foreground">Min</div>
                </div>

                {/* Toggle buttons */}
                <div className="flex flex-col gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStatsViewMode("expanded")}
                    className="h-6 w-6 p-0 text-primary hover:bg-primary/10"
                    title="Expandir estatísticas"
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStatsViewMode("hidden")}
                    className="h-6 w-6 p-0 text-muted-foreground hover:bg-muted"
                    title="Ocultar estatísticas"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            // Expanded Mode - Full width panel
            <div className="max-w-7xl mx-auto">
              <div className="bg-background/95 backdrop-blur-md border border-primary/20 rounded-2xl shadow-2xl p-6 transition-all duration-300 hover:shadow-3xl hover:border-primary/40">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-primary">
                    Estatísticas de Escrita
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStatsViewMode("compact")}
                      className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
                      title="Modo compacto"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStatsViewMode("hidden")}
                      className="h-8 w-8 p-0 text-muted-foreground hover:bg-muted"
                      title="Ocultar estatísticas"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-6">
                  {/* Palavras */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {wordCount}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Palavras
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {Math.round((wordCount / writingGoal) * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Meta ({writingGoal})
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${Math.min((wordCount / writingGoal) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Tempo de leitura */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {readingTime}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Min. Leitura
                    </div>
                  </div>

                  {/* Palavras por minuto */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {wordsPerMinute}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Palavras/Min
                    </div>
                  </div>

                  {/* Duração da sessão */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {sessionDuration}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Min. Sessão
                    </div>
                  </div>

                  {/* Caracteres */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {characterCount}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Caracteres
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Show Stats Button when hidden */}
      {statsVisibility && statsViewMode === "hidden" && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStatsViewMode("compact")}
            className="bg-background/95 backdrop-blur-md border-primary/20 hover:border-primary/40 text-primary shadow-lg"
            title="Mostrar estatísticas"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Estatísticas
          </Button>
        </div>
      )}
    </div>
  );
});
