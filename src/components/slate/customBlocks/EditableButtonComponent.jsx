
const InlineChromiumBugfix = () => (
    <span
      contentEditable={false}
      style={{
        fontSize: 0
      }}
    >
      ${String.fromCodePoint(160) /* Non-breaking space */}
    </span>
  )

const EditableButtonComponent = ({ attributes, children }) => {
    return (
      /*
        Note that this is not a true button, but a span with button-like CSS.
        True buttons are display:inline-block, but Chrome and Safari
        have a bad bug with display:inline-block inside contenteditable:
        - https://bugs.webkit.org/show_bug.cgi?id=105898
        - https://bugs.chromium.org/p/chromium/issues/detail?id=1088403
        Worse, one cannot override the display property: https://github.com/w3c/csswg-drafts/issues/3226
        The only current workaround is to emulate the appearance of a display:inline button using CSS.
      */
      <span
        {...attributes}
        onClick={ev => ev.preventDefault()}
        // Margin is necessary to clearly show the cursor adjacent to the button
        className='editable-button'
      >
        <InlineChromiumBugfix />
        {children}
        <InlineChromiumBugfix />
      </span>
    )
  }
  
  export default EditableButtonComponent;