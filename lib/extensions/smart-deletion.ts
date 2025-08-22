import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { NodeSelection, TextSelection } from '@tiptap/pm/state';

export interface SmartDeletionOptions {
  /**
   * Whether to enable smart backspace behavior
   * @default true
   */
  enableSmartBackspace: boolean;

  /**
   * Whether to enable smart delete behavior
   * @default true
   */
  enableSmartDelete: boolean;

  /**
   * Whether to merge paragraphs intelligently
   * @default true
   */
  enableSmartMerge: boolean;

  /**
   * Whether to handle image deletion specially
   * @default true
   */
  enableImageDeletion: boolean;
}

export const SmartDeletion = Extension.create<SmartDeletionOptions>({
  name: 'smartDeletion',

  addOptions() {
    return {
      enableSmartBackspace: true,
      enableSmartDelete: true,
      enableSmartMerge: true,
      enableImageDeletion: true,
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('smartDeletion'),
        props: {
          handleKeyDown: (view, event) => {
            const { state, dispatch } = view;
            const { selection, schema } = state;
            const { $from, $to, empty } = selection;

            // Backspace
            if (event.key === 'Backspace' && this.options.enableSmartBackspace) {
              // Se há seleção, deletar normalmente
              if (!empty) {
                return false;
              }

              // Se estamos no início de um parágrafo
              if ($from.parentOffset === 0) {
                const node = $from.node();
                const prevNode = $from.nodeBefore;

                // Se o parágrafo atual está vazio
                if (node.type === schema.nodes.paragraph && node.content.size === 0) {
                  // Se há um nó anterior
                  if (prevNode) {
                    // Se o nó anterior é uma imagem
                    if (prevNode.type === schema.nodes.image && this.options.enableImageDeletion) {
                      const tr = state.tr.delete($from.pos - prevNode.nodeSize, $from.pos);
                      dispatch(tr);
                      return true;
                    }
                    
                    // Se o nó anterior é um parágrafo e podemos mesclar
                    if (prevNode.type === schema.nodes.paragraph && this.options.enableSmartMerge) {
                      // Deletar o parágrafo vazio atual
                      const tr = state.tr.delete($from.pos - 1, $from.pos + node.nodeSize);
                      dispatch(tr);
                      return true;
                    }
                  }
                }

                // Se o parágrafo atual não está vazio, mas estamos no início
                if (node.type === schema.nodes.paragraph && node.content.size > 0) {
                  if (prevNode && prevNode.type === schema.nodes.paragraph && this.options.enableSmartMerge) {
                    // Mesclar com o parágrafo anterior
                    const tr = state.tr.join($from.pos - 1);
                    dispatch(tr);
                    return true;
                  }
                }
              }

              // Comportamento especial para deletar caracteres
              const charBefore = $from.nodeBefore;
              if (charBefore && charBefore.isText) {
                const text = charBefore.text || '';
                const lastChar = text[text.length - 1];
                
                // Se o último caractere é um espaço, deletar palavra inteira com Ctrl+Backspace
                if (event.ctrlKey && lastChar === ' ') {
                  let pos = $from.pos - 1;
                  let deleteFrom = pos;
                  
                  // Encontrar o início da palavra
                  while (deleteFrom > 0) {
                    const char = state.doc.textBetween(deleteFrom - 1, deleteFrom);
                    if (char === ' ' || char === '\n') break;
                    deleteFrom--;
                  }
                  
                  if (deleteFrom < pos) {
                    const tr = state.tr.delete(deleteFrom, pos);
                    dispatch(tr);
                    return true;
                  }
                }
              }
            }

            // Delete
            if (event.key === 'Delete' && this.options.enableSmartDelete) {
              // Se há seleção, deletar normalmente
              if (!empty) {
                return false;
              }

              const node = $from.node();
              const nextNode = $from.nodeAfter;

              // Se estamos no final de um parágrafo
              if ($from.parentOffset === node.content.size) {
                // Se há um próximo nó
                if (nextNode) {
                  // Se o próximo nó é uma imagem
                  if (nextNode.type === schema.nodes.image && this.options.enableImageDeletion) {
                    const tr = state.tr.delete($from.pos, $from.pos + nextNode.nodeSize);
                    dispatch(tr);
                    return true;
                  }
                  
                  // Se o próximo nó é um parágrafo vazio
                  if (nextNode.type === schema.nodes.paragraph && nextNode.content.size === 0 && this.options.enableSmartMerge) {
                    const tr = state.tr.delete($from.pos, $from.pos + nextNode.nodeSize + 1);
                    dispatch(tr);
                    return true;
                  }
                  
                  // Se o próximo nó é um parágrafo com conteúdo
                  if (nextNode.type === schema.nodes.paragraph && nextNode.content.size > 0 && this.options.enableSmartMerge) {
                    const tr = state.tr.join($from.pos + 1);
                    dispatch(tr);
                    return true;
                  }
                }
              }

              // Comportamento especial para deletar palavras com Ctrl+Delete
              if (event.ctrlKey && nextNode && nextNode.isText) {
                const text = nextNode.text || '';
                let pos = $from.pos;
                let deleteTo = pos;
                
                // Encontrar o final da palavra
                while (deleteTo < state.doc.content.size) {
                  const char = state.doc.textBetween(deleteTo, deleteTo + 1);
                  if (char === ' ' || char === '\n') {
                    deleteTo++;
                    break;
                  }
                  deleteTo++;
                }
                
                if (deleteTo > pos) {
                  const tr = state.tr.delete(pos, deleteTo);
                  dispatch(tr);
                  return true;
                }
              }
            }

            // Seleção de imagem com Delete/Backspace
            if ((event.key === 'Delete' || event.key === 'Backspace') && this.options.enableImageDeletion) {
              if (selection instanceof NodeSelection && selection.node.type === schema.nodes.image) {
                const tr = state.tr.deleteSelection();
                dispatch(tr);
                return true;
              }
            }

            return false;
          },
        },
      }),
    ];
  },

  addCommands() {
    return {
      deleteCurrentNode:
        () =>
        ({ state, dispatch }) => {
          const { selection } = state;
          
          if (selection instanceof NodeSelection) {
            if (dispatch) {
              const tr = state.tr.deleteSelection();
              dispatch(tr);
            }
            return true;
          }
          
          return false;
        },

      smartBackspace:
        () =>
        ({ state, dispatch, view }) => {
          const { selection } = state;
          const { $from } = selection;
          
          // Simular backspace inteligente
          if ($from.parentOffset === 0) {
            const prevNode = $from.nodeBefore;
            if (prevNode && prevNode.type === state.schema.nodes.image) {
              if (dispatch) {
                const tr = state.tr.delete($from.pos - prevNode.nodeSize, $from.pos);
                dispatch(tr);
              }
              return true;
            }
          }
          
          return false;
        },

      smartDelete:
        () =>
        ({ state, dispatch }) => {
          const { selection } = state;
          const { $from } = selection;
          
          // Simular delete inteligente
          const nextNode = $from.nodeAfter;
          if (nextNode && nextNode.type === state.schema.nodes.image) {
            if (dispatch) {
              const tr = state.tr.delete($from.pos, $from.pos + nextNode.nodeSize);
              dispatch(tr);
            }
            return true;
          }
          
          return false;
        },
    };
  },
});