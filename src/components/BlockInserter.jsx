import { TextSelection } from "prosemirror-state";
import React,{useState,useImperativeHandle} from "react";
import { Dropdown } from "react-bootstrap";
import { ATTRIBUTE_SPAN } from "./content-editable/custom/schema/nodes/Names";
import { prosmirrorSchema } from "./content-editable/custom/schema/schema";

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

/**
 

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

const BlockInserter = React.forwardRef((props,ref) => {
    const [show,setShow] = useState(false);

    const insertAtPos=({insertionPos,newNode})=>{
      const { view } = window
      // const newNode = view.state.schema.nodes[ATTRIBUTE_SPAN].create({
      //   "data-template-identifier":"custom"
      // }, [view.state.schema.text("custom")]);
      console.log(newNode)
      // Create a new transaction to insert the node
      const tr = view.state.tr.insert(insertionPos, newNode);
      
      // Apply the transaction to the editor state
      const newState = view.state.apply(tr);
      // Set the selection to the end of the inserted text
      const selection = TextSelection.near(newState.doc.resolve(insertionPos));
      view.dispatch(tr.setSelection(selection));
    }

  const handleInsertBlock = (item) => {
      console.log(window.view);
      switch (item.display) {
        case "Insert button":
          break;
        case "Bulleted List":
          let listType = prosmirrorSchema.nodes.bullet_list;
          let bulletListContent = listType.createAndFill(null, [
          ]);
          insertAtPos({insertionPos: window.view.insertionPos,newNode:bulletListContent })
          window.view.focus()
          break;
        case "Numbered List":
          let itemType = prosmirrorSchema.nodes.list_item;
          let listContent = itemType.createAndFill(null, [
          ]);
          insertAtPos({insertionPos: window.view.insertionPos,newNode:listContent })
          window.view.focus()
          break;
        case "Insert code":

          break;
        case "Insert emoji":
           
          break;
        case "Insert image":
           
          break;
        case "Attach file":
         
          break;
        case "Insert video clip":
           
          break;
        case "Embed video":

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
        }
      }
    };  

  }, [show]);

  return (
    <Dropdown className="inserter-container" id="blockInserter">
      <Dropdown.Toggle
      onClick={()=>setShow(!show)}
      style={{
        display:show ? 'none': 'block'
      }}
        className="attribute-btn"
        variant="success"
        id="blockInserter-dropdown"
      >
        {/* <img src={} alt="" /> */}
      </Dropdown.Toggle>

      <div style={{
        display:show ? 'block' : 'none'
      }}
      id="blockInserter"
      >
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
      </div>
    </Dropdown>
  );
});

export default BlockInserter;
