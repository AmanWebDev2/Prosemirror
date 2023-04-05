import { attributes } from "../../../../../data/attributes";

const AttributeSpanNodeSpec = {
  attrs: {
    // define attributes for the span node
    class: { default: "kudoshub-template" },
    style: { default: " " },
    contenteditable: { default: "false" },
    "data-template-fallback": {default: ""},
    "data-template-identifier":{default: ""},
    "data-template-display":{default: ""}
  },
  group: "inline",
  inline: true,
  selectable: true,
  parseDOM: [{ tag: "span" }],
  getAttrs(node) {
    return {
      class: 'my-class',
      'data-template-fallback': node.attrs["data-template-fallbacks"],
    }
  },
  toDOM: (function(node){
    const span = document.createElement('span');
    const templateIdentifier = node.attrs['data-template-identifier']; 
    const templateIdentifierDisplay = node.attrs['data-template-display']; 
    
    if(templateIdentifierDisplay) {
      span.textContent = templateIdentifierDisplay + '\uFEFF' // Add zero-width non-breaking space at the end
    }else {
      if(!templateIdentifier) return span;
      const val = attributes.find(attribute => attribute.key === templateIdentifier);
      span.textContent = val.display + '\uFEFF' // Add zero-width non-breaking space at the end
    }
    for (const [name, value] of Object.entries(node.attrs)) {
      if (value !== undefined) {
        span.setAttribute(name, value)
      }
    }
    return span
    }),
};

export default AttributeSpanNodeSpec;