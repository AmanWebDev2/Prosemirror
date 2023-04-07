import React from "react";
import Button from 'react-bootstrap/Button';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';
import Emoji from "./emoji/Emoji";
import { toggleInserter } from "./content-editable/plugins/editorDOMEvents";
import { prosmirrorSchema } from "./content-editable/custom/schema/schema";
import { insertAtPos } from "./BlockInserter";

const ButtonAttributePopover = (props) => {
  const { target,shown } = props;

  console.log(target);

  const handleEmoji = (e) => {
    if (!(e || e.target || e.target.innerText)) return;
    // get cursor pos
    const { state, dispatch } = window.view;
    const { from } = state.selection;
    dispatch(state.tr.insertText(e.target.innerText, from, from));
    props.setShowEmoji(false);
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

  const emojiPopover = (
    <Popover id="popover-contained">
     <Emoji
        showPopoverOf={props.showPopoverOf}
        getEmoji={handleEmoji}
        handleNewUserMessage={handleGIF}
        />
  </Popover>
  );
  return (
    <Overlay 
    target={target}
    show={true} 
    placement="bottom"
    containerPadding={20}
    // container={ref}
    >

      {emojiPopover}
    </Overlay>
  );
};

export default ButtonAttributePopover;
