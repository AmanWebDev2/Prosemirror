import { MenuItem } from "prosemirror-menu";
import { toggleMark } from "prosemirror-commands";
import { schema } from "prosemirror-schema-basic";
import { markActive } from "../../../utils/markActive";

export const italicItem = new MenuItem({
  label: "I",
  run(state, dispatch, view) {
    toggleMark(state.schema.marks.em)(state, dispatch);
    return true;
  },
  active(state) {
    return markActive(state, state.schema.marks.em);
  },
  render() {
    const item = document.createElement("div");
    item.innerHTML = `
      <button class="kudoshub-prosemirror-composer-icon-btn" data-test-text-formatter-italic="" type="button">
      <svg class="interface-icon o__standard o__standard__italic" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M5 13L6.95427 6H9.11163L7.15735 13H5Z"></path><path d="M10 3.25C10 3.94036 9.4169 4.5 8.6976 4.5C7.9783 4.5 7.3952 3.94036 7.3952 3.25C7.3952 2.55964 7.9783 2 8.6976 2C9.4169 2 10 2.55964 10 3.25Z"></path></svg>
      </button>
      `;
    item.className = "italic-item";
    return item;
  },
});
