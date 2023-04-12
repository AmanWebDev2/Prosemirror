import React from "react";

const LinkTooltip = (props) => {
  console.log(props);
  const { editorView, href, onCancel, onEdit, onRemove } = props;

  return (
    <div className="czi-link-tooltip">
      <div className="czi-link-tooltip-body">
        <div className="czi-link-tooltip-row">
          <div className="czi-image-url-editor">
            <form className="czi-form" onSubmit={(e) => e.preventDefault()}>
              <input
                autoFocus={true}
                placeholder="Paste a URL"
                spellCheck={false}
                type="text"
                value={href || ""}
              />
            </form>
          </div>
          <button onClick={onEdit}>change</button>
          <button onClick={() => onRemove(editorView)}>remove</button>
        </div>
      </div>
    </div>
  );
};

export default LinkTooltip;
