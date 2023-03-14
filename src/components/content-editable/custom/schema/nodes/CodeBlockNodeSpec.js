const PRE_DOM = ["pre", ["code", 0]];
const CodeBlockNodeSpec = {
  attrs: {
    id: { default: null },
  },
  content: "inline*",
  group: "block",
  marks: "_",
  code: true,
  defining: true,
  parseDOM: [{ tag: "pre", preserveWhitespace: "full" }],
  toDOM() {
    return PRE_DOM;
  },
};

export default CodeBlockNodeSpec;
