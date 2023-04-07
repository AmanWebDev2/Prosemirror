import { markActive } from "./markActive";

const topSpace = 5;

export const handleMenuPosition = ({ view, isLinkActive, iframe, menu }) => {
  const { state, readOnly } = view;
  const { from, to } = state.selection;
  const start = view.coordsAtPos(from);
  const end = view.coordsAtPos(to);

  const domNode = view.nodeDOM(from); // Get the corresponding DOM node

  try {
    let box = menu.getBoundingClientRect();
    let offsetParentBox = menu.offsetParent
      ? menu.offsetParent.getBoundingClientRect()
      : document.body.getBoundingClientRect();
    let left =
      (start.left + end.left) / 2 - box.width / 2 - offsetParentBox.left;
    if (left < 5) {
      left = 5;
    }
    if (
      (markActive(state, state.schema.marks.link) &&
        !(!state || readOnly || state.selection.from !== state.selection.to)) ||
      isLinkActive
    ) {
      if (iframe) {
        menu.style.top = start.bottom + "px";
        menu.style.left = left + "px";
      } else {
        menu.style.transform = `translate(${left}px,${start.bottom}px)`;
      }
    } else {
      if (iframe) {
        if (
          domNode &&
          domNode.nodeName === "DIV" &&
          domNode.classList.contains("image-container")
        ) {
          const domNodeRect = domNode.getBoundingClientRect();
          menu.style.top = start.top - offsetParentBox.top - box.height - topSpace + "px";
          menu.style.left = domNodeRect.width / 2 + left + "px";
        } else if (
          domNode &&
          domNode.nodeName === "DIV" &&
          domNode.classList.contains("embed-video-container")
        ) {
          const domNodeRect = domNode.getBoundingClientRect();

          menu.style.top = start.top - offsetParentBox.top - box.height - topSpace + "px";
          menu.style.left = (domNodeRect.width / 2) - left + "px";
        } else {
          menu.style.top = start.top - offsetParentBox.top - box.height + "px";
          menu.style.left = left + "px";
        }
      } else {
        if (
          domNode &&
          domNode.nodeName === "DIV" &&
          domNode.classList.contains("image-container")
        ) {
          const domNodeRect = domNode.getBoundingClientRect();
          console.log("positioned");
          menu.style.transform = `translate(${domNodeRect.width / 2 + left}px,${
            start.top - offsetParentBox.top - box.height - topSpace
          }px)`;
        } else if (
          domNode &&
          domNode.nodeName === "DIV" &&
          domNode.classList.contains("embed-video-container")
        ) {
          const domNodeRect = domNode.getBoundingClientRect();
          menu.style.transform = `translate(${domNodeRect.width / 2 + left}px,${
            start.top - offsetParentBox.top - box.height - topSpace
          }px)`;
        } else {
          menu.style.transform = `translate(${left}px,${
            start.top - offsetParentBox.top - box.height - topSpace
          }px)`;
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
};
