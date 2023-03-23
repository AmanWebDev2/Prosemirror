import { editorDOMEvents } from "./editorDOMEvents";
import { selectionMenu } from "./selectionMenu";
import { keymap } from "prosemirror-keymap";
import { undo, redo, history } from "prosemirror-history";
import { baseKeymap } from "prosemirror-commands";
import SelectionPlaceholderPlugin from "./SelectionPlaceholderPlugin";
import { editorUpdateObserver } from "./editorUpdateObserver";
import { tooltipMenuItems } from "../custom/menu/menuItems";
import { rulseSetAttribute } from "./rulseSetAttribute";
import { buildKeymap } from "./keyMap";
import { prosmirrorSchema } from "../custom/schema/schema";

export const plugins = [
  new SelectionPlaceholderPlugin(),
  // rulseSetAttribute(),
  history(),
  keymap({ "Mod-z": undo, "Mod-y": redo }),
  keymap(buildKeymap(prosmirrorSchema)),
  keymap(baseKeymap),
  selectionMenu({ content: [tooltipMenuItems] }),
  editorDOMEvents(),
  editorUpdateObserver(),
];
