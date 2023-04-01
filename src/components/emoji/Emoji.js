import React, { createRef, Component } from "react";
import SearchInput from "./SearchInput";
import EmojiResults from "./EmojiResults";
import filterEmoji from "./filterEmoji";
import Tenor from "react-tenor";
import "./Emoji.css";
import isEmpty from "../../utils/isEmpty";
export default class Emoji extends Component {
  constructor(props) {
    super();
    this.state = {
      filteredEmoji: filterEmoji(""),
    };
    this.node = React.createRef();
    this.inputRef = React.createRef();
  }
  getEmoji(e) {
    this.props.getEmoji(e);
  }

  // handleNewUserMessage(e, message) {
  //   console.log("emoji.js");
  //   this.props.handleNewUserMessage(e, message, "gif");
  // }
  componentDidMount() {
    if(this.inputRef.current) {
      this.inputRef.current.focus();
    }
    // document.removeEventListener('mouseup', this.handleMouseDown)
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.showPopoverOf === "showEmoji" ||
      this.props.showPopoverOf === "showGIF"
    ) {
      document.addEventListener("click", this.handleMouseDown);
      this.inputRef.current.focus();
    }
    if (this.props.showPopoverOf === "") {
      document.removeEventListener("click", this.handleMouseDown);
    }
  }

  handleMouseDown = (e) => {
    if (!this.node.current.contains(e.target)) {
      if (this.props.showPopoverOf === "showEmoji") {
        // this.props.emojiHide();
      }
      if (this.props.showPopoverOf === "showGIF") {
        this.props.gifHide();
      }
    }
  };

  handleSearchChange = (event) => {
    this.setState({
      filteredEmoji: filterEmoji(event.target.value),
    });
  };

  handleSelectedGif = (result) => {
    if (this.props.handleNewUserMessage) {
        this.props.handleNewUserMessage(
          null,
          {
            text: result.media[0].gif.url,
            width: result.media[0].gif.dims[0],
            height: result.media[0].gif.dims[1],
            thumbNail: result.media[0].tinygif.preview,
            type:"gif"
          },
          "gif"
        );  
    } else {
        this.props.handleNewUserNote(
          null,
          {
            text: result.media[0].gif.url,
            width: result.media[0].gif.dims[0],
            height: result.media[0].gif.dims[1],
            thumbNail: result.media[0].tinygif.preview,
            type: "gif"
          },
          "gif"
        );
      }
  };

  render() {
    const emojiStyle = {
      fontFamily: `Apple Color Emoji,Segoe UI Emoji,NotoColorEmoji, Segoe UI Symbol,Android Emoji, EmojiSymbols,sans-serif`,
      fontSize: `30px`,
    };
    const emojiResults = (
      <EmojiResults
        emojiData={this.state.filteredEmoji}
        getEmoji={this.props.getEmoji}
      />
    );
    return ( this.props.showPopoverOf !== '' ? 
    <div id="popoverWrapper" className="position-relative" ref={this.node}>
      <div className="popover" role="tooltip">
        <div className="popover-content">
            {this.props.showPopoverOf === "showEmoji" ? (
              <div>
                <SearchInput textChange={this.handleSearchChange} inputRef={this.inputRef}/>
                <div className="kudosHub-emoji-container">
                  { !isEmpty(emojiResults.props.emojiData)
                      ? emojiResults
                      : <div className="position-absolute" style={{top: '50%',left: '50%',transform: 'translate(-50%, 0%)', width: 'fit-content'}}>No emoji could be found</div>
                  }
                </div>
              </div>
            ) : (
              ""
            )}
            {this.props.showPopoverOf === "showGIF" ? (
              <div style={{minHeight: '297px'}}>
                <Tenor
                  token="4DMAAOTF6Q0C"
                  onSelect={(result) => this.handleSelectedGif(result)}
                  defaultResults={true}
                  searchPlaceholder="Search GIFs"
                  ref={this.inputRef}
                />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      : ''
    )
  }
}
