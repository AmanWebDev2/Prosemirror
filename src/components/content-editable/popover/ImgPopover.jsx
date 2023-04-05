import React, { useEffect, useRef, useState } from "react";
import linkSvg from "../../../../src/assets/svg/link.svg";
import attributeSvg from "../../../../src/assets/svg/attribute.svg";
import crossSvg from "../../../../src/assets/svg/cross.svg";
import sanitizeURL, { HTTP_PREFIX } from "../utils/santizeURL";
import applyMark from "../utils/applyMark";
import { BAD_CHARACTER_PATTER } from "../../LinkUrlEditor";
import { ENTER } from "../utils/KeyCodes";
import { isIframe } from "../utils/isFrame";
import { getTranslateXY } from "../utils/getTransformXY";
import { setElementProperties } from "../utils/setNodeProperties";

const ImagePopover = (props) => {
  const [show, setShow] = useState(false);
  const [url, setUrl] = useState(() => props.value);
  const inputRef = useRef();

  useEffect(() => {
    if (!show) return;
    let menuNode;
    if (isIframe) {
    } else {
      menuNode = document.querySelector(".pm-selectionmenu");
      if (!menuNode) return;
      translateMenuPos(menuNode);
    }
  }, [show]);

  const translateMenuPos = (menuNode) => {
    const translate = getTranslateXY(menuNode);
    const menuNodeRect = menuNode.getBoundingClientRect();
    setElementProperties(menuNode, {
      transform: `translate(${
        translate.translateX - menuNodeRect.width / 2
      }px,${translate.translateY}px)`,
    });
  };

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
    if (!BAD_CHARACTER_PATTER.test(url)) {
      // console.log(props)
      props.close(sanitizeURL(inputRef.current.value), applyMark);
    }
  };

  useEffect(()=>{
    if(url) {
      const link = url.replace(HTTP_PREFIX,'');
      if(link.trim() === '') {
        setUrl('');
      }
    }
  },[]);


  return (
    <>
      <div className="kudoshub-prosemirror-popover kudoshub-prosemirror-composer-pointer">
        <div>
          <div className="d-flex">
            {!show ? (
              <button
              className={`kudoshub-prosemirror-composer-icon-btn ${url && "selected"}`}
              onClick={() => setShow(true)}>
                <img src={linkSvg} alt="link" />
              </button>
            ) : (
              <div className="d-flex">
                <div className="flex">
                  <input
                    placeholder="Enter a link"
                    class="kudoshub-prosemirror-composer-editor-box-input o__with-icon"
                    data-test-image-editor-link-url-input=""
                    type="text"
                    onKeyDown={handleKeyDown}
                    onChange={onURLChange}
                    ref={inputRef}
                    value={url || ""}
                  />
                </div>
                <div className="flex flex-col">
                  <button className="kudoshub-prosemirror-composer-icon-btn flex content-start kudoshub-prosemirror-template-inserter-opener">
                    <img src={attributeSvg} alt="attribute" />
                  </button>
                </div>
                <div className="flex flex-col">
                  <button className="kudoshub-prosemirror-composer-icon-btn flex content-start kudoshub-prosemirror-template-inserter-opener">
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
