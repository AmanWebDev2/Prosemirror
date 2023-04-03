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
    type: "video",
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

const handleChange = async(file) => {
  const base64 = await convertToBase64(file)
  return base64
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

  const handleInsertBlock = (item) => {
      let itemType;
      let content;
      const input = document.createElement("input");
      switch (item.display) {
        case "Insert button":
          break;
        case "Bulleted List":
          itemType = prosmirrorSchema.nodes.bullet_list;
          content = itemType.createAndFill(null, [
          ]);
          insertAtPos({insertionPos: window.view.insertionPos,newNode:content })
          window.view.focus();
          setShow(false);
          break;
        case "Numbered List":
          itemType = prosmirrorSchema.nodes.list_item;
          content = itemType.createAndFill(null, [
          ]);
          insertAtPos({insertionPos: window.view.insertionPos,newNode:content })
          window.view.focus();
          setShow(false);
          break;
        case "Insert code":
          itemType = prosmirrorSchema.nodes.code_block;
          content = itemType.createAndFill(null, [
          ]);
          insertAtPos({insertionPos: window.view.insertionPos,newNode:content })
          window.view.focus();
          setShow(false);
          break;
        case "Insert emoji":
          setShowEmoji(true);
          
          break;
        case "Insert image":
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
            insertAtPos({ insertionPos: window.view.insertionPos,newNode:imageNode })
           });
           setShow(false);
          break;
        case "Attach file":
         
          break;
        case "Insert video clip":
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
            insertAtPos({insertionPos: window.view.insertionPos,newNode:content })   
          })
          setShow(false);
          break;
        case "Embed video":
          setShowEmbedVideo(true);
          break;
        default:
          return
      }
  };

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
        return <BlockInserterMenu handleInsertBlock={handleInsertBlock} />;
    }
  }

  return (
    <>
    <Dropdown className="inserter-container hidden" id="blockInserter">
      <Dropdown.Toggle
      onClick={()=>setShow(!show)}
      style={{
        display:show ? 'none': 'block'
      }}
        className="attribute-btn hidden"
        variant="success"
        id="blockInserter-dropdown"
      >
        {/* <img src={} alt="" /> */}
      </Dropdown.Toggle>

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

const BlockInserterMenu=(props)=>{
  const { handleInsertBlock } = props;
  return (
    <div className="attributes-item-container">
    {ITEM.map((data, index) => {
      return (
        <div
          className="attribute-items"
          key={index}
          onClick={() => handleInsertBlock(data)}
        >
          {data.display}
        </div>
      );
    })}
    </div>
  )
}

export default BlockInserter;
