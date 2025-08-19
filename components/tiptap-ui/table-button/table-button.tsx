"use client";

import { type Editor } from "@tiptap/react";
import * as React from "react";

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

// --- UI Primitives ---
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button";
import { Button } from "@/components/tiptap-ui-primitive/button";

// --- Icons ---
import { TableIcon } from "lucide-react";

export interface TableButtonProps extends Omit<ButtonProps, "type"> {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null;
  /**
   * Optional text to display alongside the icon.
   */
  text?: string;
  /**
   * Number of rows for the initial table.
   * @default 3
   */
  rows?: number;
  /**
   * Number of columns for the initial table.
   * @default 3
   */
  cols?: number;
}

export function TableButton({
  editor: providedEditor,
  text,
  rows = 3,
  cols = 3,
  ...props
}: TableButtonProps) {
  const { editor } = useTiptapEditor(providedEditor);

  const canInsertTable =
    editor?.can().insertTable({ rows, cols, withHeaderRow: true }) ?? false;

  const handleInsertTable = React.useCallback(() => {
    if (!editor || !canInsertTable) return;
    editor
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: true })
      .run();
  }, [editor, canInsertTable, rows, cols]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleInsertTable}
      disabled={!canInsertTable}
      aria-label="Insert table"
      {...props}
    >
      <TableIcon className="h-4 w-4" />
      {text && <span className="ml-2">{text}</span>}
    </Button>
  );
}

TableButton.displayName = "TableButton";
