import {ATTRIBUTE_LIST_STYLE_TYPE} from './ListItemNodeSpec';
import { LIST_ITEM } from './Names';
import {ATTRIBUTE_INDENT, MIN_INDENT_LEVEL} from './ParagraphNodeSpec';

const AUTO_LIST_STYLE_TYPES = ['disc', 'square', 'circle'];

const BulletListNodeSpec = {
  attrs: {
    id: {default: null},
    indent: {default: 0},
    listStyleType: {default: null},
  },
  group: 'block',
  content: LIST_ITEM + '+',
  parseDOM: [
    {
      tag: 'ul',
      getAttrs(dom) {
        const listStyleType =
          dom.getAttribute(ATTRIBUTE_LIST_STYLE_TYPE) || null;

        const indent = dom.hasAttribute(ATTRIBUTE_INDENT)
          ? parseInt(dom.getAttribute(ATTRIBUTE_INDENT), 10)
          : MIN_INDENT_LEVEL;

        return {
          indent,
          listStyleType,
        };
      },
    },
  ],

  toDOM(node) {
    const {indent, listStyleType} = node.attrs;
    const attrs = {};

    if (indent) {
      attrs[ATTRIBUTE_INDENT] = indent;
    }

    if (listStyleType) {
      attrs[ATTRIBUTE_LIST_STYLE_TYPE] = listStyleType;
    }

    let htmlListStyleType = listStyleType;

    if (!htmlListStyleType || htmlListStyleType === 'disc') {
      htmlListStyleType =
        AUTO_LIST_STYLE_TYPES[indent % AUTO_LIST_STYLE_TYPES.length];
    }

    attrs.type = htmlListStyleType;
    return ['ul', attrs, 0];
  },
};

export default BulletListNodeSpec;
