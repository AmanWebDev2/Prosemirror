import { tooltipMenuItems } from "../custom/menuItems";
import { editorDOMEvents } from "./editorDOMEvents";
import { selectionMenu } from "./selectionMenu";
import { keymap } from "prosemirror-keymap";
import { undo, redo, history } from "prosemirror-history";
import { baseKeymap } from "prosemirror-commands";

export const plugins = [
    history(),
    keymap({ "Mod-z": undo, "Mod-y": redo }),
    keymap(baseKeymap),
    selectionMenu({ content: [tooltipMenuItems] }),
    editorDOMEvents(),
  
  ];