"use client";

import { EditorContent, Editor } from "@tiptap/react";
import { cn } from "@/lib/utils";

interface EditorContentWrapperProps {
  editor: Editor | null;
  className?: string;
}

export function EditorContentWrapper({
  editor,
  className,
}: EditorContentWrapperProps) {
  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto bg-white dark:bg-gray-900",
        "transition-all duration-200",
        className
      )}
    >
      <EditorContent
        editor={editor}
        className={cn(
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl",
          "max-w-none mx-auto px-6 py-8",
          "dark:prose-invert",
          "prose-headings:font-bold prose-headings:tracking-tight",
          "prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8",
          "prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-6",
          "prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-5",
          "prose-p:text-gray-700 dark:prose-p:text-gray-300",
          "prose-p:leading-relaxed prose-p:mb-4",
          "prose-strong:text-gray-900 dark:prose-strong:text-gray-100",
          "prose-em:text-gray-800 dark:prose-em:text-gray-200",
          "prose-code:bg-gray-100 dark:prose-code:bg-gray-800",
          "prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded",
          "prose-code:text-sm prose-code:font-medium",
          "prose-blockquote:border-l-4 prose-blockquote:border-blue-500",
          "prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20",
          "prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:rounded-r",
          "prose-ul:list-disc prose-ol:list-decimal",
          "prose-li:mb-1 prose-li:leading-relaxed",
          "prose-a:text-blue-600 dark:prose-a:text-blue-400",
          "prose-a:no-underline hover:prose-a:underline",
          "focus:outline-none",
          "min-h-[500px]"
        )}
      />
    </div>
  );
}