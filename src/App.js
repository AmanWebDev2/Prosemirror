import { useEffect, useRef } from "react";
import Frame from "react-frame-component";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";

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
    <div className="App">
      <Navbar/>
      <Editor iframe={isIframe}/>
    </div>
  );
}

export default App;
