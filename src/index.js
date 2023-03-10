import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Frame from 'react-frame-component'
import Editor from './components/content-editable/Editor';
const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  <React.StrictMode>
    <Editor />
    <Frame 
    style={{minWidth:'70%',maxHeight:'80%',margin:'30px auto',display:'block'}}
    >
      <Editor />
    </Frame>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
