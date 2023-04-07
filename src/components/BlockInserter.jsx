import { TextSelection } from "prosemirror-state";
import React,{useState,useImperativeHandle} from "react";
import { Dropdown } from "react-bootstrap";
import { prosmirrorSchema } from "./content-editable/custom/schema/schema";
import convertToBase64 from "./content-editable/utils/convert";
import Emoji from "./emoji/Emoji";
import { toggleInserter } from "./content-editable/plugins/editorDOMEvents";
import EmbedVideo from "./EmbedVideo";
import { useEffect } from "react";

const ITEM = [
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
    // icon: <ImageIcon />,
  },
  {
    display: "Insert video clip",
    type: "video-clip",
    dataAttributes: {
      captions: "",
      duration: 0.0,
      text: "Sent a video clip",
      thumbnailUrl: "",
      type: "video-upload",
      url: "",
    },
    // icon: <VideoClipIcon />,
  },
  {
    display: "Embed video",
    type: "embed-video",
    dataAttributes: {
      type: "embed-video",
      url: "",
      width: "",
      height: "",
      align: "",
    },
    // icon: <VideoIcon />,
  },
  {
    display: "Attach file",
    type: "file",
    dataAttributes: { type: "file-upload" },
    // icon: <AttechIcon />,
  },
  {
    display: "Insert code",
    type: "code",
    // icon: <CodeIcon />,
    dataAttributes: { type: "pre" },
  },
  {
    display: "Insert emoji",
    type: "emoji",
    // icon: <EmojiIcon />,
    dataAttributes: { type: "emoji" },
  },
  {
    display: "Bulleted List",
    type: "unordered-list",
    // icon: <BulletedListIcon />,
    dataAttributes: { type: "unordered-list" },
  },
  {
    display: "Numbered List",
    type: "ordered-list",
    // icon: <NumberedListIcon />,
    dataAttributes: { type: "ordered-list" },
  },
];

/*
 
const newNode = view.state.schema.nodes[ATTRIBUTE_SPAN].create({
  "data-template-identifier":"custom"
}, [view.state.schema.text("custom")]);
console.log(newNode)
// Create a new transaction to insert the node
const tr = view.state.tr.insert(lastNode.pmViewDesc.posAtStart, newNode);

// Apply the transaction to the editor state
const newState = view.state.apply(tr);

// Set the selection to the end of the inserted text
const selection = TextSelection.near(newState.doc.resolve(pos));
view.dispatch(tr.setSelection(selection));

 */

export const insertAtPos=({insertionPos,newNode})=>{
  const { view } = window
  // Create a new transaction to insert the node
  const tr = view.state.tr.insert(insertionPos, newNode);
  // Apply the transaction to the editor state
  const newState = view.state.apply(tr);
  // Set the selection to the end of the inserted text
  const selection = TextSelection.near(newState.doc.resolve(insertionPos));
  view.dispatch(tr.setSelection(selection));
}

export const handleChange = async(file) => {
  const base64 = await convertToBase64(file)
  return base64
};

export const handleInsertBlock = ({item,setShow,setShowEmbedVideo,setShowEmoji,setShowPopoverOf,setShowGIF,type}) => {
  let itemType, content
  const input = document.createElement("input");
  let insertionPos = 0;
  if(type === 'macro') {
    const { state } = window.view;
    const { from } = state.selection;
    insertionPos = from;
  }else {
    insertionPos = window.view.insertionPos
  }
  switch (item.type) {
    case "Insert button":
      break;
    case "unordered-list":
      itemType = prosmirrorSchema.nodes.bullet_list;
      content = itemType.createAndFill(null, [
      ]);
      insertAtPos({insertionPos,newNode:content })
      window.view.focus();
      setShow(false);
      break;
    case "ordered-list":
      itemType = prosmirrorSchema.nodes.list_item;
      content = itemType.createAndFill(null, [
      ]);
      insertAtPos({insertionPos,newNode:content })
      window.view.focus();
      setShow(false);
      break;
    case "code":
      itemType = prosmirrorSchema.nodes.code_block;
      content = itemType.createAndFill(null, [
      ]);
      insertAtPos({insertionPos,newNode:content })
      window.view.focus();
      setShow(false);
      break;
    case "emoji":
      setShowEmoji(true);
      setShowPopoverOf("showEmoji");
      break;
    case "gif":
      setShowGIF(true);
      setShowPopoverOf("showGIF");
      break;
    case "image":
       input.type = "file";
       input.click();
       input.setAttribute("accept", "image/x-png,image/gif,image/jpeg,image/jpg");
       input.addEventListener("change",async(e)=>{
        const { target: { files } } = e
        const base64 = await convertToBase64(files[0])
        itemType = prosmirrorSchema.nodes.image;
        const imageNode = itemType.create({
          src: base64,
          alt: "random",
        });
        insertAtPos({ insertionPos,newNode:imageNode })
       });
       setShow(false);
      break;
    case "file":
     
      break;
    case "video-clip":
      input.type = "file";
      input.click();
      input.addEventListener("change",async(e)=>{
        const { target: { files } } = e
        const url = await handleChange(files[0])
        console.log(url);
        itemType = prosmirrorSchema.nodes.video_clip;
        content = itemType.create(
          { src: url }
        )
        insertAtPos({insertionPos,newNode:content })   
      })
      setShow(false);
      break;
    case "embed-video":
      setShowEmbedVideo(true);
      break;
    default:
      return
  }
};

