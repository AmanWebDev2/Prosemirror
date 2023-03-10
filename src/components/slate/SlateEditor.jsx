import React, {
  useMemo,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";
 
import isUrl from "is-url";
import imageExtensions from "image-extensions";
import {
  Editor,
  Transforms,
  Text,
  createEditor,
  Descendant,
  Element as SlateElement,
  Range,
} from "slate";
import { withHistory } from "slate-history";
import "./style.css";
import { Portal } from "./Components";
import CodeElement from "./customBlocks/CodeElement";
import DefaultElement from "./customBlocks/DefaultElement";
import EditableButtonComponent from "./customBlocks/EditableButtonComponent";
import { CHARACTERS } from "./mentions-name";

function CustomSpan({ children }) {
  return <span style={{ fontWeight: "bold" }}>{children}</span>;
}

const withInlines = (editor) => {
  const { insertData, insertText, isInline } = editor;

  editor.isInline = (element) =>
    ["link", "button"].includes(element.type) || isInline(element);

  editor.insertText = (text) => {
    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data) => {
    const text = data.getData("text/plain");

    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};
const withImages = (editor) => {
  const { insertData, isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === "image" ? true : isVoid(element);
  };

  editor.insertData = (data) => {
    const text = data.getData("text/plain");
    const { files } = data;

    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader();
        const [mime] = file.type.split("/");

        if (mime === "image") {
          reader.addEventListener("load", () => {
            const url = reader.result;
            insertImage(editor, url);
          });

          reader.readAsDataURL(file);
        }
      }
    } else if (isImageUrl(text)) {
      insertImage(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

const isImageUrl = (url) => {
  if (!url) return false;
  if (!isUrl(url)) return false;
  const ext = new URL(url).pathname.split(".").pop();
  return imageExtensions.includes(ext);
};

const insertImage = (editor, url) => {
  const text = { text: "" };
  const image = { type: "image", url, children: [text] };
  Transforms.insertNodes(editor, image);
};

const withMentions = (editor) => {
  const { isInline, isVoid, markableVoid } = editor;

  editor.isInline = (element) => {
    return element.type === "mention" ? true : isInline(element);
  };

  editor.isVoid = (element) => {
    return element.type === "mention" ? true : isVoid(element);
  };

  editor.markableVoid = (element) => {
    return element.type === "mention" || markableVoid(element);
  };

  return editor;
};

const insertMention = (editor, character) => {
  const mention = {
    type: "mention",
    character,
    children: [{ text: "" }],
  };
  Transforms.insertNodes(editor, mention);
  Transforms.move(editor);
};

const isLinkActive = (editor) => {
  const [link] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
  });
  return !!link;
};

const unwrapLink = (editor) => {
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
  });
};

const wrapLink = (editor, url) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link = {
    type: "link",
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: "end" });
  }
};

