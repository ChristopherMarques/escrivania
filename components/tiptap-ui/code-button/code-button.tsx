"use client"

import * as React from "react"
import { type Editor } from "@tiptap/react"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- UI Primitives ---
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button"
import { Button } from "@/components/tiptap-ui-primitive/button"

// --- Icons ---
import { CodeIcon } from "lucide-react"

export interface CodeButtonProps extends Omit<ButtonProps, "type"> {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null
  /**
   * Optional text to display alongside the icon.
   */
  text?: string
}

export function CodeButton({
  editor: providedEditor,
  text,
  ...props
}: CodeButtonProps) {
  const { editor } = useTiptapEditor(providedEditor)

  const isActive = editor?.isActive("code") ?? false
  const canToggle = editor?.can().chain().focus().toggleCode().run() ?? false

  const handleToggle = React.useCallback(() => {
    if (!editor || !canToggle) return
    editor.chain().focus().toggleCode().run()
  }, [editor, canToggle])

  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={handleToggle}
      disabled={!canToggle}
      aria-label="Toggle inline code"
      aria-pressed={isActive}
      {...props}
    >
      <CodeIcon className="h-4 w-4" />
      {text && <span className="ml-2">{text}</span>}
    </Button>
  )
}

CodeButton.displayName = "CodeButton"