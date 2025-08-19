"use client";

import { type Editor } from "@tiptap/react";
import * as React from "react";

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

// --- UI Primitives ---
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button";
import { Button } from "@/components/tiptap-ui-primitive/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// --- Icons ---
import { YoutubeIcon } from "lucide-react";

export interface YoutubeButtonProps extends Omit<ButtonProps, "type"> {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null;
  /**
   * Optional text to display alongside the icon.
   */
  text?: string;
}

export function YoutubeButton({
  editor: providedEditor,
  text,
  ...props
}: YoutubeButtonProps) {
  const { editor } = useTiptapEditor(providedEditor);
  const [url, setUrl] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  const canInsertYoutube = editor?.can().setYoutubeVideo({ src: "" }) ?? false;

  const handleInsertYoutube = React.useCallback(() => {
    if (!editor || !canInsertYoutube || !url.trim()) return;

    editor.chain().focus().setYoutubeVideo({ src: url.trim() }).run();
    setUrl("");
    setIsOpen(false);
  }, [editor, canInsertYoutube, url]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleInsertYoutube();
      }
    },
    [handleInsertYoutube]
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={!canInsertYoutube}
          aria-label="Insert YouTube video"
          {...props}
        >
          <YoutubeIcon className="h-4 w-4" />
          {text && <span className="ml-2">{text}</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Insert YouTube Video</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="youtube-url">YouTube URL</Label>
            <Input
              id="youtube-url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                setUrl("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleInsertYoutube} disabled={!url.trim()}>
              Insert
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

YoutubeButton.displayName = "YoutubeButton";
