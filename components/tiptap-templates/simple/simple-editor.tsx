"use client";

import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { useState } from "react";

export function SimpleEditor() {
  const [content, setContent] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Editor Simples
          </h1>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <TiptapEditor
              content={content}
              onChange={setContent}
              placeholder="Comece a escrever aqui..."
              className="min-h-[500px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}