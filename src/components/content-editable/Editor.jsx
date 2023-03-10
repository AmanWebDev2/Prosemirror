import React, { useEffect, useRef, useState } from "react";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema, DOMParser } from "prosemirror-model";
import { schema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";
import { buildMenuItems, exampleSetup } from "prosemirror-example-setup";
import Frame from "react-frame-component";
import DecorationTooltip from "./DecorationToolTip";
import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { baseKeymap, toggleMark } from "prosemirror-commands";
import { keymap } from "prosemirror-keymap";
import { undo, redo, history } from "prosemirror-history";
import { selectionMenu } from "./selectionMenu";
import "../../App.css";
import {
  wrapItem,
  blockTypeItem,
  Dropdown,
  DropdownSubmenu,
  joinUpItem,
  liftItem,
  selectParentNodeItem,
  undoItem,
  redoItem,
  icons,
  MenuItem,
  MenuElement,
  MenuItemSpec,
} from "prosemirror-menu";
import MenuView from "./custom/MenuView";
import { menu, menuitems, tooltipMenuPlugin } from "./custom/menuItems";

export const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
  marks: schema.spec.marks,
});

function icon(text, name) {
  let span = document.createElement("span");
  span.className = "menuicon " + name;
  span.title = name;
  span.textContent = text;
  return span;
}

const strong = new MenuItem({
  label: "B",
  enable(state) {
    return true;
  },

  run(state, dispatch, view) {
    console.log(view);
    // if (markActive(state, markType)) {
    toggleMark(schema.marks.strong)(state, dispatch);
    return true;
    // }
  },
  render() {
    const item = document.createElement("div");
    item.innerHTML = `
    <button class="embercom-prosemirror-composer-icon-btn
    " data-test-text-formatter-bold="" type="button">
    <svg class="interface-icon o__standard o__standard__bold" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M4 13H8.62029C10.6924 13 12 11.8773 12 10.1379V10.124C12 8.81428 10.9606 7.82328 9.63956 7.75398V7.70547C10.7393 7.55994 11.5775 6.65904 11.5775 5.52945V5.51559C11.5775 3.95634 10.4174 3 8.49958 3H4V13ZM7.84912 4.79487C8.68064 4.79487 9.17687 5.21067 9.17687 5.90367V5.91753C9.17687 6.66597 8.65381 7.10949 7.66806 7.10949H6.46102V4.79487H7.84912ZM7.84912 8.71033C8.92875 8.71033 9.49874 9.14692 9.49874 9.94387V9.95773C9.49874 10.7685 8.92875 11.2051 7.92288 11.2051H6.46102V8.71033H7.84912Z"></path></svg>
    </button>
    `;
    item.className = "bold-item";
    return item;
  },
});
const ab = buildMenuItems(mySchema).inlineMenu;
const doc = DOMParser.fromSchema(schema).parse(document.createElement("div"));
let selectionSizePlugin = new Plugin({
  view(editorView) {
    return new DecorationTooltip(editorView);
  },
});
const plugins = [
  history(),
  keymap({ "Mod-z": undo, "Mod-y": redo }),
  keymap(baseKeymap),
  selectionMenu({ content: [menuitems] }),
  // tooltipMenuPlugin,
];

export default function Editor({ content }) {
  const editorRef = useRef(null);
  const editorDom = useRef(null);
  //   const [editorState, setEditorState] = useState(() =>
  //   EditorState.fromJSON({
  //     schema: schema,
  //     doc: content
  //   })
  // );

  // useEffect(()=>{
  //   console.log(editorState)
  // },[editorState])

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
