import { Plugin } from "prosemirror-state";

import { renderGrouped } from "prosemirror-menu";
import { markActive } from "../utils/markActive";
import {
  ATTRIBUTE_SPAN,
  IMAGE,
  VIDEO_CLIP,
} from "../custom/schema/nodes/Names";
import { handleMenuPosition } from "../utils/handleMenuPosition";

export function selectionMenu(options) {
  return new Plugin({
    name: "myPlugin",
    view(editorView) {
      return new SelectionMenu(editorView, options);
    },
  });
}

class SelectionMenu {

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
    this.isIframe = this.options.iframe;

    this.editorRect = this.editorView.dom?.parentNode ? this.editorView.dom.parentNode.getBoundingClientRect(): null;

    // update editorView everyTime
    // update menu positioning on scroll
    if (this.options.elementClassNameToHandlingMenuPositionOnScroll) {
      this.menuPosition({
        className: this.options.elementClassNameToHandlingMenuPositionOnScroll,
        view: editorView,
        iframe: this.isIframe,
      });
    }

    this.isIframe
      ? editorView.dom.parentNode.appendChild(this.menu)
      : document.body.appendChild(this.menu);

    // dropdown toggle
    const ruleSetPosBlockElm =
      editorView.dom.parentNode.querySelector(".rulset-position");

    if (ruleSetPosBlockElm) {
      this.ruleSetPosBlockElm = ruleSetPosBlockElm;
      const rulsetElm = this.ruleSetPosBlockElm.firstElementChild;
      this.rulsetElm = rulsetElm;
    }
    this.update(editorView, null,this.isIframe);
  }

  update(view, lastState,isIframe) {
    const { state, readOnly } = view;
    const { from, to } = state.selection;
    const start = view.coordsAtPos(from);
    const end = view.coordsAtPos(to);
    const tooltipNode = this.menu.querySelector("div.czi-link-tooltip");
    let isLinkToolTip = tooltipNode ? true : false;

    const selectedNodeName = state.selection?.node?.type?.name;
    // update plugin, have to show popover when attribute span is selected
    if (state.selection?.node?.type?.name === ATTRIBUTE_SPAN) {
      console.log("fallback popover");
    }

    if (state?.selection?.node?.type?.name === IMAGE) {
    }

    // popoover
    switch (selectedNodeName) {
      case ATTRIBUTE_SPAN:
        break;
      case IMAGE:
        break;
      case VIDEO_CLIP:
        break;
      default:
    }

    // hide selection menut
    if (
      (!state ||
        readOnly ||
        state.selection.empty ||
        selectedNodeName === ATTRIBUTE_SPAN ||
        selectedNodeName == IMAGE ||
        selectedNodeName == VIDEO_CLIP) &&
      !isLinkToolTip
    ) {
      if (this.menu.style.display !== "none") {
        this.menu.style.display = "none";
      }
      this.handleRulset({ start, view });
      return;
    }

    // show selection menu
    this.menu.style.display = "block";
    if (!this.menu.offsetParent) {
      if (this.menu.style.display !== "none") {
        this.menu.style.display = "none";
      }
      return;
    }
    // Update the Content state before calculating the position
    this.contentUpdate(this.editorView.state);

    handleMenuPosition({ view, iframe:isIframe});

  }

  handleRulset({ start, view }) {
    if (this.ruleSetPosBlockElm) {
      let editorRectTop = this.editorRect.top ? this.editorRect.top : 0;
      this.ruleSetPosBlockElm.style.top = (Math.abs(editorRectTop - start.top)) + "px";
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

  menuPosition({className,view,iframe}) {
    if(className) {
      let elements;
      if(iframe){
        const iframe = document.getElementById("kudoshub-editor-frame");
        if(!iframe) return;
        const iframeDoc = iframe.contentWindow.document;
        if(!iframeDoc) return;
        elements = iframeDoc.getElementsByClassName(className);
      }else {
        elements = document.getElementsByClassName(className);
      }
      if(elements && elements.length > 0) {
        Array.from(elements).forEach(element => {
          element.onscroll = () => handleMenuPosition({view,iframe})            
        });
      }
    }

  }


  destroy() {
    if (this.menu) {
      this.menu.remove();
    }
  }
}
