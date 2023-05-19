import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";
import Editor from "./components/content-editable/Editor";
import Navbar from "./components/Navbar";
import { isIframe } from "./components/content-editable/utils/isFrame";

const doc = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "line one",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "line two",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "line three",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "🤞",
        },
      ],
    },
  ],
};

function App() {
 
  return (
    <div className="App d-flex align-items-center justify-content-center flex-column">
      {/* <Navbar/> */}
      <Editor iframe={isIframe}/>
    </div>
  );
}

export default App;
