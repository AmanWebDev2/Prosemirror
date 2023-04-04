const CODE_DOM = ['code', 0];

const CodeMarkSpec = {
  parseDOM: [{tag: 'code'}],
  toDOM() {
    return CODE_DOM;
  },
};

export default CodeMarkSpec;