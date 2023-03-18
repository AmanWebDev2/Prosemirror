import { MenuItem } from "prosemirror-menu";
import { AllSelection, TextSelection } from "prosemirror-state";
import { toggleAlignment } from "../../../utils/ToggleAlignment";

export const alignCenterItem = new MenuItem({
  label: "align center",
  enable(state) {
    return true;
  },

  run(state, dispatch, view) {
    const { schema, selection } = state;
    const tr = toggleAlignment(
      state.tr.setSelection(selection),
      schema,
      "center"
    );

    if (tr.docChanged) {
      dispatch && dispatch(tr);
      return true;
    } else {
      return false;
    }
  },
  active(state) {
    const { selection, doc } = state;
    const { from, to } = selection;
    let keepLooking = true;
    let active = false;
    doc.nodesBetween(from, to, (node, pos) => {
      if (keepLooking && node.attrs.align === "center") {
        keepLooking = false;
        active = true;
      }
      return keepLooking;
    });
    return active;
    // return markActive(state,markType.heading);
  },
  isEnabled(state) {
    const { selection } = state;
    return (
      selection instanceof TextSelection || selection instanceof AllSelection
    );
  },

  render() {
    const item = document.createElement("div");
    item.innerHTML = `
      <button class="kudoshub-prosemirror-composer-icon-btn
      " data-test-text-formatter-header="" type="button">
      <svg class="interface-icon o__standard o__standard__center" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.15 3.85c0-.47.38-.85.85-.85h12a.85.85 0 0 1 0 1.7H2a.85.85 0 0 1-.85-.85zM4.15 8c0-.47.38-.85.85-.85h6a.85.85 0 0 1 0 1.7H5A.85.85 0 0 1 4.15 8zM2.65 12.15c0-.47.38-.85.85-.85h9a.85.85 0 0 1 0 1.7h-9a.85.85 0 0 1-.85-.85z"></path></svg>
    </button>
      `;
    item.className = "align_center_item";
    return item;
  },
});
