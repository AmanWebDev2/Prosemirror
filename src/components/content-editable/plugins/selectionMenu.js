import { Plugin } from "prosemirror-state";

import { renderGrouped } from "prosemirror-menu";
import { markActive } from "../utils/markActive";
import { ATTRIBUTE_SPAN } from "../custom/schema/nodes/Names";

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
  showRuleSetItem = false;
  isEditorFocused = true;
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

    // dropdown toggle
    const ruleSetPosBlockElm =
      editorView.dom.parentNode.querySelector(".rulset-position");

    // dropown menu
    // const attributeSelector = editorView.dom.parentNode.querySelector(
    //   ".attribute-selector"
    // );

    if (ruleSetPosBlockElm) {
      this.ruleSetPosBlockElm = ruleSetPosBlockElm;
      const rulsetElm = this.ruleSetPosBlockElm.firstElementChild;
      this.rulsetElm = rulsetElm;
    }

    // if (attributeSelector) {
    //   this.attributeSelector = attributeSelector;
    //   this.attributeSelector.style.display = "none";
    // }

    // if selection then attribute selector remove

    this.update(editorView, null);
  }

  update(view, lastState) {
    const { state, readOnly } = view;
    const { from, to } = state.selection;
    const start = view.coordsAtPos(from);
    const end = view.coordsAtPos(to);
    const tooltipNode = this.menu.querySelector("div.czi-link-tooltip");
    let isLinkToolTip = tooltipNode ? true : false;

    // update plugin, have to show popover when attribute span is selected
    if(state.selection?.node?.type?.name === ATTRIBUTE_SPAN) {
      console.log("fallback popover")
    }

    if ((!state || readOnly || state.selection.empty || state.selection?.node?.type?.name === ATTRIBUTE_SPAN) && !isLinkToolTip) {
      if (this.menu.style.display !== "none") {
        this.menu.style.display = "none";
      }
      this.handleRulset({ start, view })
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

    try {
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
    } catch (err) { }
  }

  handleRulset({ start, view }) {
    if (this.ruleSetPosBlockElm) {
      let topPos = +this.ruleSetPosBlockElm.style.top.replace("px", "");
      if (Math.ceil(topPos) !== Math.ceil(start.top))
      // console.log(view.dom.scrollTop,start.top);
      // const scrollTop = view.dom.scrollTop;
        this.ruleSetPosBlockElm.style.top = start.top + "px";
      this.rulsetElm.style.display = "block";
    }
    if (this.attributeSelector) {
      this.attributeSelector.style.display = "none";
    }
  }
  handleAttributeSelectionPosition() {
    const { state } = this.editorView;
    const { from } = state.selection;
    const start = this.editorView.coordsAtPos(from);
    if (this.attributeSelector) {
      const attributeSelectorRect =
        this.attributeSelector.getBoundingClientRect();
      if (start.top > attributeSelectorRect.height / 2) {
        // console.log("change pos");
        this.attributeSelector.style.position = "absolute";
        this.attributeSelector.style.top = `-${
          attributeSelectorRect.height / 2
        }px`;
      } else {
        // condition for rulse
        // console.log("top pos");
        this.attributeSelector.style.position = "unset";
        if (this.attributeSelector.style.display !== "none") {
          this.ruleSetPosBlockElm.style.top = `0px`;
        }
      }
    }
  }

  destroy() {
    if (this.menu) {
      this.menu.remove();
    }
  }
}
