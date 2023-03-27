import { Plugin } from "prosemirror-state";
import { setElementProperties } from "../utils/setNodeProperties";

function handleHoveringElement(event, element, view, lastNode) {
  const inserterPointer = view.dom.parentNode.querySelector(
    ".prosemirror-composer-inserter-pointer-line"
  );
  const editorContainer = view.dom;
  const elmRect = element.getBoundingClientRect();
  const blockInserter = view.dom.parentNode.querySelector("#blockInserter");
  const editorContainerRect = editorContainer.getBoundingClientRect();
  const topHalf = event.clientY - elmRect.top < elmRect.height / 2;
  const blockInserterRect = blockInserter.getBoundingClientRect();

  blockInserter.addEventListener("click",()=>{
    if(topHalf) {
      view.insertionPos = lastNode.pmViewDesc ? lastNode.pmViewDesc.posBefore : 0;
    }else {
      view.insertionPos = lastNode.pmViewDesc ? lastNode.pmViewDesc.posAfter : 0;
    }
  })
  if (topHalf) {
    setElementProperties(inserterPointer, {
      top: `${elmRect.top}px`,
      display: "block",
    });
    setElementProperties(blockInserter, {
      transform: `translate(${editorContainerRect.left}px,${
        elmRect.top - blockInserterRect.height / 2
      }px)`,
      display: "block",
    });
  } else {
    setElementProperties(inserterPointer, {
      top: `${elmRect.bottom}px`,
      display: "block",
    });
    setElementProperties(blockInserter, {
      transform: `translate(${editorContainerRect.left}px,${
        elmRect.bottom - blockInserterRect.height / 2
      }px)`,
      display: "block",
      visibility: "visible",
    });
  }
}

function handleInserterAndRulsetLeave(view, event) {
  const blockInserter = view.dom.parentNode.querySelector("#blockInserter");
  const inserterPointer = view.dom.parentNode.querySelector(
    ".prosemirror-composer-inserter-pointer-line"
  );
  const rulset = view.dom.parentNode.querySelector(".rulset-position");

  if (
    event.toElement?.id !== "blockInserter-dropdown" &&
    event.toElement?.id !== "rulset-attribute"
  ) {
    setElementProperties(blockInserter, { visibility: "hidden" });
    setElementProperties(inserterPointer, { visibility: "hidden" });
    setElementProperties(rulset, { visibility: "hidden" });
  } else {
    rulset.addEventListener("mouseleave", (e) => {
      if (
        e.toElement &&
        !e.toElement.classList.contains("kudoshub-prosemirror-composer-editor")
      ) {
        setElementProperties(blockInserter, { visibility: "hidden" });
        setElementProperties(inserterPointer, { visibility: "hidden" });
        setElementProperties(rulset, { visibility: "hidden" });
      }
    });
    blockInserter.addEventListener("mouseleave", (e) => {
      if (
        e.toElement &&
        !e.toElement.classList.contains("kudoshub-prosemirror-composer-editor")
      ) {
        setElementProperties(blockInserter, { visibility: "hidden" });
        setElementProperties(inserterPointer, { visibility: "hidden" });
        setElementProperties(rulset, { visibility: "hidden" });
      }
    });
  }
}

export function editorDOMEvents(options) {
  return new Plugin({
    props: {
      handleDOMEvents: {
        mousemove(view, event) {
          const posAtCoords = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          });

          if (!posAtCoords) {
            return false;
          }

          const pos = posAtCoords.pos;
          let node = view.domAtPos(pos).node;

          // let nodes = []
          let parent = null;
          let lastNode = node;
          if (node && node.pmViewDesc) {
            parent = node.pmViewDesc.parent;
            while (parent?.parent) {
              lastNode = parent.dom;
              parent = parent.parent;
            }
          }
          if (lastNode && parent) {
            // console.dir(lastNode);
            handleHoveringElement(event,lastNode,view,lastNode);
          }
          return false;
        },
        mouseenter(view, event) {
          const blockInserter =
            view.dom.parentNode.querySelector("#blockInserter");
          const inserterPointer = view.dom.parentNode.querySelector(
            ".prosemirror-composer-inserter-pointer-line"
          );
          const rulset = view.dom.parentNode.querySelector(".rulset-position");

          setElementProperties(blockInserter, { visibility: "visible" });
          setElementProperties(inserterPointer, { visibility: "visible" });
          setElementProperties(rulset, { visibility: "visible" });
        },
        mouseleave(view, event) {
          handleInserterAndRulsetLeave(view, event);

          // console.log(event.target)
          // setElementProperties(blockInserter, { visibility: "hidden" });
          // setElementProperties(inserterPointer, { visibility: "hidden" });
          // setElementProperties(rulset, { visibility: "hidden" });
        },
        click(view, event) {
          // console.log('Clicked on editor root element!',event.target);
        },
      },
      nodeViews: {
        link(node, view, getPos) {
          const dom = document.createElement("a");
          dom.href = node.attrs.href;
          dom.textContent = node.textContent;
          dom.addEventListener("click", (event) => {
            event.preventDefault();
            console.log("Link clicked:", node.attrs.href);
          });
          return {
            dom,
          };
        },
      },
    },
  });
}

