import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import SlateEditor from './components/slate/SlateEditor';
import Frame from 'react-frame-component'
const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  <React.StrictMode>
    <Frame 
    style={{minWidth:'70%',maxHeight:'80%',margin:'30px auto',display:'block'}}
    >
    </Frame>
      <SlateEditor />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
