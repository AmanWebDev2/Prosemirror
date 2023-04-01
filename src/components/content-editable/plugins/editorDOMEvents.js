import { Plugin } from "prosemirror-state";
import { setElementProperties } from "../utils/setNodeProperties";

function handleBlockInsterClick({ topHalf, view, lastNode }) {
  if (topHalf) {
    view.insertionPos = lastNode.pmViewDesc ? lastNode.pmViewDesc.posBefore : 0;
  } else {
    view.insertionPos = lastNode.pmViewDesc ? lastNode.pmViewDesc.posAfter : 0;
  }
}

function handleHoveringElement({ event, lastNode, view, iframe,iframeDoc }) {
  const inserterPointer = view.dom.parentNode.querySelector(
    ".prosemirror-composer-inserter-pointer-line"
  );
  let blockInserter;
  let blockInserterBtn;
  if(iframe) {
    blockInserter = iframeDoc.querySelector("#blockInserter");
    blockInserterBtn = iframeDoc.querySelector(
      "#blockInserter-dropdown"
    );
  }else {
    blockInserter = document.querySelector("#blockInserter");
    blockInserterBtn = document.querySelector(
      "#blockInserter-dropdown"
    );
  }
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
    });
  } else {
    setElementProperties(inserterPointer, {
      top: `${elmRect.bottom}px`,
    });
    setElementProperties(blockInserter, {
      transform: `translate(${editorContainerRect.left}px,${
        elmRect.bottom - blockInserterRect.height / 2
      }px)`,
    });
  }
}

function handleblockInserterMouseleave({e,blockInserterBtn,inserterPointer,rulset,blockInserter,blockInserterMenu,rulsetMenu}) {
  if((blockInserterMenu && blockInserterMenu.style.display == "block") || 
  (rulsetMenu && rulsetMenu.style.display == "block")
  ) return

  if (
    e.toElement &&
    e.toElement?.id !=="editor" &&
    !e.toElement.classList.contains("kudoshub-prosemirror-composer-editor")&&
    !e.toElement.pmViewDesc
  ) {
     if(blockInserterBtn){
      blockInserterBtn.classList.add('hidden');
      blockInserter.classList.add('hidden');
    }
    if(inserterPointer) {
      inserterPointer.classList.add('hidden');
    }
    if(rulset) {
      rulset.classList.add('hidden');
    }
  }
}

export function toggleInserter(view,show,iframe) {
  if(view) {
    let rulset;
    let blockInserter;
    if(iframe){
      const iframe = document.getElementById("kudoshub-editor-frame");
      if(!iframe) return; 
      const iframeDoc = iframe.contentWindow
          ? iframe.contentWindow.document
          : null;
      if (!iframeDoc) return;
      rulset = iframeDoc.querySelector(".rulset-position");
      blockInserter = iframeDoc.querySelector("#blockInserter");
    }else {
      blockInserter = document.querySelector("#blockInserter");
      rulset = document.querySelector(".rulset-position");
    }
    const inserterPointer = view.dom.parentNode.querySelector(
      ".prosemirror-composer-inserter-pointer-line"
    );

    if(!show) {
      if(blockInserter && !blockInserter.classList.contains("hidden")){
        blockInserter.classList.add('hidden');
      }
      if(inserterPointer && !inserterPointer.classList.contains("hidden")) {
        inserterPointer.classList.add('hidden');
      }
      if(rulset && !rulset.classList.contains("hidden")) {
        rulset.classList.add('hidden');
      }
    }else {
      if(blockInserter && blockInserter.classList.contains("hidden")){
        blockInserter.classList.remove('hidden');
      }
      if(inserterPointer && inserterPointer.classList.contains("hidden")) {
        inserterPointer.classList.remove('hidden');
      }
      if(rulset && rulset.classList.contains("hidden")) {
        rulset.classList.remove('hidden');
      }
    }
  }
}

// function handleRulesetMouseleave({e,blockInserterBtn,inserterPointer,rulset,blockInserterMenu,rulsetMenu}) {
//   if((blockInserterMenu && blockInserterMenu.style.display == "block") || 
//   (rulsetMenu && rulsetMenu.style.display == "block")
//   ) return

//   if (
//     e.toElement &&
//     !e.toElement.classList.contains("kudoshub-prosemirror-composer-editor")&&
//     !e.toElement.pmViewDesc
//   ) {
//      if(blockInserterBtn){
//       blockInserterBtn.classList.add('hidden');
//     }
//     if(inserterPointer) {
//       inserterPointer.classList.add('hidden');
//     }
//     if(rulset) {
//       rulset.classList.add('hidden');
//     }
//   }
// }

