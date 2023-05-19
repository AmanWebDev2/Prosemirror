import React, { useState } from "react";
import galleySvg from "../../src/assets/svg/gallery.svg";
import attachmentSvg from "../../src/assets/svg/attachment.svg";
import gifSvg from "../../src/assets/svg/gif.svg";
import smileySvg from "../../src/assets/svg/smiley.svg";
import { handleInsertBlock, insertAtPos } from "./BlockInserter";
import ButtonAttributePopover from "./ButtonAttributePopover";
import { prosmirrorSchema } from "./content-editable/custom/schema/schema";
import { toggleInserter } from "./content-editable/plugins/editorDOMEvents";

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
  const [target, setTarget] = useState(null);

  const handleGIF = (e, message, type) => {
    // insert image
    let itemType = prosmirrorSchema.nodes.image;
    const imageNode = itemType.create({
      src: message.text,
      alt: "random",
    });
    const { state } = window.view;
    const { from } = state.selection;
    insertAtPos({ insertionPos: from, newNode: imageNode });
    toggleInserter(window.view, false, false);
    window.view.focus();
  };

  return (
    <div
      className="input-icon d-flex align-items-center settings__saved-replies__inserters mt-2 inbox__conversation-controls__info-area"
      style={{
        gap: "10px",
      }}
    >
      {ITEMS.map((item) => {
        return (
          <button
            className="attech-button"
            onClick={(e) => {
              setTarget(e.currentTarget);
              handleInsertBlock({
                item,
                setShow,
                setShowEmbedVideo,
                setShowEmoji,
                setShowGIF,
                setShowPopoverOf,
                type: "macro",
              });
            }}
          >
            <span className="inbox__conversation-controls__inserter">
              <div className="popover__opener inbox__conversation-controls__inserter-opener">
                <div className="popover__opener overlay__opener">
                  <img src={item.svg} alt="_" />
                </div>
              </div>
            </span>
          </button>
        );
      })}
      <ButtonAttributePopover target={target} showPopoverOf={showPopoverOf} />
    </div>
  );
};

export default React.forwardRef(MessageBarInsert);
