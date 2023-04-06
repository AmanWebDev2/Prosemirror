import { toggleMark } from "prosemirror-commands";
import { MenuItem } from "prosemirror-menu";
import { TextSelection } from "prosemirror-state";

import LinkUrlEditor from "../../../../LinkUrlEditor";
import {
  hideSelectionPlaceholder,
  showSelectionPlaceholder,
} from "../../../plugins/SelectionPlaceholderPlugin";
import applyMark from "../../../utils/applyMark";
import createPopup from "../../../utils/createPopup";
import findNodesWithSameMark from "../../../utils/findNodeWithSameMark";
import { handleMenuPosition } from "../../../utils/handleMenuPosition";
import { markActive } from "../../../utils/markActive";
import { MARK_LINK } from "../../schema/marks/Names";

export const linkItem = new MenuItem({
  label: "link",
  _popUp: null,

  isEnabled(state) {
    if (!(state.selection instanceof TextSelection)) {
      // Could be a NodeSelection or CellSelection.
      return false;
    }

    const markType = state.schema.marks[MARK_LINK];
    if (!markType) {
      return false;
    }
    const { from, to } = state.selection;
    return from < to;
  },
  run(state, dispatch, view) {
    if (this.active(state)) {
      toggleMark(state.schema.marks.link)(state, dispatch);
      view.focus();
      return true;
    } else {
      this.waitForUserInput(state, dispatch, undefined, undefined).then(
        (val) => {
          this.executeWithUserInput(state, dispatch, view, val);
        }
      );
    }
    view.focus();
    return true;
  },
  active(state) {
    return markActive(state, state.schema.marks.link);
  },

  executeWithUserInput(state, dispatch, view, href) {
    if (dispatch) {
      const { selection, schema } = state;
      let { tr } = state;
      let trx = tr;
      trx = view ? hideSelectionPlaceholder(view.state) : tr;
      trx = trx.setSelection(selection);
      if (href !== undefined) {
        const markType = schema.marks[MARK_LINK];
        const attrs = href ? { href } : null;
        trx = applyMark(trx, schema, markType, attrs);
      }
      // Create a new selection that is near the current selection
      const ns = TextSelection.create(trx.doc, selection.to); // create a new selection at the end position
      trx = trx.setSelection(ns); // set the selection in the editor view
      dispatch(trx);
    }
    // view && view.focus();

    return true;
  },
  waitForUserInput(state, dispatch, view, event, _popUp) {
    if (_popUp) {
      return Promise.resolve(undefined);
    }

    if (dispatch) {
      dispatch(showSelectionPlaceholder(state));
    }

    const { doc, schema, selection } = state;
    const markType = schema.marks[MARK_LINK];
    if (!markType) {
      return Promise.resolve(undefined);
    }
    const { from, to } = selection;
    const result = findNodesWithSameMark(doc, from, to, markType);
    const href = result ? result.mark.attrs.href : null;
    const iframe = document.getElementById("kudoshub-editor-frame");
    if (iframe) {
      const iframeDoc = iframe.contentWindow.document;
      if (!iframeDoc) return;
      const smartLinkNode = iframeDoc.querySelector(".pm-selectionmenu");
      const menu = iframeDoc.querySelector(".pm-selectionmenu");
      if (smartLinkNode) {
        handleMenuPosition({
          view: window.view,
          isLinkActive: true,
          menu,
          iframe: true,
        });
      }
    } else {
      const smartLinkNode = document.querySelector(".pm-selectionmenu");
      const menu = document.querySelector(".pm-selectionmenu");
      if (smartLinkNode && menu) {
        handleMenuPosition({
          view: window.view,
          isLinkActive: true,
          menu,
          iframe: false,
        });
      }
    }

    return new Promise((resolve) => {
      this._popUp = createPopup(
        LinkUrlEditor,
        { href },
        {
          modal: true,
          onClose: (val) => {
            if (this._popUp) {
              this._popUp = null;
              resolve(val);
            }
          },
          isIframe: iframe ? true : false,
        }
      );
    });
  },
  render() {
    const item = document.createElement("div");
    item.innerHTML = `
      <button class="kudoshub-prosemirror-composer-icon-btn
      " data-test-text-formatter-italic="" type="button">
      <svg class="interface-icon o__standard o__standard__link" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.36014 4.01432C10.0436 3.3309 11.1516 3.3309 11.835 4.01432L12.0796 4.25896C12.8412 5.02048 12.8412 6.25515 12.0796 7.01667L10.3276 8.76868C9.64422 9.4521 8.53618 9.4521 7.85276 8.76868L7.65973 8.57565C7.32779 8.24371 6.7896 8.24371 6.45765 8.57565C6.12571 8.9076 6.1257 9.44579 6.45765 9.77774L6.65068 9.97076C7.99799 11.3181 10.1824 11.3181 11.5297 9.97076L13.2817 8.21875C14.7071 6.79334 14.7071 4.48229 13.2817 3.05687L13.0371 2.81224C11.6898 1.46493 9.50536 1.46493 8.15806 2.81224L8.1237 2.8466C7.79175 3.17854 7.79175 3.71674 8.1237 4.04868C8.45564 4.38063 8.99383 4.38063 9.32578 4.04868L9.36014 4.01432ZM6.64006 11.9854C5.95665 12.6688 4.84861 12.6688 4.16519 11.9854L3.92055 11.7407C3.15903 10.9792 3.15903 9.74455 3.92056 8.98303L5.67257 7.23102C6.35599 6.5476 7.46402 6.5476 8.14744 7.23102L8.34047 7.42405C8.67241 7.75599 9.2106 7.75599 9.54255 7.42405C9.8745 7.0921 9.8745 6.55391 9.54255 6.22197L9.34952 6.02894C8.00221 4.68163 5.81779 4.68163 4.47049 6.02894L2.71848 7.78095C1.29306 9.20636 1.29306 11.5174 2.71847 12.9428L2.96311 13.1875C4.31042 14.5348 6.49484 14.5348 7.84214 13.1875L7.8765 13.1531C8.20845 12.8212 8.20845 12.283 7.8765 11.951C7.54456 11.6191 7.00637 11.6191 6.67442 11.951L6.64006 11.9854Z"></path></svg>
    </button>
      `;
    item.className = "link-item";
    return item;
  },
});
