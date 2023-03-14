import ParagraphNodeSpec, {
  getParagraphNodeAttrs,
  toParagraphDOM,
} from "./ParagraphNodeSpec";
const TAG_NAME_TO_LEVEL = {
  H1: 1,
  H2: 2,
};

const HeadingNodeSpec = {
  ...ParagraphNodeSpec,
  attrs: {
    ...ParagraphNodeSpec.attrs,
    level: { default: 1 },
  },
  defining: true,
  parseDOM: [
    { tag: "h1", getAttrs },
    { tag: "h2", getAttrs },
    { tag: "h3", getAttrs },
    { tag: "h4", getAttrs },
    { tag: "h5", getAttrs },
    { tag: "h6", getAttrs },
  ],
  toDOM,
};

function getAttrs(dom) {
  const attrs = getParagraphNodeAttrs(dom);
  const level = TAG_NAME_TO_LEVEL[dom.nodeName.toUpperCase()] || 1;
  attrs.level = level;
  return attrs;
}

function toDOM(node) {
  const dom = toParagraphDOM(node);
  const level = node.attrs.level || 1;
  dom[0] = `h${level}`;
  return dom;
}

export default HeadingNodeSpec;
