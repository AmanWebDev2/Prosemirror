import { Plugin, TextSelection } from "prosemirror-state";

import { renderGrouped } from "prosemirror-menu";
import {
  ATTRIBUTE_SPAN,
  EMBED_VIDEO,
  IMAGE,
  VIDEO_CLIP,
} from "../custom/schema/nodes/Names";
import ImagePopover from "../popover/ImagePopover";

import { handleMenuPosition } from "../utils/handleMenuPosition";
import { toggleInserter } from "./editorDOMEvents";
import createPopup from "../utils/createPopup";
import { hideSelectionPlaceholder } from "./SelectionPlaceholderPlugin";
import EmbedVideoPopover from "../popover/EmbedVideoPopover";
import AttributePopover from "../popover/AttributePopover";

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

    if(this.isIframe) {
      const iframe = document.getElementById("kudoshub-editor-frame");
      if(!iframe) return; 
    const iframeDoc = iframe.contentWindow
          ? iframe.contentWindow.document
          : null;
    if (!iframeDoc) return;
    this.iframeDoc = iframeDoc;
    }

    // update editorView everyTime
    // update menu positioning on scroll
    if (this.options.elementClassNameToHandlingMenuPositionOnScroll) {
      this.menuPosition({
        className: this.options.elementClassNameToHandlingMenuPositionOnScroll,
        view: editorView,
        iframe: this.isIframe,
        menu: this.menu
      });
    }
    this.isIframe
      ? this.iframeDoc.getElementById("editor").parentNode.appendChild(this.menu)
      : document.body.appendChild(this.menu);

      let ruleSetPosBlockElm;
      if(this.isIframe) {
        ruleSetPosBlockElm = this.iframeDoc.querySelector(".rulset-position");
      }else {
        // dropdown toggle
        ruleSetPosBlockElm = document.querySelector(".rulset-position");
      }
      if (ruleSetPosBlockElm) {
        this.ruleSetPosBlockElm = ruleSetPosBlockElm;
        const rulsetElm = this.ruleSetPosBlockElm.firstElementChild;
        this.rulsetElm = rulsetElm;
      }
    this.update(editorView, null);
  }

  waitForUserInput({view,from,to,component,attribute}){
    const node = view.state.doc.nodeAt(from);
    const value = node ? node.attrs[attribute] : null;
    return new Promise((resolve) => {
      this._popUp = createPopup(
        component,
        { value },
        {
          modal: true,
          onClose: (val) => {
            if(val) {
              resolve(val);
            }
          },
          isIframe: this.isIframe
        },
      );
    });
  }

  executeWithUserInput({state, dispatch, view, from,value,attribute}) {
    if (dispatch) {
      const { selection, schema } = state;
      let { tr } = state;
      let trx = tr;
      trx = view ? hideSelectionPlaceholder(view.state) : tr;
      trx = trx.setSelection(selection);
      if (value !== undefined) {
        const attributes = { [attribute] : value };
        const node = state.doc.nodeAt(from);
        trx = state.tr.setNodeMarkup(from, null, { ...node.attrs, ...attributes });
        // trx = applyMark(trx, schema, markType, attrs);
      }
      // Create a new selection that is near the current selection
      const ns = TextSelection.create(trx.doc, selection.to); // create a new selection at the end position
      trx = trx.setSelection(ns); // set the selection in the editor view
      dispatch(trx);
    }
    view && view.focus();
    
    return true;
  }

  update(view, lastState) {
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
        this.waitForUserInput({view,from,to,component:AttributePopover,attribute:'data-template-fallback'}).then(value=>{
          this.executeWithUserInput({state,dispatch:view.dispatch,view,from,value,attribute:'data-template-fallback'});
        })
        break;
      case IMAGE:
        this.waitForUserInput({view,from,to,component:ImagePopover,attribute:'data-link-url'}).then(value=>{
          this.executeWithUserInput({state,dispatch:view.dispatch,view,from,value,attribute:'data-link-url'});
        })
        break;
      case EMBED_VIDEO:
        this.waitForUserInput({view,from,to,component:EmbedVideoPopover,attribute:'src'}).then(value=>{
          this.executeWithUserInput({state,dispatch:view.dispatch,view,from,value,attribute:'src'});
        })
        break;
      default:
    }

    // hide selection menut
    if (
      (!state ||
        readOnly ||
        state.selection.empty ||
        selectedNodeName === VIDEO_CLIP) &&
      !isLinkToolTip
    ) {
      if (this.menu.style.display !== "none") {
        this.menu.style.display = "none";
      }
      this.handleRulset({ start, view, iframe:this.isIframe });
      return;
    }

    // show selection menu
    this.menu.style.display = "inline-table";
    toggleInserter(view,false,this.isIframe);
    if (!this.menu.offsetParent) {
      if (this.menu.style.display !== "none") {
        this.menu.style.display = "none";
      }
      return;
    }
    // Update the Content state before calculating the position
    this.contentUpdate(this.editorView.state);
    handleMenuPosition({ view, iframe:this.options.iframe, menu:this.menu});

  }

  handleRulset({ start, view,iframe }) {
    if (this.ruleSetPosBlockElm) {
      if (iframe) {
      let editorRectTop = this.editorRect.top ? this.editorRect.top : 0;
        this.ruleSetPosBlockElm.style.top = (Math.abs(editorRectTop - start.top)) + "px";
        this.ruleSetPosBlockElm.style.left =  (this.editorRect.right - 15) + "px";
      }else {
        this.ruleSetPosBlockElm.style.transform = `translate(${
          this.editorRect.right - 15 + window.scrollX
        }px, ${Math.abs(this.editorView.dom.scrollTop - start.top)}px)`;
      }
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

  menuPosition({className,view,iframe,menu}) {
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
          element.onscroll = () => handleMenuPosition({view,iframe,menu})            
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