const SlateEditor = () => {
  const [value, setValue] = useState([...initialValue]);
  const [target, setTarget] = useState()
  const [index, setIndex] = useState(0)
  const [search, setSearch] = useState('')
  const ref = useRef()
  // const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const editor = useMemo(
    () =>
      withEmbeds(
        withMentions(withImages(withInlines(withHistory(withReact(createEditor())))))
      ),
    []
  );

  const handleInsertCustomSpan = () => {
    const span = {
      type: "customSpan",
      children: [{ text: "Custom Span" }],
    };
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [node] = Editor.node(editor, selection);
      // if (node.type === 'paragraph') {
      const [textNode, textPath] = Editor.texts(editor, selection);
      const offset = selection.focus.offset;
      const splitOffset = offset === 0 ? 0 : offset - 1;
      const beforeText = {
        ...textNode,
        text: textNode.text.slice(0, splitOffset),
      };
      const afterText = { ...textNode, text: textNode.text.slice(splitOffset) };
      const spanNode = { ...span, children: [afterText] };
      Transforms.insertNodes(editor, spanNode, { at: textPath.concat(offset) });
      Transforms.insertNodes(
        editor,
        { text: beforeText.text },
        { at: textPath.concat(splitOffset) }
      );
      Transforms.removeNodes(editor, { at: textPath });
      // }
    }
  };

  const handleGetValue = () => {
    if (value) {
      console.log(value);
    }
  };

  useEffect(() => {
    console.log(value);
  }, [value]);

  const chars = CHARACTERS.filter(c =>
    c.toLowerCase().startsWith(search.toLowerCase())
  ).slice(0, 10)

  const onKeyDown = useCallback(
    event => {
      if (target && chars.length > 0) {
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault()
            const prevIndex = index >= chars.length - 1 ? 0 : index + 1
            setIndex(prevIndex)
            break
          case 'ArrowUp':
            event.preventDefault()
            const nextIndex = index <= 0 ? chars.length - 1 : index - 1
            setIndex(nextIndex)
            break
          case 'Tab':
          case 'Enter':
            event.preventDefault()
            Transforms.select(editor, target)
            insertMention(editor, chars[index])
            setTarget(null)
            break
          case 'Escape':
            event.preventDefault()
            setTarget(null)
            break
          default:
            break;
        }
      }
    },
    [index, search, target]
  )

  useEffect(() => {
    if (target && chars.length > 0) {
      const el = ref.current
      const domRange = ReactEditor.toDOMRange(editor, target)
      const rect = domRange.getBoundingClientRect()
      el.style.top = `${rect.top + window.pageYOffset + 24}px`
      el.style.left = `${rect.left + window.pageXOffset}px`
    }
  }, [chars.length, editor, index, search, target])

  // Define a rendering function based on the element passed to `props`. We use
  // `useCallback` here to memoize the function for subsequent renders.
  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      case "customSpan":
        return <CustomSpan {...props} />;
      case "button":
        return <EditableButtonComponent {...props} />;
      case "image":
        return <Image {...props} />;
      case "video":
        return <VideoElement {...props} />;
      case "mention":
        return <Mention {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);
  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(value) => {
        const isAstChange = editor.operations.some(
          (op) => "set_selection" !== op.type
        );
        if (isAstChange) {
          // Save the value to Local Storage.
          // const content = JSON.stringify(value)
          // localStorage.setItem('content', content)
          setValue(value);
        }
        const { selection } = editor

        if (selection && Range.isCollapsed(selection)) {
          const [start] = Range.edges(selection)
          const wordBefore = Editor.before(editor, start, { unit: 'word' })
          const before = wordBefore && Editor.before(editor, wordBefore)
          const beforeRange = before && Editor.range(editor, before, start)
          const beforeText = beforeRange && Editor.string(editor, beforeRange)
          const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/)
          const after = Editor.after(editor, start)
          const afterRange = Editor.range(editor, start, after)
          const afterText = Editor.string(editor, afterRange)
          const afterMatch = afterText.match(/^(\s|$)/)

          if (beforeMatch && afterMatch) {
            setTarget(beforeRange)
            setSearch(beforeMatch[1])
            setIndex(0)
            return
          }
        }

        setTarget(null)
      }
    }
    >
      <button onClick={handleInsertCustomSpan}>Insert Custom Span</button>
      <button onClick={handleGetValue}>Get Editor Value</button>
      <ToggleEditableButtonButton />
      <InsertImageButton />
      <HoveringToolbar />
      <Editable
        style={{
          minHeight: "200px",
          backgroundColor: "#f8f8f8",
          padding: "12px",
          borderRadius: "12px",
          margin: "3px",
        }}
        renderLeaf={(props) => <Leaf {...props} />}
        placeholder="Enter some text..."
        value={value}
        onChange={(value) => setValue(value)}
        renderElement={renderElement}
        onKeyDown={onKeyDown}
        onDOMBeforeInput={(event) => {
          switch (event.inputType) {
            case "formatBold":
              event.preventDefault();
              return toggleFormat(editor, "bold");
            case "formatItalic":
              event.preventDefault();
              return toggleFormat(editor, "italic");
            case "formatUnderline":
              event.preventDefault();
              return toggleFormat(editor, "underlined");
            default:
              break;
          }
        }}
      />
        {target && chars.length > 0 && (
        <Portal>
          <div
            ref={ref}
            style={{
              top: '-9999px',
              left: '-9999px',
              position: 'absolute',
              zIndex: 1,
              padding: '3px',
              background: 'white',
              borderRadius: '4px',
              boxShadow: '0 1px 5px rgba(0,0,0,.2)',
            }}
            data-cy="mentions-portal"
          >
            {chars.map((char, i) => (
              <div
                key={char}
                style={{
                  padding: '1px 3px',
                  borderRadius: '3px',
                  background: i === index ? '#B4D5FF' : 'transparent',
                }}
              >
                {char}
              </div>
            ))}
          </div>
        </Portal>
      )}
    </Slate>
  );
};

