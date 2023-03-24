import React from "react";
import { Dropdown } from "react-bootstrap";

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

const BlockInserter = () => {
  const handleInsertBlock = (item) => {
    // console.log(lastHoveredElementRef);
    // let hoveredElement = lastHoveredElementRef.current;
    // const index = quill.getIndex(hoveredElement?.__blot?.blot);
    // let text = "\n";
    // if (index !== null || index !== undefined) {
    //   switch (item.display) {
    //     case "Insert button":
    //       break;
    //     case "Bulleted List":
    //       // quill.formatLine(index+1, 1, { list: "bullet" });
    //       // quill.insertEmbed(index, "bullet-list", true);
    //       quill.insertText(index, text, "list", "bullet");
    //       break;
    //     case "Numbered List":
    //       quill.insertText(index, text, "list", "ordered");
    //       break;
    //     case "Insert code":
    //       quill.insertEmbed(index, "code-block", "Enter code here");
    //       break;
    //     case "Insert emoji":
    //       insertBlockHandler({
    //         blockElement: null,
    //         dataAttributes: item.dataAttributes,
    //         toggleRef: item.toggleRef,
    //         insertAt: index,
    //       });
    //       break;
    //     case "Insert image":
    //       insertBlockHandler({
    //         blockElement: null,
    //         dataAttributes: item.dataAttributes,
    //         toggleRef: item.toggleRef,
    //         insertAt: index,
    //       });
    //       break;
    //     case "Attach file":
    //       insertBlockHandler({
    //         blockElement: null,
    //         dataAttributes: item.dataAttributes,
    //         toggleRef: item.toggleRef,
    //       });
    //       break;
    //     case "Insert video clip":
    //       insertBlockHandler({
    //         blockElement: null,
    //         dataAttributes: item.dataAttributes,
    //         toggleRef: item.toggleRef,
    //         insertAt: index,
    //       });
    //       break;
    //     case "Embed video":
    //       insertBlockHandler({
    //         blockElement: null,
    //         dataAttributes: item.dataAttributes,
    //         toggleRef: item.toggleRef,
    //         insertAt: index,
    //       });
    //       break;
    //       default:
    //         return
    //   }
    // }
  };

  return (
    <Dropdown className="inserter-container" id="blockInserter">
      <Dropdown.Toggle
        className="attribute-btn"
        variant="success"
        id="blockInserter-dropdown"
      >
        {/* <img src={} alt="" /> */}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <div className="attributes-item-container">
          {ITEM.map((data, index) => {
            return (
              <Dropdown.Item
                className="attribute-items"
                key={index}
                onClick={() => handleInsertBlock(data)}
              >
                {data.display}
              </Dropdown.Item>
            );
          })}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default BlockInserter;
