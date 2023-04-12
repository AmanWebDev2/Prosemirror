import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

export default new Plugin({
  props: {
    decorations(state) {
      const decorations = [];
      const { doc, selection } = state;

      doc.descendants((node, pos) => {
        if (!node.isBlock || !!node.textContent) return;
        if (selection.empty && selection.from === pos + 1) {
          // The selection is inside the node
          if (node.type.name === "paragraph") {
            decorations.push(
              Decoration.node(pos, pos + node.nodeSize, {
                class: "placeholder",
                style: "--placeholder-text: 'New paragraph';"
              })
            );
          }
        } else if (node.type.name !== "paragraph") {
          decorations.push(
            Decoration.node(pos, pos + node.nodeSize, {
              class: "placeholder",
              style: `--placeholder-text: "New ${node.type.name}";`
            })
          );
        }
        return false;
      });

      return DecorationSet.create(doc, decorations);
    }
  }
});
