import { Schema } from "prosemirror-model"
import HeadingNodeSpec from "./marks/HeadingNodeSpecs"
import ParagraphNodeSpec from "./marks/ParagraphNodeSpecs"
import * as MarkNames from './marks/Names'
import FontSizeMarkSpec from "./marks/FontSizeMarkSpecs"
import StrongMarkSpec from "./marks/StrongMarkSpecs"
import EMMarkSpec from "./marks/EMMarkSpecs"
import CodeMarkSpec from "./marks/CodeMarksSpecs"
import headingOneSpec from "./marks/HeadingOneSpecs"
const blockquoteDOM = ["blockquote", 0],
      hrDOM = ["hr"], preDOM = ["pre",0],
      brDOM = ["br"]


const {
  MARK_CODE,
  MARK_EM,
  MARK_FONT_SIZE,
  MARK_STRONG,
  HEADING_ONE
} = MarkNames;

/// [Specs](#model.NodeSpec) for the nodes defined in this schema.
export const nodes = {
  /// NodeSpec The top level document node.
  doc: {
    content: "block+"
  } ,
  paragraph: ParagraphNodeSpec ,

  /// A blockquote (`<blockquote>`) wrapping one or more blocks.
  blockquote: {
    content: "block+",
    group: "block",
    defining: true,
    parseDOM: [{tag: "blockquote"}],
    toDOM() { return blockquoteDOM }
  },

  /// A horizontal rule (`<hr>`).
  horizontal_rule: {
    group: "block",
    parseDOM: [{tag: "hr"}],
    toDOM() { return hrDOM }
  } ,

  /// A heading textblock, with a `level` attribute that
  /// should hold the number 1 to 6. Parsed and serialized as `<h1>` to
  /// `<h6>` elements.
  heading: HeadingNodeSpec,

  /// A code listing. Disallows marks or non-text inline
  /// nodes by default. Represented as a `<pre>` element with a
  /// `<code>` element inside of it.
  code_block: {
    content: "text*",
    marks: "",
    group: "block",
    defining: true,
    parseDOM: [{tag: "pre", preserveWhitespace: "full"}],
    toDOM() { return preDOM }
  } ,

  /// The text node.
  text: {
    group: "inline"
  },

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
  hard_break: {
    inline: true,
    group: "inline",
    selectable: false,
    parseDOM: [{tag: "br"}],
    toDOM() { return brDOM }
  }
}



const marks = {
  // Link mark should be rendered first.
  // https://discuss.prosemirror.net/t/prevent-marks-from-breaking-up-links/401/5
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