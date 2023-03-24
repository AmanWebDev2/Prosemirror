import React, { useEffect, useRef, useState } from "react";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { prosmirrorSchema } from "./custom/schema/schema";
import { Decoration, DecorationSet } from "prosemirror-view";
import { plugins } from "./plugins/plugins";
import { toggleMark } from "prosemirror-commands";
import { ATTRIBUTE_SPAN } from "./custom/schema/nodes/Names";
import RuleSetBlock from "../RuleSetBlock";
import { attributes } from "../../data/attributes";
import { DOMSerializer } from "prosemirror-model";

const doc = prosmirrorSchema.nodeFromJSON(  {
  "type": "doc",
  "content": [
      {
          "type": "paragraph",
          "attrs": {
              "align": null,
              "color": null,
              "id": null,
              "indent": null,
              "lineSpacing": null,
              "paddingBottom": null,
              "paddingTop": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "line one"
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "align": null,
              "color": null,
              "id": null,
              "indent": null,
              "lineSpacing": null,
              "paddingBottom": null,
              "paddingTop": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "line two"
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "align": null,
              "color": null,
              "id": null,
              "indent": null,
              "lineSpacing": null,
              "paddingBottom": null,
              "paddingTop": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "line three"
              },
              {
                  "type": "attribute_span",
                  "attrs": {
                      "class": "highlight",
                      "style": "background-color: yellow",
                      "contenteditable": "false"
                  },
                  "content": [
                      {
                          "type": "text",
                          "text": "My custom text"
                      }
                  ]
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "align": null,
              "color": null,
              "id": null,
              "indent": null,
              "lineSpacing": null,
              "paddingBottom": null,
              "paddingTop": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "🤞"
              }
          ]
      }
  ]
});

let CONFIG = {
  characterData: true,
  attributes: true,
  childList: true,
  subtree: true,
};

function handleObserver(mutations) {
  let lastAddedBlockNode = null;
  //Last added input popover node.
  let lastAddedInputNode = null;
  let lastAddedSpan = null;
  mutations.map((mutation, index) => {
    // if any change in childList.
    if (mutation.type == "childList") {
      // if change is that -> Any node is added.
      if (mutation.addedNodes.length > 0) {
        let addedNodes = Array.prototype.slice.call(mutation.addedNodes);
        if (addedNodes.length > 0) {
          const blocknode = addedNodes[0];
          switch (blocknode.nodeName) {
            // if block is paragraph
            case "P":
              let PchildNodes = Array.prototype.slice.call(
                addedNodes[0].childNodes
              );
              if (PchildNodes.length > 0) {
                PchildNodes.map((child) => {
                  switch (child.nodeName) {
                    case "SPAN":
                      console.log("span");
                      break;
                    case "BR":
                      console.log("br");
                      break;
                    default:
                      break;
                  }
                });
              }
            break;
            case "BR":
             console.log("BR");
              break;
            // If block is Div
            case "DIV":
              if(blocknode.classList.contains('kudoshub-smartlink__tooltip')) {
                console.log("DIV");
                const { state } = window.view;
                const { from } = state.selection;
                const start = window.view.coordsAtPos(from);
                // let offsetParentBox = blocknode.parentNode.offsetParent.getBoundingClientRect();
                const kudoshubIframe = document.getElementById('kudoshub-editor-frame');
                if(kudoshubIframe) {
                  const st = kudoshubIframe.contentWindow.scrollY;
                  console.log(kudoshubIframe.contentWindow)
                  blocknode.parentNode.style.top = (start.bottom+st) + "px";

                }
               }
              break;
            case "SPAN":
               console.log("SPAN");
               console.log(blocknode)
              break;
            case "A":
              console.log("A");
              break;
            // case "KUDOSHUB-BLOCK":
            //   if (blocknode.getAttribute("data-type")) {
            //     switch (blocknode.getAttribute("data-type")) {
            //       case "button":
            //         blocknode.classList.add("block-is-current");
            //         break;
            //       case "image":
            //         if (
            //           blocknode.classList &&
            //           blocknode.classList.contains("block-is-current")
            //         ) {
            //           // Show redo image's popover.
            //           showPopoverHandler(
            //             blocknode.getAttribute("data-type"),
            //             blocknode
            //           );
            //           // Set selection to image
            //           const childNodes = recursiveFindChildren(blocknode);
            //           const imageNode = childNodes.find(
            //             (node) => node.nodeName === "IMG"
            //           );
            //           if (imageNode) setSelectionByselectNode(imageNode);
            //         }
            //         break;

            //       default:
            //         break;
            //     }
            //   }
              // break;
            default:
              break;
          }
        }
        if (addedNodes)
          // set the last added block node.
          lastAddedBlockNode = addedNodes[addedNodes.length - 1];
      }

      if (mutation.removedNodes.length > 0) {
        let removeNodes = Array.prototype.slice.call(mutation.removedNodes);
        if (removeNodes.length > 0) {
          let blockNode = removeNodes[0];
          switch (blockNode.nodeName) {
            case "KUDOSHUB-BLOCK":
              switch (blockNode.getAttribute("data-type")) {
                case "button":
                  console.log("button");
                  break;
                case "image":
                  console.log("image");
                  break;
                default:
                  break;
              }
              break;
            default:
              break;
          }
        }
      }
    }
    if (mutation.type === "attributes") {
      if (mutation.attributeName === "data-align") {
      
      }

      if (mutation.attributeName === "class") {
        if (mutation.target.classList.contains("block-is-current")) {

        }
      }
    }
  });
  if (lastAddedSpan) {
    let spanChildNodes = Array.prototype.slice.call(lastAddedSpan.childNodes);
    spanChildNodes.map((node) => {
      if (node.nodeName === "SPAN") {
        node.style.fontSize = "unset";
      }
    });
  }
  if (lastAddedInputNode) {
    if (
      lastAddedInputNode.nextSibling &&
      lastAddedInputNode.nextSibling.nodeName === "#text"
    ) {
      if (lastAddedInputNode.nextSibling.data === "") {
        lastAddedInputNode.nextSibling.data = " ";
      }
       
    }
  }
}

