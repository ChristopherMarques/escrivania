import { Extension } from "@tiptap/core";

export interface PageFormatOptions {
  types: string[];
}

export type PageSize = "a4" | "a5" | "16x23" | "14x21" | "default";

export interface PageFormatAttributes {
  pageSize: PageSize;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    pageFormat: {
      /**
       * Set the page format
       */
      setPageFormat: (pageSize: PageSize) => ReturnType;
    };
  }
}

const pageFormatStyles = {
  a4: {
    width: "21cm",
    minHeight: "29.7cm",
    padding: "2cm",
    margin: "2rem auto",
    boxShadow: "0 0 20px rgba(0,0,0,0.1)",
    background: "white",
    borderRadius: "4px",
  },
  a5: {
    width: "14.8cm",
    minHeight: "21cm",
    padding: "1.5cm",
    margin: "2rem auto",
    boxShadow: "0 0 20px rgba(0,0,0,0.1)",
    background: "white",
    borderRadius: "4px",
  },
  "16x23": {
    width: "16cm",
    minHeight: "23cm",
    padding: "1.5cm",
    margin: "2rem auto",
    boxShadow: "0 0 20px rgba(0,0,0,0.1)",
    background: "white",
    borderRadius: "4px",
  },
  "14x21": {
    width: "14cm",
    minHeight: "21cm",
    padding: "1.2cm",
    margin: "2rem auto",
    boxShadow: "0 0 20px rgba(0,0,0,0.1)",
    background: "white",
    borderRadius: "4px",
  },
  default: {
    width: "100%",
    minHeight: "auto",
    padding: "1rem",
    margin: "0",
    boxShadow: "none",
    background: "transparent",
    borderRadius: "0",
  },
};

function generatePageFormatCSS(pageSize: PageSize): string {
  const styles = pageFormatStyles[pageSize];

  return `
    .ProseMirror[data-page-size="${pageSize}"] {
      width: ${styles.width} !important;
      min-height: ${styles.minHeight} !important;
      padding: ${styles.padding} !important;
      margin: ${styles.margin} !important;
      box-shadow: ${styles.boxShadow} !important;
      background: ${styles.background} !important;
      border-radius: ${styles.borderRadius} !important;
      transition: all 0.3s ease !important;
    }
    
    .ProseMirror[data-page-size="${pageSize}"] .ProseMirror-focused {
      outline: none !important;
    }
    
    @media print {
      .ProseMirror[data-page-size="${pageSize}"] {
        box-shadow: none !important;
        margin: 0 !important;
      }
    }
    
    @media (max-width: 768px) {
      .ProseMirror[data-page-size="${pageSize}"] {
        width: calc(100% - 2rem) !important;
        margin: 1rem !important;
        padding: 1rem !important;
      }
    }
  `;
}

function injectCSS(css: string, id: string) {
  // Remove existing style if it exists
  const existingStyle = document.getElementById(id);
  if (existingStyle) {
    existingStyle.remove();
  }

  // Create and inject new style
  const style = document.createElement("style");
  style.id = id;
  style.textContent = css;
  document.head.appendChild(style);
}

export const PageFormat = Extension.create<PageFormatOptions>({
  name: "pageFormat",

  addOptions() {
    return {
      types: ["doc"],
    };
  },

  addStorage() {
    return {
      pageSize: "default" as PageSize,
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: ["doc"],
        attributes: {
          pageSize: {
            default: "default",
            parseHTML: (element) => {
              return element.getAttribute("data-page-size") || "default";
            },
            renderHTML: (attributes) => {
              if (!attributes.pageSize) {
                return {};
              }
              return {
                "data-page-size": attributes.pageSize,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setPageFormat:
        (pageSize: PageSize) =>
        ({ commands, editor, tr: _tr }) => {
          // Store in extension storage
          this.storage.pageSize = pageSize;

          // Update the document attribute
          const result = commands.updateAttributes("doc", { pageSize });

          // Update the editor element's data attribute immediately
          const editorElement = editor.view.dom;
          if (editorElement) {
            editorElement.setAttribute("data-page-size", pageSize);
          }

          // Force update CSS
          const allCSS = Object.keys(pageFormatStyles)
            .map((size) => generatePageFormatCSS(size as PageSize))
            .join("\n");

          injectCSS(allCSS, "page-format-styles");

          return result;
        },
      setPageSize:
        (pageSize: PageSize) =>
        ({ tr, dispatch, editor }) => {
          if (dispatch) {
            this.storage.pageSize = pageSize;

            // Update the document attribute
            const { doc } = tr;
            const attrs = { ...doc.attrs, pageSize };
            tr.setDocAttribute("pageSize", pageSize);

            // Force editor update
            editor.view.updateState(editor.view.state.apply(tr));
          }
          return true;
        },
    };
  },

  onCreate() {
    // Initialize with all page format styles
    const allCSS = Object.keys(pageFormatStyles)
      .map((size) => generatePageFormatCSS(size as PageSize))
      .join("\n");

    injectCSS(allCSS, "page-format-styles");

    // Set initial page size from document attributes
    const { editor } = this;
    const initialPageSize = editor.getAttributes("doc").pageSize || "default";
    this.storage.pageSize = initialPageSize as PageSize;

    // Set initial data attribute
    const editorElement = editor.view.dom;
    if (editorElement) {
      editorElement.setAttribute("data-page-size", initialPageSize);
    }
  },

  onUpdate() {
    // Ensure the data attribute and storage are always in sync
    const { editor } = this;
    const docPageSize =
      editor.getAttributes("doc").pageSize ||
      this.storage.pageSize ||
      "default";
    const editorElement = editor.view.dom;

    // Update storage if document attribute changed
    if (docPageSize !== this.storage.pageSize) {
      this.storage.pageSize = docPageSize as PageSize;
    }

    // Update DOM attribute
    if (editorElement) {
      const currentDataAttr = editorElement.getAttribute("data-page-size");
      if (currentDataAttr !== docPageSize) {
        editorElement.setAttribute("data-page-size", docPageSize);
      }
    }
  },

  onDestroy() {
    // Clean up injected styles
    const style = document.getElementById("page-format-styles");
    if (style) {
      style.remove();
    }
  },
});

export default PageFormat;
