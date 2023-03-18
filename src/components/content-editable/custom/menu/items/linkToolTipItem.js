import { MenuItem } from "prosemirror-menu";

export const linkToolTipItem = new MenuItem({
  label: "link tooltip",
  enable(state) {
    return true;
  },

  run(state, dispatch, view) {
    return true;
  },
  active(state) {
    return true;
  },

  render() {
    const input = document.createElement("input");
    input.type = "text";
    input.addEventListener("click", (event) => {
      event.stopPropagation();
    });
    input.focus();
    return input;
  },
});
