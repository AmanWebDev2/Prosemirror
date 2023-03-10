import React, { useEffect, useRef } from "react";
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
import { menu, tooltipMenuPlugin } from "./custom/menuItems";

export const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
  marks: schema.spec.marks,
});

function icon(text, name) {
  let span = document.createElement("span")
  span.className = "menuicon " + name
  span.title = name
  span.textContent = text
  return span
}

const strong = new MenuItem({
  title: "Toggle strong style", icon: icons.strong,
  // active(state) { return markActive(state, markType) },
  enable(state) { return true },
  run(state, dispatch, view) {
    console.log(view);
    // if (markActive(state, markType)) {
      toggleMark(schema.marks.strong)(state, dispatch)
      return true
    // }
  }
  });
  const ab = buildMenuItems(mySchema).inlineMenu;
  console.log(ab)
  console.log([[strong]]);

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
  selectionMenu({content:[[strong]]}),
  // tooltipMenuPlugin,
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
    // Define your custom tooltip content
  }, []);

  return <div id="editor" ref={editorDom} />;
}
