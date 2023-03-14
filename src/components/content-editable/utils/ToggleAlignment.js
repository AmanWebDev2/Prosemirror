import compareNumber from "./compareNumber";
import isInsideListItem from "./isInsideListItem";
import {TextSelection} from 'prosemirror-state';
import isListNode from "./isNodeList";
import { BLOCKQUOTE, CODE_BLOCK, HEADING, PARAGRAPH } from "../custom/schema/nodes/Names";
import { MARK_LINK } from "../custom/schema/marks/Names";

export default function toggleAlignment(
    tr,
    schema,
    alignment
  ) {
    const {nodes} = schema;
    const {selection, doc} = tr;
    const heading = nodes[HEADING];
    const paragraph = nodes[PARAGRAPH];
    let allowed = true;
    const tasks = [];
    const poses = [];
    alignment = alignment || null;
  
    const allowedNodeTypes = new Set([ heading, paragraph]);
    const {from, to} = selection;
    doc.nodesBetween(from, to, (node, pos, parentNode) => {
      const nodeType = node.type;
      const align = node.attrs.align || null;
      if (align !== alignment && allowedNodeTypes.has(nodeType)) {
        tasks.push({
          node,
          pos,
          nodeType,
        });
      }
      return true;
    });
    if (!tasks.length) {
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
  }
  

  
function setHeadingNode(
    tr,
    schema,
    pos,
    enabled
  ) {
    const {nodes} = schema;
    const heading = nodes[HEADING];
    const blockquote = nodes[BLOCKQUOTE];
    const paragraph = nodes[PARAGRAPH];
    if (pos >= tr.doc.content.size) {
      // Workaround to handle the edge case that pos was shifted caused by `toggleList`.
      return tr;
    }
    const node = tr.doc.nodeAt(pos);
    if (!node || !heading || !paragraph) {
      return tr;
    }
    const nodeType = node.type;
    const codeBlock = nodes[CODE_BLOCK];
  
    if (codeBlock && !enabled && node.type === codeBlock) {
      tr = tr.setNodeMarkup(pos, paragraph, node.attrs, node.marks);
    } else if (enabled && node.type !== codeBlock) {
      const {selection} = tr;
      tr = tr.setSelection(
        TextSelection.create(tr.doc, pos, pos + node.nodeSize)
      );
      // tr = clearMarks(tr, schema);
      tr = tr.removeMark(pos, pos + node.nodeSize, schema.marks[MARK_LINK]);
      tr = tr.setSelection(selection);
      tr = tr.setNodeMarkup(pos, codeBlock, node.attrs, node.marks);
    }
    return tr;
  }