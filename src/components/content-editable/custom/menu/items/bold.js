import { MenuItem } from "prosemirror-menu";
import { toggleMark } from "prosemirror-commands";
import { markActive } from "../../../utils/markActive";

export const boldItem = new MenuItem({
  label: "B",
  run(state, dispatch, view) {
    toggleMark(state.schema.marks.strong)(state, dispatch);
    return true;
  },
  active(state) {
    return markActive(state, state.schema.marks.strong);
  },
  render() {
    const item = document.createElement("div");
    item.innerHTML = `
      <button class="kudoshub-prosemirror-composer-icon-btn
      " data-test-text-formatter-bold="" type="button">
      <svg class="interface-icon o__standard o__standard__bold" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M4 13H8.62029C10.6924 13 12 11.8773 12 10.1379V10.124C12 8.81428 10.9606 7.82328 9.63956 7.75398V7.70547C10.7393 7.55994 11.5775 6.65904 11.5775 5.52945V5.51559C11.5775 3.95634 10.4174 3 8.49958 3H4V13ZM7.84912 4.79487C8.68064 4.79487 9.17687 5.21067 9.17687 5.90367V5.91753C9.17687 6.66597 8.65381 7.10949 7.66806 7.10949H6.46102V4.79487H7.84912ZM7.84912 8.71033C8.92875 8.71033 9.49874 9.14692 9.49874 9.94387V9.95773C9.49874 10.7685 8.92875 11.2051 7.92288 11.2051H6.46102V8.71033H7.84912Z"></path></svg>
      </button>
      `;
    item.className = "bold-item";
    return item;
  },
});
