const HEADING_ONE_DOM = ['h1', 0];

const headingOneSpec = {
  parseDOM: [{tag: 'h1'}],
  toDOM() {
    return HEADING_ONE_DOM;
  },
};

export default headingOneSpec;