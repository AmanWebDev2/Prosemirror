import React, { useRef, useState } from "react";
import linkSvg from "../../../../src/assets/svg/link.svg";
import attributeSvg from "../../../../src/assets/svg/attribute.svg";
import crossSvg from "../../../../src/assets/svg/cross.svg";
import sanitizeURL from "../utils/santizeURL";
import applyMark from "../utils/applyMark";
import { BAD_CHARACTER_PATTER } from "../../LinkUrlEditor";
import { ENTER } from "../utils/KeyCodes";

const ImagePopover = (props) => {
  const [show, setShow] = useState(false);
  const [url, setUrl] = useState(() => props.value);
  const inputRef = useRef();

  const handleKeyDown = (e) => {
    if (e.keyCode === ENTER) {
      e.preventDefault();
      apply();
    }
  };
  const onURLChange = (e) => {
    const url = e.target.value;
    setUrl(url);
  };

  const apply = () => {
    if (url && !BAD_CHARACTER_PATTER.test(url)) {
      // console.log(props)
      props.close(sanitizeURL(inputRef.current.value), applyMark);
    }
  };

  return (
    <>
      <div className="kudoshub-prosemirror-popover kudoshub-prosemirror-composer-pointer">
        <div>
          <div className="d-flex">
            {!show ? (
              <button onClick={() => setShow(true)}>
                <img src={linkSvg} alt="link" />
              </button>
            ) : (
              <div className="d-flex">
                <div className="flex">
                  <input
                    placeholder="Enter a link"
                    class="kudoshib-prosemirror-composer-editor-box-input o__with-icon"
                    data-test-image-editor-link-url-input=""
                    type="text"
                    onKeyDown={handleKeyDown}
                    onChange={onURLChange}
                    ref={inputRef}
                    value={url || ""}
                  />
                </div>
                <div className="flex flex-col">
                  <button>
                    <img src={attributeSvg} alt="attribute" />
                  </button>
                </div>
                <div className="flex flex-col">
                  <button>
                    <img src={crossSvg} alt="attribute" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ImagePopover;
