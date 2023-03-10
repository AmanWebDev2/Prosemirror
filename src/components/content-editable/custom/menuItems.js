import {Plugin} from "prosemirror-state"
import MenuView from "./MenuView"
import {toggleMark, setBlockType, wrapIn} from "prosemirror-commands"
import {schema} from "prosemirror-schema-basic"

// Helper function to create menu icons
function icon(text, name) {
  let span = document.createElement("span")
  span.className = "menuicon " + name
  span.title = name
  span.textContent = text
  return span
}

// Create an icon for a heading at the given level
function heading(level) {
  return {
    command: setBlockType(schema.nodes.heading, {level}),
    dom: icon("H" + level, "heading")
  }
}

export const tooltipMenuPlugin = menuPlugin([
  {command: toggleMark(schema.marks.strong), dom: icon("B", "strong")},
  {command: toggleMark(schema.marks.em), dom: icon("i", "em")},
  {command: setBlockType(schema.nodes.paragraph), dom: icon("p", "paragraph")},
  heading(1), heading(2), heading(3),
  {command: wrapIn(schema.nodes.blockquote), dom: icon(">", "blockquote")}
])

function menuPlugin(items) {
  return new Plugin({
    view(editorView) {
      let menuView = new MenuView(items, editorView)
      editorView.dom.parentNode.insertBefore(menuView.dom, editorView.dom)
      return menuView
    }
  })
}
