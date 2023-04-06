import { MenuItem } from "prosemirror-menu";
import { findParentNodeOfType } from "prosemirror-utils";
import toggleCodeBlock from "../../../utils/ToggleCodeBlock";
import { CODE_BLOCK } from "../../schema/nodes/Names";

export const codeBlockItem = new MenuItem({
  label: "code-block",
  enable(state) {
    return true;
  },
  _findCodeBlock(state) {
    const codeBlock = state.schema.nodes[CODE_BLOCK];
    const findCodeBlock = codeBlock
      ? findParentNodeOfType(codeBlock)
      : () => {};
    return findCodeBlock(state.selection);
  },

  run(state, dispatch, view) {
    const { schema, selection } = state;
    let { tr } = state;
    tr = tr.setSelection(selection);
    tr = toggleCodeBlock(tr, schema);
    if (tr.docChanged) {
      dispatch && dispatch(tr);
      view.focus();
      return true;
    } else {
      return false;
    }
  },
  active(state) {
    const result = this._findCodeBlock(state);
    return !!(result && result.node);
  },

  render() {
    const item = document.createElement("div");
    item.innerHTML = `
    <button class="kudoshub-prosemirror-composer-icon-btn
    "data-test-text-formatter-code-block="" type="button">
    <svg class="interface-icon o__standard o__standard__code-block" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M3.98083 3.10094C4.31277 2.769 4.31277 2.23081 3.98083 1.89886C3.64888 1.56692 3.11069 1.56692 2.77874 1.89886L0.278744 4.39886C-0.0532013 4.73081 -0.0532013 5.269 0.278744 5.60094L2.77874 8.10094C3.11069 8.43289 3.64888 8.43289 3.98083 8.10094C4.31277 7.769 4.31277 7.23081 3.98083 6.89886L2.08187 4.9999L3.98083 3.10094Z"></path><path d="M7.34704 1.89886C7.01509 1.56692 6.4769 1.56692 6.14496 1.89886C5.81301 2.23081 5.81301 2.769 6.14496 3.10094L8.04392 4.9999L6.14496 6.89886C5.81301 7.23081 5.81301 7.769 6.14496 8.10094C6.4769 8.43289 7.01509 8.43289 7.34704 8.10094L9.84704 5.60094C10.179 5.269 10.179 4.73081 9.84704 4.39886L7.34704 1.89886Z"></path><path d="M0.999832 12V10.0928H2.69983V12C2.69983 12.1657 2.83415 12.3 2.99983 12.3H12.9998C13.1655 12.3 13.2998 12.1657 13.2998 12V4C13.2998 3.83431 13.1655 3.7 12.9998 3.7H10.9998V2H12.9998C14.1044 2 14.9998 2.89543 14.9998 4V12C14.9998 13.1046 14.1044 14 12.9998 14H2.99983C1.89526 14 0.999832 13.1046 0.999832 12Z"></path></svg>
    </button>
      `;
    item.className = "link-item";
    return item;
  },
});
