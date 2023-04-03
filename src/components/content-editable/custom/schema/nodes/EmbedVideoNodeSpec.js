const EmbedVideoNodeSpec = {
    inline: true,
    attrs: {
      style: {default: 'width:100%; pointer-events:none;'},
      contenteditable: {default: false},
      src: {default: ''},
      allowFullscreen: {default: true},
      allow: {default: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"},
    },
    group: 'inline',
    draggable: true,
    parseDOM: [{tag: 'iframe[src]', getAttrs}],
    toDOM(node) {
      return [ 'div', { class: 'embed-video-container' }, ['iframe',node.attrs] ]
    },
  };

  function getAttrs(dom) {
    return {
      src: dom.getAttribute('src') || null,
    };
  }

export default EmbedVideoNodeSpec;
