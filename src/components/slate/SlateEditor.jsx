import React, { useMemo, useRef, useEffect,useState,useCallback } from 'react'
import { Slate, Editable, withReact, useSlate, useFocused } from 'slate-react'
import isUrl from 'is-url'
import {
  Editor,
  Transforms,
  Text,
  createEditor,
  Descendant,
  Element as SlateElement,
  Range,
} from 'slate'
import { withHistory } from 'slate-history'
import './style.css';
import { Portal } from './Components'
import CodeElement from './customBlocks/CodeElement';
import DefaultElement from './customBlocks/DefaultElement';
import EditableButtonComponent from './customBlocks/EditableButtonComponent';

function CustomSpan({ children }) {
  return <span style={{ fontWeight: 'bold' }}>{children}</span>;
}

const withInlines = editor => {
  const { insertData, insertText, isInline } = editor

  editor.isInline = element =>
    ['link', 'button'].includes(element.type) || isInline(element)

  editor.insertText = text => {
    if (text && isUrl(text)) {
      wrapLink(editor, text)
    } else {
      insertText(text)
    }
  }

  editor.insertData = data => {
    const text = data.getData('text/plain')

    if (text && isUrl(text)) {
      wrapLink(editor, text)
    } else {
      insertData(data)
    }
  }

  return editor
}
const isLinkActive = editor => {
  const [link] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
  })
  return !!link
}


const unwrapLink = editor => {
  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
  })
}

const wrapLink = (editor, url) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor)
  }

  const { selection } = editor
  const isCollapsed = selection && Range.isCollapsed(selection)
  const link = {
    type: 'link',
    url,
    children: isCollapsed ? [{ text: url }] : [],
  }

  if (isCollapsed) {
    Transforms.insertNodes(editor, link)
  } else {
    Transforms.wrapNodes(editor, link, { split: true })
    Transforms.collapse(editor, { edge: 'end' })
  }
}

const SlateEditor = () => {
  const [value, setValue] = useState([
    ...initialValue,
  ]);
  // const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const editor = useMemo(
    () => withInlines(withHistory(withReact(createEditor()))),
    []
  )
  const handleInsertCustomSpan = () => {
    const span = {
      type: 'customSpan',
      children: [{ text: 'Custom Span' }],
    };
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [node] = Editor.node(editor, selection);
      // if (node.type === 'paragraph') {
        const [textNode, textPath] = Editor.texts(editor, selection);
        const offset = selection.focus.offset;
        const splitOffset = offset === 0 ? 0 : offset - 1;
        const beforeText = { ...textNode, text: textNode.text.slice(0, splitOffset) };
        const afterText = { ...textNode, text: textNode.text.slice(splitOffset) };
        const spanNode = { ...span, children: [afterText] };
        Transforms.insertNodes(editor, spanNode, { at: textPath.concat(offset) });
        Transforms.insertNodes(editor, { text: beforeText.text }, { at: textPath.concat(splitOffset) });
        Transforms.removeNodes(editor, { at: textPath });
      // }
    }
  };
  const handleGetValue = () => {
    if (value) {
      const editorValue = Editor.string(editor, value);
      console.log(editorValue);
    }
  };
    // Define a rendering function based on the element passed to `props`. We use
  // `useCallback` here to memoize the function for subsequent renders.
  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      case 'customSpan':
        return <CustomSpan {...props} />
        case 'button':
          return <EditableButtonComponent {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])
  return (
    <Slate editor={editor} value={value}>
       <button onClick={handleInsertCustomSpan}>Insert Custom Span</button>
       <button onClick={handleGetValue}>Get Editor Value</button>
       <ToggleEditableButtonButton/>
      <HoveringToolbar />
      <Editable
      style={{ minHeight: '200px', backgroundColor: '#f8f8f8',padding:'12px',borderRadius:'12px',margin:'3px' }} 
        renderLeaf={props => <Leaf {...props} />}
        placeholder="Enter some text..."
        value={value} onChange={(value) => setValue(value)}
        renderElement={renderElement}
        onDOMBeforeInput={(event) => {
          switch (event.inputType) {
            case 'formatBold':
              event.preventDefault()
              return toggleFormat(editor, 'bold')
            case 'formatItalic':
              event.preventDefault()
              return toggleFormat(editor, 'italic')
            case 'formatUnderline':
              event.preventDefault()
              return toggleFormat(editor, 'underlined')
            default:
              break;
          }
        }}
      />
    </Slate>
  )
}

