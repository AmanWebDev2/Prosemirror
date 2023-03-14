import {BULLET_LIST} from '../custom/schema/nodes/Names';

export default function isBulletListNode(node) {
  return node.type.name === BULLET_LIST;
}
