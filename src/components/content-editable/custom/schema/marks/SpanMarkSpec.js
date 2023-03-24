export const SpanMarkSpec = {
    attrs: {
      align: { default: null },
      class: { default: "highlight" },
      style: { default: "background-color: yellow" },
      contenteditable: { default: "false" }
    },
    parseDOM: [
      {
        tag: 'span[data-align]',
        getAttrs: (dom) => ({
          align: dom.getAttribute('data-align'),
        }),
      },
    ],
    toDOM: (mark) => {
      const attrs = { 'data-align': mark.attrs.align };
      return ['span', attrs, 0];
    },
  };