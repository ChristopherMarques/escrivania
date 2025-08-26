"use client";

import { useDeviceInfo } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Editor, EditorContent } from "@tiptap/react";
import { memo, useMemo } from "react";

interface EditorContentWrapperProps {
  editor: Editor | null;
  className?: string;
}

const EditorContentWrapperComponent = ({
  editor,
  className,
}: EditorContentWrapperProps) => {
  const deviceInfo = useDeviceInfo();

  // Memoize responsive classes calculation for performance
  const responsiveClasses = useMemo(() => {
    const baseClasses = [
      "w-full",
      "h-full",
      "focus:outline-none",
      "prose",
      "prose-gray",
      "dark:prose-invert",
      "max-w-none",
      "prose-headings:font-bold",
      "prose-p:leading-relaxed",
      "prose-pre:bg-gray-100",
      "dark:prose-pre:bg-gray-800",
      "prose-code:bg-gray-100",
      "dark:prose-code:bg-gray-800",
      "prose-code:px-1",
      "prose-code:py-0.5",
      "prose-code:rounded",
    ];

    if (deviceInfo.isMobile) {
      return [...baseClasses, "prose-sm"];
    } else if (deviceInfo.isTablet) {
      return [...baseClasses, "prose"];
    } else if (deviceInfo.isMacbook) {
      return [...baseClasses, "prose-lg"];
    } else if (deviceInfo.isNotebook) {
      return [...baseClasses, "prose-lg"];
    } else {
      return [...baseClasses, "prose-xl"];
    }
  }, [deviceInfo]);

  // Memoize editor content classes
  const editorContentClasses = useMemo(
    () =>
      cn(
        responsiveClasses,
        "max-w-none mx-auto",
        "dark:prose-invert",
        "prose-headings:font-bold prose-headings:tracking-tight",
        "prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8",
        "prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-6",
        "prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-5",
        "prose-p:mb-4 prose-p:leading-relaxed",
        "prose-strong:font-semibold",
        "prose-em:italic",
        "prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm",
        "prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic",
        "prose-ul:list-disc prose-ol:list-decimal",
        "prose-li:mb-1",
        "prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800",
        "focus-within:outline-none"
      ),
    [responsiveClasses]
  );

  return (
    <div
      className={cn(
        "flex-1 h-full overflow-y-auto bg-white dark:bg-gray-900",
        "transition-all duration-200",
        className
      )}
    >
      <EditorContent
        editor={editor}
        className={cn(editorContentClasses, "h-full min-h-full")}
      />
    </div>
  );
};

// Export memoized component for performance
export const EditorContentWrapper = memo(EditorContentWrapperComponent);