const Mention = ({ attributes, children, element }) => {
  const selected = useSelected()
  const focused = useFocused()
  const style = {
    padding: '3px 3px 2px',
    margin: '0 1px',
    verticalAlign: 'baseline',
    display: 'inline-block',
    borderRadius: '4px',
    backgroundColor: '#eee',
    fontSize: '0.9em',
    boxShadow: selected && focused ? '0 0 0 2px #B4D5FF' : 'none',
  }
  // See if our empty text child has any styling marks applied and apply those
  if (element.children[0].bold) {
    style.fontWeight = 'bold'
  }
  if (element.children[0].italic) {
    style.fontStyle = 'italic'
  }
  return (
    <span
      {...attributes}
      contentEditable={false}
      data-cy={`mention-${element.character.replace(' ', '-')}`}
      style={style}
    >
      {children}@{element.character}
    </span>
  )
}


const InsertImageButton = () => {
  const editor = useSlateStatic();
  return (
    <button
      onMouseDown={(event) => {
        event.preventDefault();
        const url = window.prompt("Enter the URL of the image:");
        if (url && !isImageUrl(url)) {
          alert("URL is not an image");
          return;
        }
        url && insertImage(editor, url);
      }}
    >
      insert img
      {/* <Icon>image</Icon> */}
    </button>
  );
};

const withEmbeds = (editor) => {
  const { isVoid } = editor;
  editor.isVoid = (element) =>
    element.type === "video" ? true : isVoid(element);
  return editor;
};

const toggleFormat = (editor, format) => {
  const isActive = isFormatActive(editor, format);
  Transforms.setNodes(
    editor,
    { [format]: isActive ? null : true },
    { match: Text.isText, split: true }
  );
};

const isFormatActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => n[format] === true,
    mode: "all",
  });
  return !!match;
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underlined) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const HoveringToolbar = () => {
  const ref = useRef();
  const editor = useSlate();
  const inFocus = useFocused();

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el) {
      return;
    }

    if (
      !selection ||
      !inFocus ||
      (!Range && !Range.isCollapsed && Range.isCollapsed(selection)) ||
      Editor.string(editor, selection) === ""
    ) {
      el.removeAttribute("style");
      return;
    }

    const domSelection = window.getSelection();
    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();
    el.style.opacity = "1";
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
    el.style.left = `${
      rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2
    }px`;
  });

  return (
    <>
      <Portal>
        <div
          ref={ref}
          className="menu"
          onMouseDown={(e) => {
            // prevent toolbar from taking focus away from editor
            e.preventDefault();
          }}
        >
          <FormatButton format="bold" icon="format_bold" />
          <FormatButton format="italic" icon="format_italic" />
          <FormatButton format="underlined" icon="format_underlined" />
        </div>
      </Portal>
    </>
  );
};

const FormatButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <button
      reversed
      active={isFormatActive(editor, format)}
      onClick={() => toggleFormat(editor, format)}
    >
      {format}
      {/* <Icon>{icon}</Icon> */}
    </button>
  );
};

