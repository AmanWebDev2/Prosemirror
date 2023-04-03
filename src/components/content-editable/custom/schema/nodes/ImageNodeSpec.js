const ImageNodeSpec = {
    attrs: {
      align: {default: null},
      alt: {default: ''},
      "data-height": {default: null},
      "data-link-url": {default: null},
      "data-width": {default: null},
      src: {default: null},
      title: {default: ''},
    },
    isolating:true,
    inline: false,
    group: 'block',
    draggable: true,
    parseDOM: [{tag: 'img[src]', getAttrs}],
    toDOM(node) {
    //   return ['img', node.attrs];
      return [ 'div', { class: 'image-container' }, ['img',node.attrs] ]
    },
  };

  function getAttrs(dom) {
    return {
      alt: dom.getAttribute('alt') || null,
      src: dom.getAttribute('src') || null,
      title: dom.getAttribute('title') || null,
    };
  }
export default ImageNodeSpec;
