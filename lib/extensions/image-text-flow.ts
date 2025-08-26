import type { Command } from "@tiptap/core";
import { Extension } from "@tiptap/core";
import {
  NodeSelection,
  Plugin,
  PluginKey,
  TextSelection,
} from "@tiptap/pm/state";

export interface ImageTextFlowOptions {
  /**
   * Whether to automatically add paragraphs around images
   * @default true
   */
  autoAddParagraphs: boolean;

  /**
   * Whether to allow navigation around images with arrow keys
   * @default true
   */
  enableArrowNavigation: boolean;

  /**
   * Whether to insert paragraph when pressing Enter near images
   * @default true
   */
  enableEnterNavigation: boolean;
}

export const ImageTextFlow = Extension.create<ImageTextFlowOptions>({
  name: "imageTextFlow",

  addOptions() {
    return {
      autoAddParagraphs: true,
      enableArrowNavigation: true,
      enableEnterNavigation: true,
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("imageTextFlow"),
        props: {
          handleKeyDown: (view, event) => {
            const { state, dispatch } = view;
            const { selection, schema } = state;
            const { $from } = selection;

            // Verificar se estamos próximos a uma imagem
            const isNearImage = () => {
              const node = $from.node();
              const prevNode = $from.nodeBefore;
              const nextNode = $from.nodeAfter;

              return (
                (prevNode && prevNode.type === schema.nodes.image) ||
                (nextNode && nextNode.type === schema.nodes.image) ||
                (node && node.type === schema.nodes.image)
              );
            };

            // Navegação com setas ao redor de imagens
            if (
              this.options.enableArrowNavigation &&
              (event.key === "ArrowUp" || event.key === "ArrowDown")
            ) {
              if (
                selection instanceof NodeSelection &&
                selection.node.type === schema.nodes.image
              ) {
                const pos = selection.from;
                let newPos;

                if (event.key === "ArrowUp") {
                  // Mover para antes da imagem
                  newPos = pos;
                  // Verificar se há parágrafo antes
                  const $pos = state.doc.resolve(pos);
                  if (
                    $pos.nodeBefore &&
                    $pos.nodeBefore.type === schema.nodes.paragraph
                  ) {
                    newPos = pos - $pos.nodeBefore.nodeSize;
                  } else {
                    // Criar parágrafo antes da imagem
                    const tr = state.tr.insert(
                      pos,
                      schema.nodes.paragraph.create()
                    );
                    dispatch(tr);
                    return true;
                  }
                } else {
                  // Mover para depois da imagem
                  newPos = pos + selection.node.nodeSize;
                  // Verificar se há parágrafo depois
                  const $pos = state.doc.resolve(newPos);
                  if (
                    $pos.nodeAfter &&
                    $pos.nodeAfter.type === schema.nodes.paragraph
                  ) {
                    newPos = newPos + 1;
                  } else {
                    // Criar parágrafo depois da imagem
                    const tr = state.tr.insert(
                      newPos,
                      schema.nodes.paragraph.create()
                    );
                    dispatch(tr);
                    return true;
                  }
                }

                const newSelection = state.tr.setSelection(
                  TextSelection.near(state.doc.resolve(newPos))
                );
                dispatch(newSelection);
                return true;
              }
            }

            // Enter para criar parágrafos ao redor de imagens
            if (
              this.options.enableEnterNavigation &&
              event.key === "Enter" &&
              !event.shiftKey
            ) {
              if (
                selection instanceof NodeSelection &&
                selection.node.type === schema.nodes.image
              ) {
                const pos = selection.from;
                const newParagraph = schema.nodes.paragraph.create();

                // Inserir parágrafo depois da imagem
                const tr = state.tr.insert(
                  pos + selection.node.nodeSize,
                  newParagraph
                );
                const newPos = pos + selection.node.nodeSize + 1;
                tr.setSelection(TextSelection.near(tr.doc.resolve(newPos)));
                dispatch(tr);
                return true;
              }

              // Se estamos em um parágrafo vazio próximo a uma imagem
              if (isNearImage() && $from.parent.content.size === 0) {
                // Permitir comportamento padrão
                return false;
              }
            }

            return false;
          },
        },

        // Plugin para garantir parágrafos ao redor de imagens - DESABILITADO para evitar inserção automática
        // appendTransaction: (transactions, oldState, newState) => {
        //   if (!this.options.autoAddParagraphs) return null;

        //   let tr = null;
        //   let modified = false;

        //   newState.doc.descendants((node, pos) => {
        //     if (node.type === newState.schema.nodes.image) {
        //       const $pos = newState.doc.resolve(pos);

        //       // Verificar se há parágrafo antes da imagem
        //       if (pos === 0 || !$pos.nodeBefore || $pos.nodeBefore.type !== newState.schema.nodes.paragraph) {
        //         if (!tr) tr = newState.tr;
        //         tr.insert(pos, newState.schema.nodes.paragraph.create());
        //         modified = true;
        //       }

        //       // Verificar se há parágrafo depois da imagem
        //       const afterPos = pos + node.nodeSize;
        //       const $afterPos = newState.doc.resolve(afterPos);
        //       if (afterPos === newState.doc.content.size || !$afterPos.nodeAfter || $afterPos.nodeAfter.type !== newState.schema.nodes.paragraph) {
        //         if (!tr) tr = newState.tr;
        //         tr.insert(afterPos, newState.schema.nodes.paragraph.create());
        //         modified = true;
        //       }
        //     }
        //   });

        //   return modified ? tr : null;
        // },
      }),
    ];
  },

  addCommands() {
    return {
      insertParagraphBeforeImage:
        (): Command =>
        ({ state, dispatch }) => {
          const { selection } = state;

          if (
            selection instanceof NodeSelection &&
            selection.node.type === state.schema.nodes.image
          ) {
            const pos = selection.from;
            const tr = state.tr.insert(
              pos,
              state.schema.nodes.paragraph.create()
            );
            if (dispatch) dispatch(tr);
            return true;
          }

          return false;
        },

      insertParagraphAfterImage:
        (): Command =>
        ({ state, dispatch }) => {
          const { selection } = state;

          if (
            selection instanceof NodeSelection &&
            selection.node.type === state.schema.nodes.image
          ) {
            const pos = selection.from + selection.node.nodeSize;
            const tr = state.tr.insert(
              pos,
              state.schema.nodes.paragraph.create()
            );
            if (dispatch) dispatch(tr);
            return true;
          }

          return false;
        },
    };
  },
});
