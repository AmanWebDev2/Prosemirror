import { editorDOMEvents } from "./editorDOMEvents";
import { selectionMenu } from "./selectionMenu";
import { keymap } from "prosemirror-keymap";
import { undo, redo, history } from "prosemirror-history";
import { baseKeymap } from "prosemirror-commands";
import { editorUpdateObserver } from "./editorUpdateObserver";
import { tooltipMenuItems } from "../custom/menu/menuItems";
import { buildKeymap } from "./keyMap";
import { prosmirrorSchema } from "../custom/schema/schema";
import { rulseSetAttribute } from "./rulseSetAttribute";
import SelectionPlaceholderPlugin from "./SelectionPlaceholderPlugin";

export const plugins = [
  // new SelectionPlaceholderPlugin(),
  // rulseSetAttribute(),
  history(),
  keymap({ "Mod-z": undo, "Mod-y": redo }),
  keymap(buildKeymap(prosmirrorSchema)),
  keymap(baseKeymap),
  selectionMenu({ content: [tooltipMenuItems] }),
  editorDOMEvents(),
  editorUpdateObserver(),
];
