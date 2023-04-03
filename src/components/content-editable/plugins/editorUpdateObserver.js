import { Plugin, TextSelection, PluginKey } from "prosemirror-state";

import { tooltipMenuItems } from "../custom/menu/menuItems";
import { selectionMenu } from "./selectionMenu";
import { MARK_LINK } from "../custom/schema/marks/Names";
import LinkUrlEditor from "../../LinkUrlEditor";
import {
  hideSelectionPlaceholder,
  showSelectionPlaceholder,
} from "./SelectionPlaceholderPlugin";

import findNodesWithSameMark from "../utils/findNodeWithSameMark";
import createPopup from "../utils/createPopup";
import { atAnchorTopCenter } from "../utils/PopupPosition";
import applyMark from "../utils/applyMark";
import lookUpElement from "../utils/lookUpElement";
import { markActive } from "../utils/markActive";
import { isIframe } from "../utils/isFrame";

export function editorUpdateObserver(options) {
  return new Plugin({
    name: "editorUpdateObserver",
    view(editorView) {
      return new EditorUpdateObserver(editorView, options);
    },
    props: {
      handleDOMEvents: {
        focus(view, event) {
          //
        },
      },
    },
    // state:{
    //   init(_, state) {
    //     return  selectionMenu({ content: [tooltipMenuItems] })
    //   },
    //   apply(tr, pluginState) {
    //     console.log(tr,tr.getMeta("focus$"));
    //     return selectionMenu({ content: [tooltipMenuItems] })
    //   },
    // }
  });
}

class EditorUpdateObserver {
  constructor(editorView, options) {
    this.editorView = editorView;
    this.options = options;
  }

  updatePluginState(state, dispatch) {
    // const pluginState = myPluginKey.getState(state);
    // const newPluginState = /* modify the plugin state */;
    // if (dispatch) {
    //   dispatch(state.tr.setMeta(myPluginKey, newPluginState));
    // } else {
    //   return newPluginState;
    // }
  }

  update(view, lastState) {
    const { state, readOnly } = view;
    // when selection is made show menu items
    if (
      !markActive(state, state.schema.marks.link) ||
      !state ||
      readOnly ||
      state.selection.from !== state.selection.to
    ) {
      // update plugin
      // console.log(state)

      const myPlugin = state.plugins.filter((plugin) => {
        if (plugin?.spec?.name === "myPlugin") {
          return false;
        } else {
          return true;
        }
      });

      // const sm = selectionMenu({ content: [tooltipMenuItems] });
      // sm.setParent(state.plugins);

      const newState = state.reconfigure({
        plugins: [...myPlugin, selectionMenu({ content: [tooltipMenuItems], iframe:isIframe,elementClassNameToHandlingMenuPositionOnScroll:'scroll' })],
      });

      // console.log(view);
      // ! causes focus issue
      // let newtr = state.tr.scrollIntoView();
      // requestAnimationFrame(() => {
      //   view.dom.scrollIntoView();
      // });
      // view.scrollToSelection();
      // state.setPlugin(newState.plugins);
      console.log(view)
      view.updateState(newState);
    } else {
      // when only cursor is put over link then show link tooltip
      if (!state || readOnly || state.selection.from == state.selection.to) {
        // plugin add
        if (view.readOnly) {
          this.destroy();
          return;
        }

        const { state, readOnly } = view;

        const { doc, selection, schema } = state;
        const markType = schema.marks[MARK_LINK];
        if (!markType) {
          return;
        }
        const { from, to } = selection;
        const result = findNodesWithSameMark(doc, from, to, markType);

        if (!result) {
          this.destroy();
          return;
        }
        const domFound = view.domAtPos(from);
        if (!domFound) {
          this.destroy();
          return;
        }
        const anchorEl = lookUpElement(
          domFound.node,
          (el) => el.nodeName === "A"
        );
        if (!anchorEl) {
          this.destroy();
          return;
        }

        const popup = this._popup;

        const viewPops = {
          editorState: state,
          editorView: view,
          href: result.mark.attrs.href,
          onCancel: this._onCancel,
          onEdit: this._onEdit,
          onRemove: this._onRemove,
        };

        if (popup && anchorEl === this._anchorEl) {
          popup.update(viewPops);
        } else {
          popup && popup.close();
          this._anchorEl = anchorEl;
          this._popup = createPopup(LinkUrlEditor, viewPops, {
            anchor: anchorEl,
            autoDismiss: false,
            onClose: this._onClose,
            position: atAnchorTopCenter,
          });
        }
      }
    }
  }

