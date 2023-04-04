import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import "./SearchInput.css";

export default class SearchInput extends PureComponent {
  static propTypes = {
    textChange: PropTypes.func
  };

  handleChange = event => {
    this.props.textChange(event);
  };

  render() {
    return (
      <div className="">
        <div>
          <input
            ref={this.props.inputRef}
            onChange={this.handleChange}
            placeholder="Search emoji…"
            className="kudosHub-emoji-search-input"
          />
        </div>
      </div>
    );
  }
}
