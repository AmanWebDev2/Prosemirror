import React, { Component } from "react";
import PropTypes from "prop-types";
import EmojiResultRow from "./EmojiResultRow";
export default class EmojiResults extends Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true };
  }
  static propTypes = {
    emojiData: PropTypes.array
  };
  componentDidMount() {}

  componentWillUnmount() {}

  groupBy = (list, key) => {
    var groups = list.reduce(
      (result, item) => ({
        ...result,
        [item[key]]: [
          ...(result[item[key]] || []),
          item,
        ]
    }),{},);
    return groups;
  }

  render() {
    const emojiGroup = this.groupBy(this.props.emojiData, "group");
    const arrayss = [];
    for (var key in emojiGroup) {
      if (emojiGroup.hasOwnProperty(key)) {
        arrayss.push(<div key={key}>{key}</div>);
        arrayss.push(
          emojiGroup[key].map((emojiData, index) => (
            <EmojiResultRow
              key={index}
              symbol={emojiData.symbol}
              title={emojiData.title}
              getEmoji={this.props.getEmoji}
              group={emojiData.group}
            />
          ))
        );
      }
    }
    return (
      <div className="component-emoji-results">
        {/* {people.first.map(emojiData => (
          <EmojiResultRow
            key={emojiData.title}
            symbol={emojiData.symbol}
            title={emojiData.title}
            getEmoji={this.props.getEmoji}
            group={emojiData.group}
          />
        ))} */}

        {/* {Object.entries(people).forEach(([key, value]) => {
          people.keys.map(emojiData => (
            <EmojiResultRow
              key={emojiData.title}
              symbol={emojiData.symbol}
              title={emojiData.title}
              getEmoji={this.props.getEmoji}
              group={emojiData.group}
            />
          ));
        })} */}
        <div>
          {this.state.isLoading}
          {arrayss}
        </div>
      </div>
    );
  }
}
