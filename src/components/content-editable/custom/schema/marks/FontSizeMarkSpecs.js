import { toClosestFontPtSize } from "../../../utils/convertToCSSPTValue";

const FontSizeMarkSpec = {
    attrs: {
      pt: {default: null},
    },
    inline: true,
    group: 'inline',
    parseDOM: [
      {
        style: 'font-size',
        getAttrs: getAttrs,
      },
    ],
    toDOM(node) {
      const {pt} = node.attrs;
      const domAttrs = pt
        ? {
            style: `font-size: ${pt}pt;`,
            class: 'czi-font-size-mark',
          }
        : null;
  
      return ['span', domAttrs, 0];
    },
  };

  function getAttrs(fontSize) {
    const attrs = {};
    if (!fontSize) {
      return attrs;
    }
  
    const ptValue = toClosestFontPtSize(fontSize);
    if (!ptValue) {
      return attrs;
    }
    return {
      pt: ptValue,
    };
  }

export default FontSizeMarkSpec;