const isButtonActive = (editor) => {
  const [button] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "button",
  });
  return !!button;
};

const unwrapButton = (editor) => {
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "button",
  });
};

const insertButton = (editor) => {
  if (editor.selection) {
    wrapButton(editor);
  }
};

const wrapButton = (editor) => {
  if (isButtonActive(editor)) {
    unwrapButton(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const button = {
    type: "button",
    children: isCollapsed ? [{ text: "Edit me!" }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, button);
  } else {
    Transforms.wrapNodes(editor, button, { split: true });
    Transforms.collapse(editor, { edge: "end" });
  }
};

const ToggleEditableButtonButton = () => {
  const editor = useSlate();
  return (
    <button
      active
      onMouseDown={(event) => {
        event.preventDefault();
        if (isButtonActive(editor)) {
          unwrapButton(editor);
        } else {
          insertButton(editor);
        }
      }}
    >
      add-span
      {/* <Icon>smart_button</Icon> */}
    </button>
  );
};

const Image = ({ attributes, children, element }) => {
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, element);

  const selected = useSelected();
  const focused = useFocused();
  return (
    <div {...attributes}>
      {children}
      <div
        contentEditable={false}
        style={{
          position: "relative",
        }}
      >
        <img
          src={element.url}
          alt="img"
          style={{
            display: "block",
            maxWidth: "100%",
            maxHeight: "20em",
            boxShadow: `${selected && focused ? "0 0 0 3px #B4D5FF" : "none"}`,
          }}
        />
        <button
          active
          onClick={() => {
            Transforms.removeNodes(editor, { at: path });
            console.log("dlt btn clicked");
          }}
          style={{
            display: `${selected && focused ? "inline" : "none"}`,
            position: "absolute",
            top: "0.5em",
            left: "0.5em",
            backgroundColor: "white",
          }}
        >
          {/* <Icon>delete</Icon> */}
          delete
        </button>
      </div>
    </div>
  );
};

const VideoElement = ({ attributes, children, element }) => {
  const editor = useSlateStatic();
  const { url } = element;
  return (
    <div {...attributes}>
      <div contentEditable={false}>
        <div
          style={{
            padding: "75% 0 0 0",
            position: "relative",
          }}
        >
          <iframe
            src={`${url}?title=0&byline=0&portrait=0`}
            frameBorder="0"
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
            }}
            title="unknown"
          />
        </div>
        <UrlInput
          url={url}
          onChange={(val) => {
            const path = ReactEditor.findPath(editor, element);
            const newProperties = {
              url: val,
            };
            Transforms.setNodes(editor, newProperties, {
              at: path,
            });
          }}
        />
      </div>
      {children}
    </div>
  );
};

const UrlInput = ({ url, onChange }) => {
  const [value, setValue] = React.useState(url);
  return (
    <input
      value={value}
      onClick={(e) => e.stopPropagation()}
      style={{
        marginTop: "5px",
        boxSizing: "border-box",
      }}
      onChange={(e) => {
        const newUrl = e.target.value;
        setValue(newUrl);
        onChange(newUrl);
      }}
    />
  );
};

const initialValue = [
  {
    type: "paragraph",
    children: [
      {
        text: "This example shows how you can make a hovering menu appear above your content, which you can use to make text ",
      },
      { text: "bold", bold: true },
      { text: ", " },
      { text: "italic", italic: true },
      { text: ", or anything else you might want to do!" },
    ],
  },
  {
    type: "image",
    url: "https://source.unsplash.com/kFrdX5IeQzI",
    children: [{ text: "" }],
  },
  {
    type: "video",
    url: "https://player.vimeo.com/video/26689853",
    children: [{ text: "" }],
  },
  {
    type: "paragraph",
    children: [
      { text: "Try it out yourself! Just " },
      { text: "select any piece of text and the menu will appear", bold: true },
      { text: "." },
    ],
  },
];

export default SlateEditor;
