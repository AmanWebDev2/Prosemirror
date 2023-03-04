import React,{ useEffect, useRef } from "react";
import { EditorState } from "prosemirror-state";
import { EditorView ,} from "prosemirror-view";
import { Schema, DOMParser } from "prosemirror-model";
import { schema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";
import { exampleSetup } from "prosemirror-example-setup";
import Frame from 'react-frame-component'
import DecorationTooltip from "./DecorationToolTip";
import {Plugin} from "prosemirror-state"
const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
  marks: schema.spec.marks
});

const doc = DOMParser.fromSchema(mySchema).parse(document.createElement("div"));
let selectionSizePlugin = new Plugin({
  view(editorView) { return new DecorationTooltip(editorView) }
})
const plugins = exampleSetup({ schema: mySchema }).concat(selectionSizePlugin);

export default function Editor() {
  const editorRef = useRef(null);
  const editorDom = useRef(null);

  useEffect(() => {
    if (editorRef.current) return;
    editorRef.current = new EditorView(editorDom.current, {
      state: EditorState.create({ doc, plugins })
    });

  }, []);

  return (
    <div id="editor" ref={editorDom} />
  );
}
