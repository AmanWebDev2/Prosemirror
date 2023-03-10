import {TextSelection} from 'prosemirror-state';

import {MARK_LINK} from '../custom/schema/marks/Names';
import { CODE_BLOCK, HEADING, PARAGRAPH} from '../custom/schema/nodes/Names';
// import clearMarks from './clearMarks';
import compareNumber from './compareNumber';
import isListNode from './isListNode';

export default function toggleCodeBlock(
  tr,
  schema
) {
  const {nodes} = schema;
  const {selection, doc} = tr;
  const codeBlock = nodes[CODE_BLOCK];
  const paragraph = nodes[PARAGRAPH];
  const heading = nodes[HEADING];
  if (!selection || !doc || !codeBlock || !paragraph) {
    return tr;
  }

  const poses = [];
  const {from, to} = tr.selection;
  let allowed = true;
  let startWithCodeBlock = null;
  doc.nodesBetween(from, to, (node, pos) => {
    const nodeType = node.type;
    if (startWithCodeBlock === null) {
      startWithCodeBlock = nodeType === codeBlock;
    }
    const {type, isBlock} = node;
    if (isBlock) {
      allowed =
        allowed &&
        (type === paragraph ||
          type === codeBlock ||
          type === heading );
      allowed && poses.push(pos);
    }

    return isBlock;
  });

  // Update from the bottom to avoid disruptive changes in pos.
  allowed &&
    poses
      .sort(compareNumber)
      .reverse()
      .forEach(pos => {
        tr = setCodeBlockNodeEnabled(
          tr,
          schema,
          pos,
          startWithCodeBlock ? false : true
        );
      });
  return tr;
}

function setCodeBlockNodeEnabled(
  tr,
  schema,
  pos,
  enabled
) {
  const {doc} = tr;
  if (!doc) {
    return tr;
  }

  const node = doc.nodeAt(pos);
  if (!node) {
    return tr;
  }
  if (isListNode(node)) {
    return tr;
  }

  const {nodes} = schema;
  const codeBlock = nodes[CODE_BLOCK];
  const paragraph = nodes[PARAGRAPH];

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
