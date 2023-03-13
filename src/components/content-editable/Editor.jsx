import React, { useEffect, useRef } from "react";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { schema } from "./custom/schema/schema";
import { Decoration, DecorationSet } from "prosemirror-view";
import { baseKeymap, toggleMark } from "prosemirror-commands";
import { keymap } from "prosemirror-keymap";
import { undo, redo, history } from "prosemirror-history";
import { selectionMenu } from "./selectionMenu";
import { tooltipMenuItems, } from "./custom/menuItems";

const doc = schema.nodeFromJSON({"type":"doc","content":[
  {
    "type": "paragraph",
    "content": [
        {
            "type": "text",
            "text": "line one"
        }
    ]
},
{
    "type": "paragraph",
    "content": [
        {
            "type": "text",
            "text": "line two"
        }
    ]
},
{
    "type": "paragraph",
    "content": [
        {
            "type": "text",
            "text": "line three"
        }
    ]
},
{
    "type": "paragraph",
    "content": [
        {
            "type": "text",
            "text": "🤞"
        }
    ]
}

]});

const plugins = [
  history(),
  keymap({ "Mod-z": undo, "Mod-y": redo }),
  keymap(baseKeymap),
  selectionMenu({ content: [tooltipMenuItems] }),
  editorDOMEvents(),

];

export default function Editor() {
  const editorRef = useRef(null);
  const editorDom = useRef(null); 
  
  useEffect(() => {
    if (editorRef.current) return;
    const tooltipContent = document.createElement("div");
    tooltipContent.style.background = "red";
    tooltipContent.classList.add("my-tooltip");

    // Define the bold button and its click handler
    const boldButton = document.createElement("button");

    boldButton.innerText = "Bold";
    boldButton.addEventListener("click", () => {
      toggleMark(schema.marks.strong)(
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
      state: EditorState.create({ doc, plugins }),
      decorations: (state) => tooltipDecoration(state),
    });
    const editorWrapper = editorRef.current.dom;
    editorWrapper.classList.add('kudoshub-prosemirror-composer-editor');
  }, []);

  return <div id="editor" ref={editorDom} />;
}
