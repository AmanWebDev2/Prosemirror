import { editorDOMEvents } from "./editorDOMEvents";
import { selectionMenu } from "./selectionMenu";
import { keymap } from "prosemirror-keymap";
import { undo, redo, history } from "prosemirror-history";
import { baseKeymap } from "prosemirror-commands";
import SelectionPlaceholderPlugin from "./SelectionPlaceholderPlugin";
import { editorUpdateObserver } from "./editorUpdateObserver";
import { tooltipMenuItems } from "../custom/menu/menuItems";

export const plugins = [
   // Plugin to let user edit link's url inline.
  //  new LinkTooltipPlugin(),
   new SelectionPlaceholderPlugin(),
    history(),
    keymap({ "Mod-z": undo, "Mod-y": redo }),
    keymap(baseKeymap),
    selectionMenu({ content: [tooltipMenuItems] }),
    editorDOMEvents(),
    editorUpdateObserver()
  
  ];