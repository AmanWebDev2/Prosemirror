const VideoClipNodeSpec = {
    inline: true,
    attrs: {
      src: {default: null},
      poster: {default: ''},
      controls: {default: 'pause play mute'},
      style: {default: 'width:100%'}
    },
    isolating:true,
    group: 'inline',
    draggable: true,
    parseDOM: [{tag: 'video[src]', getAttrs}],
    toDOM(node) {
      return [ 'div', { class: 'video-clip-container' }, ['video',node.attrs] ]
    },
  };

  function getAttrs(dom) {
    return {
      src: dom.getAttribute('src') || null,
      poster: dom.getAttribute('poster') || null,
    };
  }
export default VideoClipNodeSpec;
