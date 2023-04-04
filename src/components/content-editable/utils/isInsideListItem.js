// @flow

import {LIST_ITEM} from '../custom/schema/nodes/Names';

export default function isInsideListItem(doc, pos) {
  if (doc.nodeSize < 2 || pos < 2) {
    return false;
  }
  const prevNode = doc.nodeAt(pos - 1);
  return prevNode && prevNode.type.name === LIST_ITEM;
}
