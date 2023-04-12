import { keymap } from "prosemirror-keymap";
import { undo, redo, history } from "prosemirror-history";
import { baseKeymap } from "prosemirror-commands";

import { editorDOMEvents } from "./editorDOMEvents";
import { selectionMenu } from "./selectionMenu";
import { editorUpdateObserver } from "./editorUpdateObserver";
import { tooltipMenuItems } from "../custom/menu/menuItems";
import { buildKeymap } from "./keyMap";
import { prosmirrorSchema } from "../custom/schema/schema";
import { buildInputRules } from "../utils/inputRules";
import { isIframe } from "../utils/isFrame";
import placeholderPlugin  from "./placeholder";

export const plugins = [
  history(),
  placeholderPlugin,
  keymap({ "Mod-z": undo, "Mod-y": redo }),
  keymap(buildKeymap(prosmirrorSchema)),
  keymap(baseKeymap),
  selectionMenu({
    content: [tooltipMenuItems],
    iframe: isIframe,
    elementClassNameToHandlingMenuPositionOnScroll: "scroll",
  }),
  // toggle hideblockInserter
  editorDOMEvents({ iframe: isIframe,hideBlockInserter: false }),
  editorUpdateObserver(),
  buildInputRules(prosmirrorSchema),
];
