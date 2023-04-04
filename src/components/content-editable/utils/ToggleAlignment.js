import { HEADING, PARAGRAPH } from "../custom/schema/nodes/Names";

export function toggleAlignment(
  tr,
  schema,
  alignment
) {
  const {selection, doc} = tr;
  if (!selection || !doc) {
    return tr;
  }
  const {from, to} = selection;
  const {nodes} = schema;

  // const blockquote = nodes[BLOCKQUOTE];
  // const listItem = nodes[LIST_ITEM];
  const heading = nodes[HEADING];
  const paragraph = nodes[PARAGRAPH];

  const tasks = [];   
  const tasks2 = []; // for toggle
  alignment = alignment || null;

  const allowedNodeTypes = new Set([ heading, paragraph]);

  doc.nodesBetween(from, to, (node, pos, parentNode) => {
    const nodeType = node.type;
    const align = node.attrs.align || null;
    if (align !== alignment && allowedNodeTypes.has(nodeType)) {
      tasks.push({
        node,
        pos,
        nodeType,
      });
    }else if(allowedNodeTypes.has(nodeType)){
      tasks2.push({
        node,
        pos,
        nodeType,
      });
    }
    return true;
  });

  if (tasks2.length) {
    tasks2.forEach(job => {
      const {node, pos, nodeType} = job;
      let {attrs} = node;
      if (alignment)   {
        attrs = {
          ...attrs,
          align: null,
        };
      }
      tr = tr.setNodeMarkup(pos, nodeType, attrs, node.marks);
    });
    return tr;
  }

  tasks.forEach(job => {
    const {node, pos, nodeType} = job;
    let {attrs} = node;
    if (alignment) {
      attrs = {
        ...attrs,
        align: alignment,
      };
    } else {
      attrs = {
        ...attrs,
        align: null,
      };
    }
    tr = tr.setNodeMarkup(pos, nodeType, attrs, node.marks);
  });

  return tr;
}