function handleInserterAndRulsetLeave(view, event,iframe,iframeDoc) {
  const inserterPointer = view.dom.parentNode.querySelector(
    ".prosemirror-composer-inserter-pointer-line"
  );
  let blockInserter;
  let blockInserterMenu;
  let rulset;
  let rulsetMenu;
  let blockInserterBtn;

  
  if(iframe) {
    blockInserter = iframeDoc.querySelector("#blockInserter");
    blockInserterMenu = iframeDoc.querySelector(
      "#blockInserter_menu_wrapper"
    );
    rulset = iframeDoc.querySelector(".rulset-position");
    rulsetMenu = iframeDoc.querySelector(".attribute-selector");
    blockInserterBtn = iframeDoc.querySelector("#blockInserter-dropdown");
  }else {
    blockInserter = document.querySelector("#blockInserter");
    blockInserterMenu = document.querySelector(
      "#blockInserter_menu_wrapper"
    );
    rulset = document.querySelector(".rulset-position");
    rulsetMenu = document.querySelector(".attribute-selector");
    blockInserterBtn = document.querySelector("#blockInserter-dropdown");
  }

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
      blockInserter.classList.add('hidden');
    }

    if(inserterPointer) {
      inserterPointer.classList.add('hidden');
    }
    if(rulset) {
      rulset.classList.add('hidden');
    }
  } else {
    if(blockInserter.onmouseleave == null) {
      blockInserter.onmouseleave = (e) => {
        handleblockInserterMouseleave({e,rulset,blockInserterBtn,inserterPointer,blockInserter,blockInserterMenu,rulsetMenu});
      } 
    }
    if(rulset.onmouseleave == null) {
      rulset.onmouseleave = (e) => {
        // handleRulesetMouseleave({e,rulset,blockInserterBtn,inserterPointer,blockInserterMenu,rulsetMenu});
        handleblockInserterMouseleave({e,rulset,blockInserterBtn,inserterPointer,blockInserter,blockInserterMenu,rulsetMenu});
      } 
    }
  }
}

function handleMousemove(view, event,iframe,iframeDoc) {
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
    handleHoveringElement({ event, lastNode, view, iframe,iframeDoc });
  }
  return false;
}
function getTranslateXY(element) {
  const style = window.getComputedStyle(element)
  const matrix = new DOMMatrixReadOnly(style.transform)
  return {
      translateX: matrix.m41,
      translateY: matrix.m42
  }
}
function handleMouseEnter(view,event,iframe,iframeDoc) {
  const inserterPointer = view.dom.parentNode.querySelector(
    ".prosemirror-composer-inserter-pointer-line"
  );
 
  let blockInserterBtn;
  let blockInserter;
  let rulset;
  if(iframe) {
    blockInserter = iframeDoc.querySelector("#blockInserter");
    blockInserterBtn = iframeDoc.querySelector("#blockInserter-dropdown");
    rulset = iframeDoc.querySelector(".rulset-position");
  }else {
    blockInserter = document.querySelector("#blockInserter");
    blockInserterBtn = document.querySelector("#blockInserter-dropdown");
    rulset = document.querySelector(".rulset-position");

  } 
  const domRect = view.dom.getBoundingClientRect();
  const blockInserterRect = blockInserter.getBoundingClientRect();

    if(inserterPointer) {
      inserterPointer.classList.remove('hidden');
      inserterPointer.style.top = `${event.y}px`
    }
    if(rulset) {
      rulset.classList.remove('hidden');
      const transform = getTranslateXY(rulset);
      rulset.style.transform = `translate(${
        domRect.right - 15 + window.scrollX
      }px, ${transform.translateY}px)`;
    }
    if(blockInserterBtn){
      blockInserterBtn.classList.remove('hidden');
    }
    
    if(blockInserter) {
      blockInserter.classList.remove('hidden')
   
      blockInserter.style.left = `-15px`
      blockInserter.style.transform = `translate(${domRect.left}px,${
        event.y - blockInserterRect.height / 2
      }px)`
      
    }
}