  _onCancel = (view) => {
    this.destroy();
    view.focus();
  };

  _onClose = (url) => {
    const { selection, schema } = this.editorView.state;
    if (this.editorView.dispatch) {
      let { tr } = this.editorView.state;
      const { to, from } = selection;
      const markType = schema.marks[MARK_LINK];
      const result = findNodesWithSameMark(tr.doc, from, to, markType);
      tr = this.editorView
        ? hideSelectionPlaceholder(this.editorView.state)
        : tr;
      // create a new selection at the given start and end positions
      const newSelection = TextSelection.create(
        this.editorView.state.doc,
        result.from.pos,
        result.to.pos + 1
      );
      tr = tr.setSelection(newSelection);

      if (url !== undefined) {
        const markType = schema.marks[MARK_LINK];
        const attrs = url ? { href: url } : null;
        tr = applyMark(tr, schema, markType, attrs);
      }
      this.editorView.dispatch(tr);
    }

    const myPlugin = this.editorView.state.plugins.filter((plugin) => {
      if (plugin?.spec?.name === "myPlugin") {
        return false;
      } else {
        return true;
      }
    });
    const newState = this.editorView.state.reconfigure({
      plugins: [...myPlugin],
    });
    this.editorView.updateState(newState);

    // this.editorView && this.editorView.focus();
    this._anchorEl = null;
    this._editor = null;
    this._popup = null;
  };

  _onEdit = (view) => {
    if (this._editor) {
      return;
    }

    const { state } = view;
    const { schema, doc, selection } = state;
    const { from, to } = selection;
    const markType = schema.marks[MARK_LINK];
    const result = findNodesWithSameMark(doc, from, to, markType);
    if (!result) {
      return;
    }
    let { tr } = state;
    const linkSelection = TextSelection.create(
      tr.doc,
      result.from.pos,
      result.to.pos + 1
    );

    tr = tr.setSelection(linkSelection);
    tr = showSelectionPlaceholder(state, tr);
    view.dispatch(tr);

    const href = result ? result.mark.attrs.href : null;
    this._editor = createPopup(
      LinkUrlEditor,
      { href },
      {
        onClose: (value) => {
          this._editor = null;
          this._onEditEnd(view, selection, value);
        },
      }
    );
  };

  _onRemove = (view) => {
    this._onEditEnd(view, view.state.selection, null);
  };

  _onEditEnd = (view, initialSelection, href) => {
    const { state, dispatch } = view;
    let tr = hideSelectionPlaceholder(state);

    if (href !== undefined) {
      const { schema } = state;
      const markType = schema.marks[MARK_LINK];
      if (markType) {
        const result = findNodesWithSameMark(
          tr.doc,
          initialSelection.from,
          initialSelection.to,
          markType
        );
        if (result) {
          const linkSelection = TextSelection.create(
            tr.doc,
            result.from.pos,
            result.to.pos + 1
          );
          tr = tr.setSelection(linkSelection);
          const attrs = href ? { href } : null;
          tr = applyMark(tr, schema, markType, attrs);
        }
      }
    }
    tr = tr.setSelection(initialSelection);
    dispatch(tr);
    view.focus();
  };

  destroy() {
    // console.log("destroy called");
  }
}
