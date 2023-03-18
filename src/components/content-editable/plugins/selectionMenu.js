import { Plugin } from "prosemirror-state";

import { renderGrouped } from "prosemirror-menu";
import { markActive } from "../utils/markActive";

export function selectionMenu(options) {
  return new Plugin({
    name: "myPlugin",
    view(editorView) {
      return new SelectionMenu(editorView, options);
    },
  });
}

class SelectionMenu {
  updatePlugin() {}

  constructor(editorView, options) {
    this.editorView = editorView;
    this.options = options;

    this.menu = document.createElement("div");
    this.menu.style.display = "none";
    this.menu.style.position = "absolute";
    this.menu.className = "pm-selectionmenu";

    let { dom, update } = renderGrouped(this.editorView, this.options.content);

    this.contentUpdate = update;
    this.menu.appendChild(dom);

    editorView.dom.parentNode.appendChild(this.menu);

    this.update(editorView, null);
  }

  update(view, lastState) {
    const { state, readOnly } = view;
    // console.log(this.options.content)
    // console.log(lastState)
    const tooltipNode = this.menu.querySelector("div.czi-link-tooltip");
    let isLinkToolTip = tooltipNode ? true : false;
    if ((!state || readOnly || state.selection.empty) && !isLinkToolTip) {
      if (this.menu.style.display !== "none") {
        this.menu.style.display = "none";
      }
      return;
    }

    this.menu.style.display = "block";

    if (!this.menu.offsetParent) {
      if (this.menu.style.display !== "none") {
        this.menu.style.display = "none";
      }
      return;
    }
    // Update the Content state before calculating the position
    this.contentUpdate(this.editorView.state);

    const { from, to } = state.selection;

    try {
      const start = view.coordsAtPos(from);
      const end = view.coordsAtPos(to);
      let box = this.menu.getBoundingClientRect();

      let offsetParentBox = this.menu.offsetParent.getBoundingClientRect();
      let left =
        (start.left + end.left) / 2 - box.width / 2 - offsetParentBox.left;

      if (left < 5) {
        left = 5;
      }

      this.menu.style.left = left + "px";

      if (
        markActive(state, state.schema.marks.link) &&
        !(!state || readOnly || state.selection.from !== state.selection.to)
      ) {
        this.menu.style.top = start.bottom + "px";
      } else {
        this.menu.style.top =
          start.top - offsetParentBox.top - box.height + "px";
      }
    } catch (err) {}
  }

  destroy() {
    if (this.menu) {
      this.menu.remove();
    }
  }
}
