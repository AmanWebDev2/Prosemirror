import { Schema } from "prosemirror-model"

import * as MarkNames from './marks/Names'

import FontSizeMarkSpec from "./marks/FontSizeMarkSpec"
import StrongMarkSpec from "./marks/StrongMarkSpec"
import headingOneSpec from "./marks/HeadingOneSpec"
import CodeMarkSpec from "./marks/CodeMarksSpec"
import EMMarkSpec from "./marks/EMMarkSpec"

import CodeBlockNodeSpec from "./nodes/CodeBlockNodeSpec"
import ParagraphNodeSpec from "./nodes/ParagraphNodeSpec"
import HeadingNodeSpec from "./nodes/HeadingNodeSpec"
import DocNodeSpec from "./nodes/DocNodeSpec"
import TextNodeSpec from "./nodes/TextNodeSpec"
import HardBreakNodeSpec from "./nodes/HardBreakNodeSpec"
import { CODE_BLOCK, DOC, HARD_BREAK, HEADING, PARAGRAPH,TEXT } from "./nodes/Names"
import LinkMarkSpec from "./marks/LinkMarkSpec"

const {
  MARK_CODE,
  MARK_EM,
  MARK_FONT_SIZE,
  MARK_STRONG,
  HEADING_ONE,
  MARK_LINK
} = MarkNames;

/// [Specs](#model.NodeSpec) for the nodes defined in this schema.
export const nodes = {
  /// NodeSpec The top level document node.
  [DOC]: DocNodeSpec ,
  [PARAGRAPH]: ParagraphNodeSpec ,
  [HEADING]: HeadingNodeSpec,
  [CODE_BLOCK]: CodeBlockNodeSpec,
  [TEXT]: TextNodeSpec,
  [HARD_BREAK]: HardBreakNodeSpec,
 

  /// An inline image (`<img>`) node. Supports `src`,
  /// `alt`, and `href` attributes. The latter two default to the empty
  /// string.
  image: {
    inline: true,
    attrs: {
      src: {},
      alt: {default: null},
      title: {default: null}
    },
    group: "inline",
    draggable: true,
    parseDOM: [{tag: "img[src]", getAttrs(dom) {
      return {
        src: dom.getAttribute("src"),
        title: dom.getAttribute("title"),
        alt: dom.getAttribute("alt")
      }
    }}],
    toDOM(node) { let {src, alt, title} = node.attrs; return ["img", {src, alt, title}] }
  },

  /// A hard line break, represented in the DOM as `<br>`.
}



const marks = {
  // Link mark should be rendered first.
  // https://discuss.prosemirror.net/t/prevent-marks-from-breaking-up-links/401/5
  [MARK_LINK]: LinkMarkSpec,
  [MARK_FONT_SIZE]: FontSizeMarkSpec,
  [MARK_STRONG]: StrongMarkSpec,
  [MARK_EM]: EMMarkSpec,
  [MARK_CODE]: CodeMarkSpec,
  [HEADING_ONE]: headingOneSpec,
  // [MARK_LINK]: LinkMarkSpec,
  // [MARK_NO_BREAK]: TextNoWrapMarkSpec,
  // [MARK_FONT_TYPE]: FontTypeMarkSpec,
  // [MARK_SPACER]: SpacerMarkSpec,
  // [MARK_STRIKE]: StrikeMarkSpec,
  // [MARK_UNDERLINE]: TextUnderlineMarkSpec,
};


/// This schema roughly corresponds to the document schema used by
/// [CommonMark](http://commonmark.org/), minus the list elements,
/// which are defined in the [`prosemirror-schema-list`](#schema-list)
/// module.
///
/// To reuse elements from this schema, extend or read from its
/// `spec.nodes` and `spec.marks` [properties](#model.Schema.spec).
export const schema = new Schema({nodes, marks})