export function editorDOMEvents(options) {
  return new Plugin({
    props: {
      handleDOMEvents: {
        mousemove(view, event) {
          const { iframe } = options;
          let blockInserterMenu;
          let rulsetMenu;
          let iframeDoc;
          if(iframe) {
            const iframe = document.getElementById("kudoshub-editor-frame");
            if(!iframe) return; 
            iframeDoc = iframe.contentWindow
                ? iframe.contentWindow.document
                : null;
            if (!iframeDoc) return;
        
            blockInserterMenu = iframeDoc.querySelector(
              "#blockInserter_menu_wrapper"
            );
            rulsetMenu = iframeDoc.querySelector(".attribute-selector");
          }else {
            blockInserterMenu = document.querySelector("#blockInserter_menu_wrapper");
            rulsetMenu = document.querySelector(".attribute-selector");
          }
          
          if((blockInserterMenu && blockInserterMenu.style.display !== "block") &&
          (rulsetMenu && rulsetMenu.style.display !== "block")) {
             // view, show,iframe
             toggleInserter(view,true,iframe);
            handleMousemove(view, event, iframe,iframeDoc);
          }
          const { state, } = view;
          if (
            !state.selection.empty 
          ) {
            toggleInserter(view,false,iframe);
          }
        },
        mouseenter(view, event) {
          const { iframe } = options;
          let blockInserterMenu;
          let rulsetMenu;
          let iframeDoc
          if(iframe) {
            const iframe = document.getElementById("kudoshub-editor-frame");
            if(!iframe) return; 
            iframeDoc = iframe.contentWindow
                ? iframe.contentWindow.document
                : null;
            if (!iframeDoc) return;
            
            blockInserterMenu = iframeDoc.querySelector(
              "#blockInserter_menu_wrapper"
            );
            rulsetMenu = iframeDoc.querySelector(".attribute-selector");
          }else {
            blockInserterMenu = document.querySelector("#blockInserter_menu_wrapper");
            rulsetMenu = document.querySelector(".attribute-selector");
          }

          if(
            blockInserterMenu && blockInserterMenu.style.display == "block" ||
          rulsetMenu && rulsetMenu.style.display == "block"
          ) return;
          handleMouseEnter(view,event,iframe,iframeDoc)
        },
        mouseleave(view, event) {
          const { iframe } = options;
          let blockInserterMenu;
          let rulsetMenu;
          let iframeDoc;
          if(iframe) {
            const iframe = document.getElementById("kudoshub-editor-frame");
            if(!iframe) return; 
            iframeDoc = iframe.contentWindow
                ? iframe.contentWindow.document
                : null;
            if (!iframeDoc) return;
            
            blockInserterMenu = iframeDoc.querySelector(
              "#blockInserter_menu_wrapper"
            );
            rulsetMenu = iframeDoc.querySelector(".attribute-selector");
          }else {
            blockInserterMenu = document.querySelector("#blockInserter_menu_wrapper");
            rulsetMenu = document.querySelector(".attribute-selector");
          }

          if((blockInserterMenu && blockInserterMenu.style.display !== "block") &&
          (rulsetMenu && rulsetMenu.style.display !== "block")) {
            // toggleInserter(view,false);
            handleInserterAndRulsetLeave(view, event,iframe,iframeDoc);
          }
        },
        focus(view,event) {
           const { iframe } = options;
          let rulsetBtn;
          let rulsetMenu;
          let iframeDoc;
          if(iframe) {
            const iframe = document.getElementById("kudoshub-editor-frame");
            if(!iframe) return; 
            iframeDoc = iframe.contentWindow
                ? iframe.contentWindow.document
                : null;
            if (!iframeDoc) return;

            rulsetBtn = iframeDoc.querySelector(
              "#rulesetBtn"
            );
            rulsetMenu = iframeDoc.querySelector(".attribute-selector");
          }else {
            rulsetBtn = document.querySelector("#rulesetBtn");
            rulsetMenu = document.querySelector(".attribute-selector");
          }

          if(rulsetMenu && rulsetMenu.style.display !== "none") {
            rulsetMenu.style.display = "none";
          }
          if(rulsetBtn && rulsetBtn.style.display !== "block") {
            rulsetBtn.style.display = "block";
          }
          // view, show,iframe
          toggleInserter(view,true,iframe);
        },
        scroll(view,event) {
          const { iframe } = options;
          
          // view, show,iframe
          toggleInserter(view,true,iframe);
        },
        input(view,event) {
          const { iframe } = options;
          // view, show,iframe
          toggleInserter(view,false,iframe);
        },
      },
      // nodeViews: {
      //   link(node, view, getPos) {
      //     const dom = document.createElement("a");
      //     dom.href = node.attrs.href;
      //     dom.textContent = node.textContent;
      //     dom.addEventListener("click", (event) => {
      //       event.preventDefault();
      //       console.log("Link clicked:", node.attrs.href);
      //     });
      //     return {
      //       dom,
      //     };
      //   },
      // },
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
