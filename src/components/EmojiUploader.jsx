import React, { Component, useEffect, useState } from "react";
import Emoji from './emoji/Emoji';

function EmojiUploader(props) {
  // let handleNewUserMessage = props;
  const [showPopoverOf, setShowPopoverOf] = useState("");
  const [expandedSelRangeofTextarea, setExpandedSelRangeofTextarea] = useState("");


  const showEmojiPopover = () => setShowPopoverOf(showPopoverOf === 'showEmoji' ? '' : 'showEmoji');
  const getEmojiPosition = () => {
    let sel, range, expandedSelRange;
    sel = window.getSelection();
    range = sel.getRangeAt(0);
    if (sel.anchorNode?.parentElement.id == 'contentEAditableInput' || sel.anchorNode?.parentElement?.parentElement.id == 'contentEAditableInput') {
    }
      range = sel.getRangeAt(0);
      expandedSelRange = range.cloneRange();
      setExpandedSelRangeofTextarea(expandedSelRange);
      // this.setState({ popOverShow: {show: false}});
  }

  const insertEmoji = (e) => {
    setShowPopoverOf("");
    let txtarea = document.getElementById("contentEAditableInput");
    let html = e.target.innerHTML;
    // props.insertEmojiCallback(html);
    if (!txtarea) {
      return;
    }
    // if user select only emoji
    // if (txtarea.textContent.length === 1) {
    //   props.handleNewUserMessage(null, {type:"emoji",text:e.target.innerHTML}, "emoji");
    //   return;
    // }
    sel = window.getSelection();
    let sel, range, expandedSelRange;
    range = expandedSelRangeofTextarea;
    String.prototype.insert = function (index, string) {
      if (index > 0) {
        return this.substring(0, index) + string + this.substr(index);
      }
      return string + this;
    };
    if(range && range.startContainer && range.startContainer.data) {
      let data = range.startContainer.data;
      let node = range.startContainer;
      let offset = range.startOffset + html.length;
      let cursorPosition = data.insert(range.startOffset, html);
      node.textContent = cursorPosition;
      const selection = window.getSelection();
      const range1 = document.createRange();
      range1.setStart(node, offset);
      selection.removeAllRanges();
      selection.addRange(range1);
    }
  }

  return (
    <>
      <Emoji
        emojiHide={showEmojiPopover}
        getEmoji={(e) => insertEmoji(e)}
        showPopoverOf={showPopoverOf}
      ></Emoji>
      <button
        className="kudosHub-emoji-button attech-button"
        aria-disabled="false"
        aria-label="Emoji picker"
        tabIndex="0"
        onClick={() => {
            showEmojiPopover();
            getEmojiPosition();
        }}>
        <svg focusable="false" aria-hidden="true" viewBox="0 0 18 18"><path d="M9 0a9 9 0 1 1 0 18A9 9 0 0 1 9 0zm0 1C4.589 1 1 4.589 1 9s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8zM5 6.999a1 1 0 1 1 2.002.004A1 1 0 0 1 5 6.999zm5.999 0a1.002 1.002 0 0 1 2.001 0 1 1 0 1 1-2.001 0zM8.959 13.5c-.086 0-.173-.002-.26-.007-2.44-.132-4.024-2.099-4.09-2.182l-.31-.392.781-.62.312.39c.014.017 1.382 1.703 3.37 1.806 1.306.072 2.61-.554 3.882-1.846l.351-.356.712.702-.35.356c-1.407 1.427-2.886 2.15-4.398 2.15z" fill={
          showPopoverOf === "showEmoji"
            ? "#6600ff"
            : "#ADADAD"
        }></path>
        </svg>
      </button>
    </>
  )

}

export default EmojiUploader