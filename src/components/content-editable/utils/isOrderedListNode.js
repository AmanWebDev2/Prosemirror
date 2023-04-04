import {ORDERED_LIST} from '../custom/schema/nodes/Names';

export default function isOrderedListNode(node) {
  return node.type.name === ORDERED_LIST;
}