const BlockInserter = React.forwardRef((props,ref) => {
  const [show,setShow] = useState(false);
  const [showEmoji,setShowEmoji] = useState(false);
  const [showEmbedVideo,setShowEmbedVideo] = useState(false);
  const [showPopoverOf, setShowPopoverOf] = useState("showEmoji");
  const [currentlyRenderedMenu,setCurrentlyRenderedMenu] = useState("");

  useEffect(()=>{ 
    if(showEmbedVideo) {
      setCurrentlyRenderedMenu("embedVideo");
    }else if(showEmoji) {
      setCurrentlyRenderedMenu("emoji");
    }else {
      setCurrentlyRenderedMenu("");
    }

  },[showEmbedVideo,showEmoji]);

  useImperativeHandle(ref, () => {
    return {
      // ... your methods ...
      closeInserterMenu() {
        if(show) {
          setShow(false);
          if(showEmoji) {
            setShowEmoji(false);
          }
          if(showEmbedVideo){
            setShowEmbedVideo(false);
          }
        }
      }
    };  

  }, [show,showEmoji,showEmbedVideo]);

  const handleEmoji=(e)=>{
    if(!(e || e.target || e.target.innerText)) return;
    // get cursor pos
    const { state, dispatch } = window.view;
    const { from } = state.selection;
    dispatch(state.tr.insertText(e.target.innerText, from, from));
    setShowEmoji(false);
    // view show isIframe
    toggleInserter(window.view,false,false);
    window.view.focus();
  }

  const handleGIF=(e,message,type)=>{
    // insert image  
    // console.log(e,message,type);
    let itemType = prosmirrorSchema.nodes.image;
    const imageNode = itemType.create({
      src: message.text,
      alt: "random",
    });
    const { state, dispatch } = window.view;
    const { from } = state.selection;
    insertAtPos({ insertionPos: window.view.insertionPos,newNode:imageNode })
    toggleInserter(window.view,false,false);
    window.view.focus();
  }

  const components=(comp)=> {
    switch (comp) {
      case "emoji":
        return  <Emoji 
        showPopoverOf={showPopoverOf} 
        getEmoji={handleEmoji}
        handleNewUserMessage={handleGIF}
       />
      case "embedVideo":
        return <EmbedVideo/>
      default:
        return <BlockInserterMenu handleInsertBlock={handleInsertBlock} setShow={setShow} setShowEmoji={setShowEmoji} setShowEmbedVideo={setShowEmbedVideo}/>;
    }
  }

  return (
    <>
    <Dropdown className="inserter-container hidden" id="blockInserter">
      <button
      onClick={()=>setShow(!show)}
      style={{
        display:show ? 'none': 'block'
      }}
        className="attribute-btn kudoshub-prosemirror-composer-icon-btn"
        variant="success"
        id="blockInserter-dropdown"
      >
        click
        {/* <img src={} alt="" /> */}
      </button>

      <div style={{
        display:show ? 'block' : 'none'
      }}
      id="blockInserter_menu_wrapper"
      >
        {
          components(currentlyRenderedMenu)
        }
      </div>
    </Dropdown>
    </>
  );
});

export const BlockInserterMenu=(props)=>{
  const { setShow,setShowEmoji,setShowEmbedVideo } = props;

  return (
    <div className="attributes-item-container">
    {ITEM.map((data, index) => {
      return (
        <div
          className="attribute-items"
          key={index}
          onClick={() => handleInsertBlock({item:data,setShow,setShowEmoji,setShowEmbedVideo,insertionPos:window.view.insertionPos })}
        >
          {data.display}
        </div>
      );
    })}
    </div>
  )
}

export default BlockInserter;
