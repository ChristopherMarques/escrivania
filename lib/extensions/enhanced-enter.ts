import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
// Fragment and Slice imports removed as they are not used

export interface EnhancedEnterOptions {
  /**
   * Whether to create a new paragraph on Enter
   * @default true
   */
  createNewParagraph: boolean;

  /**
   * Whether to allow empty paragraphs
   * @default true
   */
  allowEmptyParagraphs: boolean;

  /**
   * Whether to trim whitespace from empty paragraphs
   * @default true
   */
  trimEmptyParagraphs: boolean;
}

export const EnhancedEnter = Extension.create<EnhancedEnterOptions>({
  name: "enhancedEnter",

  addOptions() {
    return {
      createNewParagraph: true,
      allowEmptyParagraphs: true,
      trimEmptyParagraphs: true,
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("enhancedEnter"),
        props: {
          handleKeyDown: (view, event) => {
            if (event.key !== "Enter") {
              return false;
            }

            const { state, dispatch } = view;
            const { selection, schema } = state;
            const { $from, empty } = selection;

            // Se há seleção, deletar primeiro
            if (!empty) {
              const tr = state.tr.deleteSelection();
              dispatch(tr);
              return true;
            }

            // Shift+Enter para quebra de linha forçada
            if (event.shiftKey) {
              if (schema.nodes.hardBreak) {
                const tr = state.tr.replaceSelectionWith(
                  schema.nodes.hardBreak.create()
                );
                dispatch(tr);
                return true;
              }
              return false;
            }

            // Comportamento padrão do Enter
            const node = $from.node();
            const nodeType = node.type;

            // Se estamos em um parágrafo
            if (nodeType === schema.nodes.paragraph) {
              const isAtEnd = $from.parentOffset === node.content.size;
              const isEmpty = node.content.size === 0;

              // Se o parágrafo está vazio, criar um novo parágrafo
              if (isEmpty && this.options.createNewParagraph) {
                const tr = state.tr.replaceSelectionWith(
                  schema.nodes.paragraph.create()
                );
                dispatch(tr);
                return true;
              }

              // Se estamos no final do parágrafo, criar um novo
              if (isAtEnd && this.options.createNewParagraph) {
                const tr = state.tr.replaceSelectionWith(
                  schema.nodes.paragraph.create()
                );
                dispatch(tr);
                return true;
              }

              // Se estamos no meio ou início, dividir o parágrafo
              if (!isAtEnd) {
                const tr = state.tr.split($from.pos);
                dispatch(tr);
                return true;
              }
            }

            // Para outros tipos de nó, usar comportamento padrão
            return false;
          },
        },
      }),
    ];
  },

  addCommands() {
    return {
      insertParagraph:
        () =>
        ({ commands }) => {
          return commands.insertContent({ type: "paragraph" });
        },

      insertHardBreak:
        () =>
        ({ commands }) => {
          return commands.insertContent({ type: "hardBreak" });
        },

      splitParagraph:
        () =>
        ({ state, dispatch }) => {
          const { selection } = state;
          const { $from } = selection;

          if (dispatch) {
            const tr = state.tr.split($from.pos);
            dispatch(tr);
          }

          return true;
        },
    };
  },
});
