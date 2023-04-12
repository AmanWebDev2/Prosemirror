import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

export function placeholder(options) {
  return new Plugin({
    props: {
      decorations(state) {
        const decorations = [];
        const { doc, selection } = state;
        if(!options.placeholder) return;
        const placeholder = options.placeholderValue || "";
  
        doc.descendants((node, pos) => {
          if (!node.isBlock || !!node.textContent) return;
          if (state.doc.childCount === 1 && state.doc.firstChild.isTextblock && state.doc.firstChild.content.size === 0 && selection.empty && selection.from === pos + 1) {
            // The selection is inside the node
            if (node.type.name === "paragraph") {
              decorations.push(
                Decoration.node(pos, pos + node.nodeSize, {
                  class: "placeholder",
                  style: `--placeholder-text: '${placeholder}'`
                })
              );
            }
          } else if (node.type.name !== "paragraph") {
            decorations.push(
              Decoration.node(pos, pos + node.nodeSize, {
                class: "placeholder",
                style: `--placeholder-text: "${node.type.name}";`
              })
            );
          }
          return false;
        });
  
        return DecorationSet.create(doc, decorations);
      }
    }
  })
}
