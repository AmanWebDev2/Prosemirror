import React, { useState } from "react";
import cross from "../../src/assets/svg/cross.svg"
import { useRef } from "react";
import { prosmirrorSchema } from "./content-editable/custom/schema/schema";
import { EMBED_VIDEO } from "./content-editable/custom/schema/nodes/Names";
import { insertAtPos } from "./BlockInserter";
const EmbedVideo = () => {

    const videoEmbedInputRef = useRef();
    const [embedVideoLink,setEmbedVideoLink] = useState('');

    const createEmbedLink =(url) => {
        let urlDetails = new URL(url);
        if(urlDetails) {
            const params = urlDetails.searchParams;
            let value = params.get('v');
            let embedUrl = 'https://www.youtube.com' + `/embed/${value}`
            return embedUrl
        }
    }
    
    const changeEmbedVideoLink = (url) => {
        if(url.includes('youtube.com')) {
            const embedLink = createEmbedLink(url);
            setEmbedVideoLink(embedLink);
            return embedLink;
        }else {
            setEmbedVideoLink(url);
            return url;
        } 
    }

    const handleKeyDown=(e)=>{
        // console.log(e.keyCode == 13) 
        if(e.keyCode == 13) {
            // handle link
            if(!e.target.value) return;
            const url = changeEmbedVideoLink(e.target.value);
            console.log(url);
            let itemType = prosmirrorSchema.nodes[EMBED_VIDEO];
            const embedVideoNode = itemType.create({
              src: url,
            });
            insertAtPos({ insertionPos: window.view.insertionPos,newNode:embedVideoNode })
        }
    }

  return (
    <div>
      <div className="kudoshub-prosemirror-composer-video-inserter">
        <div className="container d-flex">
          <div className="d-flex flex-shrink-1 flex-grow-1 ">
            <input
              placeholder="Enter video URL from Youtube, Vimeo, Wistia, Loom, JWPlayer, Microsoft Stream, Brightcove Synthesia or Guidde"
              id="embed-video-inserter"
              class="kudoshub-text-field ember-view kudoshub-prosemirror-composer-editor-box-input o__with-icon"
              data-test-video-inserter-url-input=""
              type="text"
              ref = {videoEmbedInputRef}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="d-flex">
            <button
              class="kudoshub-prosemirror-composer-icon-btn"
              type="button"
            >
                <img src={cross} alt="Your SVG" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmbedVideo;
