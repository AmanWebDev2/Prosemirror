import React, { useEffect, useRef } from "react";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema, DOMParser } from "prosemirror-model";
import { schema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";
import { Decoration, DecorationSet } from "prosemirror-view";
import { baseKeymap, toggleMark } from "prosemirror-commands";
import { keymap } from "prosemirror-keymap";
import { undo, redo, history } from "prosemirror-history";
import { selectionMenu } from "./selectionMenu";
import "../../App.css";
 
// import MenuView from "./custom/MenuView";
import { tooltipMenuItems, } from "./custom/menuItems";

export const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
  marks: schema.spec.marks,
});

// const doc = DOMParser.fromSchema(mySchema).parse(document.createElement("div"));
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

]})
const plugins = [
  history(),
  keymap({ "Mod-z": undo, "Mod-y": redo }),
  keymap(baseKeymap),
  selectionMenu({ content: [tooltipMenuItems] }),
  // tooltipMenuPlugin,
];

export default function Editor({ doc:doc1 }) {
  const editorRef = useRef(null);
  const editorDom = useRef(null); 
  // const doc = schema.nodeFromJSON(doc1);



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
    // Define your custom tooltip content
  }, []);

  return <div id="editor" ref={editorDom} />;
}
