import { Plugin } from "prosemirror-state";
import { setElementProperties } from "../utils/setNodeProperties";

function handleBlockInsterClick({ topHalf, view, lastNode }) {
  console.log("clicked block");
  if (topHalf) {
    view.insertionPos = lastNode.pmViewDesc ? lastNode.pmViewDesc.posBefore : 0;
  } else {
    view.insertionPos = lastNode.pmViewDesc ? lastNode.pmViewDesc.posAfter : 0;
  }
}
function handleHoveringElement({ event, lastNode, view }) {
  const inserterPointer = view.dom.parentNode.querySelector(
    ".prosemirror-composer-inserter-pointer-line"
  );
  const blockInserter = view.dom.parentNode.querySelector("#blockInserter");
  const blockInserterBtn = view.dom.parentNode.querySelector(
    "#blockInserter-dropdown"
  );
  const editorContainer = view.dom;
  const elmRect = lastNode.getBoundingClientRect();
  const editorContainerRect = editorContainer.getBoundingClientRect();
  const topHalf = event.clientY - elmRect.top < elmRect.height / 2;
  const blockInserterRect = blockInserter.getBoundingClientRect();
  if (blockInserterBtn.onClick == null) {
    blockInserterBtn.onclick = () =>
      handleBlockInsterClick({ topHalf, view, lastNode });
  }
  if (topHalf) {
    setElementProperties(inserterPointer, {
      top: `${elmRect.top}px`,
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
    });
    setElementProperties(blockInserter, {
      transform: `translate(${editorContainerRect.left}px,${
        elmRect.bottom - blockInserterRect.height / 2
      }px)`,
      display: "block",
    });
  }
}


function handleInserterAndRulsetLeave(view, event) {
  const blockInserter = view.dom.parentNode.querySelector("#blockInserter");
  const inserterPointer = view.dom.parentNode.querySelector(
    ".prosemirror-composer-inserter-pointer-line"
  );
  const rulset = view.dom.parentNode.querySelector(".rulset-position");
  const blockInserterBtn = view.dom.parentNode.querySelector("#blockInserter-dropdown");
  if (
    event.toElement?.id !== "blockInserter-dropdown" &&
    event.toElement?.id !== "rulset-attribute" &&
    event.toElement &&
    !event.toElement.classList.contains("attributes-item-container") &&
    !event.toElement.classList.contains("attribute-selector") &&
    !event.toElement.classList.contains("attribute-items")
  ) {
    if(blockInserterBtn){
      blockInserterBtn.classList.add('hidden');
    }

    if(inserterPointer) {
      inserterPointer.classList.add('hidden');
    }
    if(rulset) {
      rulset.classList.add('hidden');
    }
  } else {
    rulset.addEventListener("mouseleave", (e) => {
      if (
        e.toElement &&
        !e.toElement.classList.contains("kudoshub-prosemirror-composer-editor")&&
        !e.toElement.pmViewDesc
      ) {
         if(blockInserterBtn){
          blockInserterBtn.classList.add('hidden');
        }
        if(inserterPointer) {
          inserterPointer.classList.add('hidden');
        }
        if(rulset) {
          rulset.classList.add('hidden');
        }
      }
    });
    blockInserter.addEventListener("mouseleave", (e) => {
      if (
        e.toElement &&
        !e.toElement.classList.contains("kudoshub-prosemirror-composer-editor")
      ) {
        if(blockInserterBtn){
          blockInserterBtn.classList.add('hidden');
        }
        if(inserterPointer) {
          inserterPointer.classList.add('hidden');
        }
        if(rulset) {
          rulset.classList.add('hidden');
        }
      }
    });
  }
}

function handleMousemove(view, event) {
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
    handleHoveringElement({ event, lastNode, view });
  }
  return false;
}

export function editorDOMEvents(options) {
  return new Plugin({
    props: {
      handleDOMEvents: {
        mousemove(view, event) {
          handleMousemove(view, event);
        },
        mouseenter(view, event) {
          const inserterPointer = view.dom.parentNode.querySelector(
            ".prosemirror-composer-inserter-pointer-line"
          );
          const blockInserterBtn = view.dom.parentNode.querySelector("#blockInserter-dropdown");
          const rulset = view.dom.parentNode.querySelector(".rulset-position");

            if(inserterPointer) {
              inserterPointer.classList.remove('hidden')
            }
            if(rulset) {
              rulset.classList.remove('hidden');
            }
            if(blockInserterBtn){
              blockInserterBtn.classList.remove('hidden');
            }
        },
        mouseleave(view, event) {
          handleInserterAndRulsetLeave(view, event);
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
    view(editorView) {
      return {
        destroy() {
          editorView.dom.removeEventListener("mousemove", handleMousemove);
        },
      };
    },
  });
}
