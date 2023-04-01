import React, { PureComponent } from "react";
import PropTypes from "prop-types";
export default class EmojiResultsRow extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    symbol: PropTypes.string,
    group: PropTypes.string
  };
  getEmoji(e) {
    this.props.getEmoji(e);
  }

  render() {
    const emojiStyle = {
      fontFamily: `Apple Color Emoji,Segoe UI Emoji,NotoColorEmoji, Segoe UI Symbol,Android Emoji, EmojiSymbols,sans-serif`,
      fontSize: `25px`,display: `inline-table`
    };
    return (
      <span
        className="kudosHub-emoji-picker"
        title={this.props.title}
        aria-label={this.props.title}
        role="button"
        tabIndex="0"
        onClick={e => this.getEmoji(e)}
        style={emojiStyle}
      >
        {this.props.symbol}
      </span>
    );
  }
}
