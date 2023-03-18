import { toggleMark } from "prosemirror-commands";
import { MenuItem } from "prosemirror-menu";
import { markActive } from "../../../utils/markActive";

export const codeItem = new MenuItem({
  label: "code",
  enable(state) {
    return true;
  },

  run(state, dispatch, view) {
    toggleMark(state.schema.marks.code)(state, dispatch);
    return true;
  },
  active(state) {
    return markActive(state, state.schema.marks.code);
  },
  render() {
    const item = document.createElement("div");
    item.innerHTML = `
      <button class="kudoshub-prosemirror-composer-icon-btn
      " data-test-text-formatter-italic="" type="button">
      <svg class="interface-icon o__standard o__standard__code" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M8.34356 3.43344C8.46506 2.97999 8.93114 2.7109 9.38459 2.8324C9.83804 2.9539 10.1071 3.41998 9.98563 3.87343L7.65626 12.5668C7.53476 13.0202 7.06867 13.2893 6.61523 13.1678C6.16178 13.0463 5.89269 12.5802 6.01419 12.1268L8.34356 3.43344Z"></path><path d="M4.35094 4.71151C4.68289 5.04345 4.68289 5.58164 4.35094 5.91359L2.45198 7.81255L4.35094 9.71151C4.68289 10.0435 4.68289 10.5816 4.35094 10.9136C4.019 11.2455 3.48081 11.2455 3.14886 10.9136L0.648862 8.41359C0.316916 8.08164 0.316916 7.54345 0.648862 7.21151L3.14886 4.71151C3.48081 4.37956 4.019 4.37956 4.35094 4.71151Z"></path><path d="M11.6489 4.71151C11.3169 5.04345 11.3169 5.58164 11.6489 5.91359L13.5478 7.81255L11.6489 9.71151C11.3169 10.0435 11.3169 10.5816 11.6489 10.9136C11.9808 11.2455 12.519 11.2455 12.8509 10.9136L15.3509 8.41359C15.6829 8.08164 15.6829 7.54345 15.3509 7.21151L12.8509 4.71151C12.519 4.37956 11.9808 4.37956 11.6489 4.71151Z"></path></svg>
    </button>
      `;
    item.className = "italic-item";
    return item;
  },
});