export default function Editor() {
  const editorRef = useRef(null);
  const editorDom = useRef(null); 
  const rulsetRef = useRef(null);
  
  useEffect(() => {
    if (editorRef.current) return;
    const tooltipContent = document.createElement("div");
    tooltipContent.style.background = "red";
    tooltipContent.classList.add("my-tooltip");

    // Define the bold button and its click handler
    const boldButton = document.createElement("button");

    boldButton.innerText = "Bold";
    boldButton.addEventListener("click", () => {
      toggleMark(prosmirrorSchema.marks.strong)(
        editorRef.current.state,
        editorRef.current.dispatch
      );
    });

    // Add the button to the tooltip content
    tooltipContent.appendChild(boldButton);

    // Create a decoration that shows the tooltip when the selection is made
    function tooltipDecoration(state) {
      const { from, to } = state.selection;
      if (from == to) return null;
      const tooltip = Decoration.widget(tooltipContent, { key: "my-tooltip" });
      return DecorationSet.create(state.doc, [tooltip]);
    }

    editorRef.current = new EditorView(editorDom.current, {
      state: EditorState.create({ schema:prosmirrorSchema,doc, plugins }),
      decorations: (state) => tooltipDecoration(state),
       
    });
    const editorWrapper = editorRef.current.dom;
    editorWrapper.classList.add('kudoshub-prosemirror-composer-editor');

    const observer = new MutationObserver((mutations) => {
      handleObserver(mutations)
    });
    window.view = editorRef.current;
    observer.observe(editorWrapper.parentNode, CONFIG);

    // hide attribute menu 
    editorWrapper.addEventListener("input",handleEditorClick);
    editorWrapper.addEventListener("click",handleEditorClick);
    editorWrapper.addEventListener("focus",handleEditorClick);

    return () => {
      editorWrapper.removeEventListener("input",handleEditorClick);
      editorWrapper.removeEventListener("click",handleEditorClick);
      editorWrapper.removeEventListener("focus",handleEditorClick);
    }

  }, []);

  const handleAddSpan=()=>{
    // 1. find cursor position
    // 2. append span
    const view = editorRef.current;
    if (view) {
      const node = view.state.schema.nodes[ATTRIBUTE_SPAN].create({}, [view.state.schema.text("My custom text")]);
      const transaction = view.state.tr.replaceSelectionWith(node);
      view.dispatch(transaction);

      // const span = schema.text('Hello World', [schema.mark(view.state.schema.marks[MARK_SPAN])]);
      // console.log(view.state.schema.marks[MARK_SPAN]);
      // console.log(span);
      // const transaction = view.state.tr.insert(from, span);
      // view.dispatch(view.state.tr.replaceWith(from, to, span));
      // view.dispatch(transaction);
    }
  }


  const handleEditorClick=(e)=>{
    if(rulsetRef.current) {
      rulsetRef.current.closeRuleSetMenu()
    }
  }

  return(
    <>
     <div id="editor" ref={editorDom} onClick={handleEditorClick}>
      <RuleSetBlock dropdownData={attributes} ref={rulsetRef} />
     </div>
     <button onClick={handleAddSpan}>ADD SPAN</button>
     <button onClick={()=>{
        const view = editorRef.current;
        console.log(view.state.doc.toJSON())
        console.log(view.state.doc.textContent)
        console.log(view.state.doc)
     }}>GET DATA</button>
    </>
  );
}
