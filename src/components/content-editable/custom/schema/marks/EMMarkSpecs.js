const EM_DOM = ['em', 0];

const EMMarkSpec = {
  parseDOM: [{tag: 'i'}, {tag: 'em'}, {style: 'font-style=italic'}],
  toDOM() {
    return EM_DOM;
  },
};

export default EMMarkSpec;