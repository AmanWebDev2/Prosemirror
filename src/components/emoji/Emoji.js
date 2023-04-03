import React, { useState,useRef,useEffect } from "react";
import Tenor from "react-tenor";

import SearchInput from "./SearchInput";
import EmojiResults from "./EmojiResults";
import filterEmoji from "./filterEmoji";
import isEmpty from "../../utils/isEmpty";
import "./Emoji.css";

const Emoji =(props)=> {
  const inputRef = useRef();
  const node = useRef();
  const [filteredEmoji,setFilteredEmoji] = useState(()=>filterEmoji(''));

  useEffect(()=>{
    if(inputRef.current) {
      inputRef.current.focus();
    }
  },[]);

  useEffect(()=>{
    if (
      props.showPopoverOf === "showEmoji" ||
      props.showPopoverOf === "showGIF"
    ) {
      document.addEventListener("click", handleMouseDown);
      inputRef.current.focus();
    }
    if (props.showPopoverOf === "") {
      document.removeEventListener("click", handleMouseDown);
    }
  },[props.showPopoverOf]);

  
  const handleMouseDown = (e) => {
    if (!node.current.contains(e.target)) {
      if (props.showPopoverOf === "showEmoji") {
        // props.emojiHide();
      }
      if (props.showPopoverOf === "showGIF") {
        // props.gifHide();
      }
    }
  };

  const handleSearchChange = (event) => {
    setFilteredEmoji(filterEmoji(event.target.value));
  };

  const handleSelectedGif = (result) => {
    if (props.handleNewUserMessage) {
        props.handleNewUserMessage(
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
        props.handleNewUserNote(
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

  const emojiResults = (
      <EmojiResults
        emojiData={filteredEmoji}
        getEmoji={props.getEmoji}
      />
    );

  return(
    <>
    {
      props.showPopoverOf !== '' ? 
        <div id="popoverWrapper" className="position-relative" ref={node}>
          <div className="popover" role="tooltip">
            <div className="popover-content">
                {props.showPopoverOf === "showEmoji" ? (
                  <div>
                    <SearchInput textChange={handleSearchChange} inputRef={inputRef}/>
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
                {props.showPopoverOf === "showGIF" ? (
                  <div style={{minHeight: '297px'}}>
                    <Tenor
                      token="4DMAAOTF6Q0C"
                      onSelect={(result) => handleSelectedGif(result)}
                      defaultResults={true}
                      searchPlaceholder="Search GIFs"
                      ref={inputRef}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          : ''
        }
    </>
  )
}

export default Emoji;