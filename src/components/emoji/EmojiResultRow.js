import React, { PureComponent } from "react";

const EmojiResultRow=(props)=>{
  const emojiStyle = {
    fontFamily: `Apple Color Emoji,Segoe UI Emoji,NotoColorEmoji, Segoe UI Symbol,Android Emoji, EmojiSymbols,sans-serif`,
    fontSize: `25px`,display: `inline-table`
  };
  const getEmoji=(e)=>{
    props.getEmoji(e);
  }
  return (
    <span
      className="kudosHub-emoji-picker"
      title={props.title}
      aria-label={props.title}
      role="button"
      tabIndex="0"
      onClick={e => getEmoji(e)}
      style={emojiStyle}
    >
      {props.symbol}
    </span>
  );
}

export default EmojiResultRow;