const toggleFormat = (editor, format) => {
  const isActive = isFormatActive(editor, format)
  Transforms.setNodes(
    editor,
    { [format]: isActive ? null : true },
    { match: Text.isText, split: true }
  )
}

const isFormatActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: n => n[format] === true,
    mode: 'all',
  })
  return !!match
}

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underlined) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

const HoveringToolbar = () => {
  const ref = useRef();
  const editor = useSlate()
  const inFocus = useFocused()

  useEffect(() => {
    const el = ref.current
    const { selection } = editor

    if (!el) {
      return
    }

    if (
      !selection ||
      !inFocus ||
      (!Range && !Range.isCollapsed && Range.isCollapsed(selection)) ||
      Editor.string(editor, selection) === ''
    ) {
      el.removeAttribute('style')
      return
    }

    const domSelection = window.getSelection()
    const domRange = domSelection.getRangeAt(0)
    const rect = domRange.getBoundingClientRect()
    el.style.opacity = '1'
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`
    el.style.left = `${rect.left +
      window.pageXOffset -
      el.offsetWidth / 2 +
      rect.width / 2}px`
  })

  return (
    <>
    <Portal>
      <div
        ref={ref}
        className='menu'
        onMouseDown={e => {
          // prevent toolbar from taking focus away from editor
          e.preventDefault()
        }}
      >
        <FormatButton format="bold" icon="format_bold" />
        <FormatButton format="italic" icon="format_italic" />
        <FormatButton format="underlined" icon="format_underlined" />
      </div>
    </Portal>
    </>
  )
}

const FormatButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <button
      reversed
      active={isFormatActive(editor, format)}
      onClick={() => toggleFormat(editor, format)}
    >
      {format}
      {/* <Icon>{icon}</Icon> */}
    </button>
  )
}

const isButtonActive = editor => {
  const [button] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'button',
  })
  return !!button
}

const unwrapButton = editor => {
  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'button',
  })
}

const insertButton = editor => {
  if (editor.selection) {
    wrapButton(editor)
  }
}

const wrapButton = editor => {
  if (isButtonActive(editor)) {
    unwrapButton(editor)
  }

  const { selection } = editor
  const isCollapsed = selection && Range.isCollapsed(selection)
  const button = {
    type: 'button',
    children: isCollapsed ? [{ text: 'Edit me!' }] : [],
  }

  if (isCollapsed) {
    Transforms.insertNodes(editor, button)
  } else {
    Transforms.wrapNodes(editor, button, { split: true })
    Transforms.collapse(editor, { edge: 'end' })
  }
}

const ToggleEditableButtonButton = () => {
  const editor = useSlate()
  return (
    <button
      active
      onMouseDown={event => {
        event.preventDefault()
        if (isButtonActive(editor)) {
          unwrapButton(editor)
        } else {
          insertButton(editor)
        }
      }}
    >
      add-span
      {/* <Icon>smart_button</Icon> */}
    </button>
  )
}

const initialValue = [
  {
    type: 'paragraph',
    children: [
      {
        text:
          'This example shows how you can make a hovering menu appear above your content, which you can use to make text ',
      },
      { text: 'bold', bold: true },
      { text: ', ' },
      { text: 'italic', italic: true },
      { text: ', or anything else you might want to do!' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      { text: 'Try it out yourself! Just ' },
      { text: 'select any piece of text and the menu will appear', bold: true },
      { text: '.' },
    ],
  },
]

export default SlateEditor;
