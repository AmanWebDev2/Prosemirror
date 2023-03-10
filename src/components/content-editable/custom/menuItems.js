import { toggleMark } from "prosemirror-commands";
import { MenuItem } from "prosemirror-menu";
import { schema } from "prosemirror-schema-basic";

let markType = {
  strong: schema.marks.strong,
  em: schema.marks.em,
  code: schema.marks.code,
  link: schema.marks.link,
  code_block: schema.marks.code_block,
}
function markActive(state, type) {
  let {from, to} = state.selection
  return state.doc.rangeHasMark(from, to, type)
}

const boldItem = new MenuItem({
  label: "B",
  enable(state) {
    return true;
  },

  run(state, dispatch, view) {
    // if (markActive(state, markType)) {
    toggleMark(markType.strong)(state, dispatch);
    return true;
    // }
  },
  active(state) {
    console.log(state)
    return markActive(state,markType.strong);
  },
  update(state) {
    const isActive = markActive(state,markType.strong);
    console.log(this.wrapper)
    // this.wrapper.classList.toggle('selected', isActive);
    return true;
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
const italicItem = new MenuItem({
  label: "I",
  enable(state) {
    return true;
  },

  run(state, dispatch, view) {
    // if (markActive(state, markType)) {
    toggleMark(schema.marks.em)(state, dispatch);
    return true;
    // }
  },
  active(state) {
    return markActive(state,markType.em);
  },
  render() {
    const item = document.createElement("div");
    item.innerHTML = `
    <button class="kudoshub-prosemirror-composer-icon-btn
    " data-test-text-formatter-italic="" type="button">
    <svg class="interface-icon o__standard o__standard__italic" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M5 13L6.95427 6H9.11163L7.15735 13H5Z"></path><path d="M10 3.25C10 3.94036 9.4169 4.5 8.6976 4.5C7.9783 4.5 7.3952 3.94036 7.3952 3.25C7.3952 2.55964 7.9783 2 8.6976 2C9.4169 2 10 2.55964 10 3.25Z"></path></svg>
</button>
    `;
    item.className = "italic-item";
    return item;
  },
});
const codeItem = new MenuItem({
  label: "code",
  enable(state) {
    return true;
  },

  run(state, dispatch, view) {
    toggleMark(schema.marks.code)(state, dispatch);
    return true;
  },
  active(state) {
    return markActive(state,markType.code);
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
const linkItem = new MenuItem({
  label: "link",
  enable(state) {
    return true;
  },

  run(state, dispatch, view) {
    toggleMark(schema.marks.link)(state, dispatch);
    return true;
  },
  active(state) {
    return markActive(state,markType.link);
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
const codeBlockItem = new MenuItem({
  label: "code-block",
  enable(state) {
    return true;
  },

  run(state, dispatch, view) {
    toggleMark(state.schema.marks.code_block1)(state, dispatch);
    return true;
  },
  // active(state) {
  //   return markActive(state,markType.code_block);
  // },
  render() {
    const item = document.createElement("div");
    item.innerHTML = `
    <button class="kudoshub-prosemirror-composer-icon-btn
    " data-test-text-formatter-code-block="" type="button">
    <svg class="interface-icon o__standard o__standard__code-block" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M3.98083 3.10094C4.31277 2.769 4.31277 2.23081 3.98083 1.89886C3.64888 1.56692 3.11069 1.56692 2.77874 1.89886L0.278744 4.39886C-0.0532013 4.73081 -0.0532013 5.269 0.278744 5.60094L2.77874 8.10094C3.11069 8.43289 3.64888 8.43289 3.98083 8.10094C4.31277 7.769 4.31277 7.23081 3.98083 6.89886L2.08187 4.9999L3.98083 3.10094Z"></path><path d="M7.34704 1.89886C7.01509 1.56692 6.4769 1.56692 6.14496 1.89886C5.81301 2.23081 5.81301 2.769 6.14496 3.10094L8.04392 4.9999L6.14496 6.89886C5.81301 7.23081 5.81301 7.769 6.14496 8.10094C6.4769 8.43289 7.01509 8.43289 7.34704 8.10094L9.84704 5.60094C10.179 5.269 10.179 4.73081 9.84704 4.39886L7.34704 1.89886Z"></path><path d="M0.999832 12V10.0928H2.69983V12C2.69983 12.1657 2.83415 12.3 2.99983 12.3H12.9998C13.1655 12.3 13.2998 12.1657 13.2998 12V4C13.2998 3.83431 13.1655 3.7 12.9998 3.7H10.9998V2H12.9998C14.1044 2 14.9998 2.89543 14.9998 4V12C14.9998 13.1046 14.1044 14 12.9998 14H2.99983C1.89526 14 0.999832 13.1046 0.999832 12Z"></path></svg>
</button>
    `;
    item.className = "link-item";
    return item;
  },
});

export const tooltipMenuItems = [boldItem, italicItem, codeItem,linkItem,codeBlockItem];