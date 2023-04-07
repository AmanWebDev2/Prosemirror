import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import galleySvg from "../../src/assets/svg/gallery.svg";
import attachmentSvg from "../../src/assets/svg/attachment.svg";
import gifSvg from "../../src/assets/svg/gif.svg";
import smileySvg from "../../src/assets/svg/smiley.svg";
import {
  BlockInserterMenu,
  handleChange,
  handleInsertBlock,
  insertAtPos,
} from "./BlockInserter";
import { prosmirrorSchema } from "./content-editable/custom/schema/schema";
import convertToBase64 from "./content-editable/utils/convert";
import Emoji from "./emoji/Emoji";
import { toggleInserter } from "./content-editable/plugins/editorDOMEvents";
import { Button } from "react-bootstrap";
import ButtonAttributePopover from "./ButtonAttributePopover";

const ITEMS = [
  {
    display: "Insert emoji",
    type: "emoji",
    dataAttributes: { type: "emoji" },
    svg: smileySvg,
  },
  {
    display: "Insert gif",
    type: "gif",
    dataAttributes: { type: "gif" },
    svg: gifSvg,
  },
  {
    display: "Insert image",
    type: "image",
    dataAttributes: {
      type: "image-upload",
      url: "",
      width: "",
      height: "",
      align: "",
    },
    svg: galleySvg,
  },
  {
    display: "Attach file",
    type: "file",
    svg: attachmentSvg,
  },
];
const MessageBarInsert = (props, ref) => {
  const { setNodeRef } = props;
  const [show, setShow] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showGIF, setShowGIF] = useState(false);
  const [showEmbedVideo, setShowEmbedVideo] = useState(false);
  const [showPopoverOf, setShowPopoverOf] = useState("");
  const [target,setTarget] = useState(null);

  const handleEmoji = (e) => {
    if (!(e || e.target || e.target.innerText)) return;
    // get cursor pos
    const { state, dispatch } = window.view;
    const { from } = state.selection;
    dispatch(state.tr.insertText(e.target.innerText, from, from));
    setShowEmoji(false);
    // view show isIframe
    toggleInserter(window.view, false, false);
    window.view.focus();
  };

  const handleGIF = (e, message, type) => {
    // insert image
    // console.log(e,message,type);
    let itemType = prosmirrorSchema.nodes.image;
    const imageNode = itemType.create({
      src: message.text,
      alt: "random",
    });
    const { state, dispatch } = window.view;
    const { from } = state.selection;
    insertAtPos({ insertionPos: from, newNode: imageNode });
    toggleInserter(window.view, false, false);
    window.view.focus();
  };

  return (
    <div className="d-flex align-items-center settings__saved-replies__inserters mt-2 inbox__conversation-controls__info-area"
    style={{
      gap:'10px'
    }}
    >
      {
        ITEMS.map((item) => {
          return (
            <Button
            onClick={(e) =>
              {
                setTarget(e.currentTarget)
                handleInsertBlock({
                item,
                setShow,
                setShowEmbedVideo,
                setShowEmoji,
                setShowGIF,
                setShowPopoverOf,
                type: "macro",
              })
            }
            }
            >
              <span
                className="inbox__conversation-controls__inserter"
                
              >
                <div className="popover__opener inbox__conversation-controls__inserter-opener">
                  <div className="popover__opener overlay__opener">
                    <img src={item.svg} alt="_" />
                  </div>
                </div>
              </span>
            </Button>
          );
        })

        // <BlockInserterMenu handleInsertBlock={handleInsertBlock} setShow={setShow} setShowEmoji={setShowEmoji} setShowEmbedVideo={setShowEmbedVideo}/>
      }
      <ButtonAttributePopover
      target={target}
      showPopoverOf={showPopoverOf}
      />
      {/* <Emoji
        showPopoverOf={showPopoverOf}
        getEmoji={handleEmoji}
        handleNewUserMessage={handleGIF}
      /> */}
    </div>
  );
};

export default React.forwardRef(MessageBarInsert);
