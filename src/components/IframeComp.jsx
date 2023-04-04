import React, { useEffect, useRef } from 'react'
import Frame from "react-frame-component";
import { Button } from 'react-bootstrap'
import "bootstrap/dist/css/bootstrap.min.css";

import Editor from './content-editable/Editor'
import { isIframe } from './content-editable/utils/isFrame';
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
const IframeComp = () => {
    const iframeRef = useRef();

    useEffect(() => {
      const iframe = document.getElementById("kudoshub-editor-frame");
      if (iframe) {
        const iframeDoc = iframe.contentWindow
          ? iframe.contentWindow.document
          : null;
        if (iframeDoc) {
          // how to access css from a build folder,if it is accessable then we can directly append that css into iframe
          // we have to only run build command everytime we changes in our css
          // var link = document.createElement("link");
          // link.href = `${BASE_URL}:5555/static/css/a.css`;
          // link.rel = "stylesheet";
          // link.type = "text/css";
          // if (doc && doc.head) {
          // doc.head.appendChild(link);
        }
      }
      // console.log(iframe);
    }, []);
  return (
    <Frame
    ref={iframeRef}
    id="kudoshub-editor-frame"
    style={{
      display: "block",
      margin: "120px auto",
      height: "100%",
      width: "100%",
      position: "fixed",
      top: "0",
      left: "0",
    }}
    initialContent='<!DOCTYPE html><html>
      <head>
        <link rel="stylesheet" href="./App.css"></link>
        <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
        integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
        crossorigin="anonymous"
        />
      </head>
      <style>

      body{
        font-family: -apple-system, BlinkMacSystemFont,;
      }
      #editor{
        width: 544px;
        margin: 0 auto;
        max-height: 300px;
        overflow-y: scroll;
      }

  ::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  ::-webkit-scrollbar-thumb {
      background: gray;
      border-radius: 10px;
  }
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
  }    
      
.ProseMirror {
position: relative;
}
.ProseMirror {
word-wrap: break-word;
white-space: pre-wrap;
white-space: break-spaces;
-webkit-font-variant-ligatures: none;
font-variant-ligatures: none;
font-feature-settings: "liga" 0;
padding: 0 26px 10px !important;
}
      
.ProseMirror pre {
white-space: pre-wrap;
}

.ProseMirror li {
position: relative;
}

.ProseMirror-hideselection *::selection {
background: transparent;
}
.ProseMirror-hideselection *::-moz-selection {
background: transparent;
}
.ProseMirror-hideselection {
caret-color: transparent;
}

.ProseMirror-selectednode {
outline: 2px solid #8cf;
}

li.ProseMirror-selectednode {
outline: none;
}

li.ProseMirror-selectednode:after {
content: "";
position: absolute;
left: -32px;
right: -2px;
top: -2px;
bottom: -2px;
border: 2px solid #8cf;
pointer-events: none;
}


img.ProseMirror-separator {
display: inline !important;
border: none !important;
margin: 0 !important;
}
.ProseMirror-textblock-dropdown {
min-width: 3em;
}

.ProseMirror-menu {
margin: 0 -4px;
line-height: 1;
}

.ProseMirror-tooltip .ProseMirror-menu {
width: -webkit-fit-content;
width: fit-content;
white-space: pre;
}

.ProseMirror-menuitem {
margin-right: 3px;
display: inline-block;
}

.ProseMirror-menuseparator {
border-right: 1px solid #ddd;
margin-right: 3px;
}

.ProseMirror-menu-dropdown,
.ProseMirror-menu-dropdown-menu {
font-size: 90%;
white-space: nowrap;
}

.ProseMirror-menu-dropdown {
vertical-align: 1px;
cursor: pointer;
position: relative;
padding-right: 15px;
}

.ProseMirror-menu-dropdown-wrap {
padding: 1px 0 1px 4px;
display: inline-block;
position: relative;
}

.ProseMirror-menu-dropdown:after {
content: "";
border-left: 4px solid transparent;
border-right: 4px solid transparent;
border-top: 4px solid currentColor;
opacity: 0.6;
position: absolute;
right: 4px;
top: calc(50% - 2px);
}

.ProseMirror-menu-dropdown-menu,
.ProseMirror-menu-submenu {
position: absolute;
background: white;
color: #666;
border: 1px solid #aaa;
padding: 2px;
}

.ProseMirror-menu-dropdown-menu {
z-index: 15;
min-width: 6em;
}

.ProseMirror-menu-dropdown-item {
cursor: pointer;
padding: 2px 8px 2px 4px;
}

.ProseMirror-menu-dropdown-item:hover {
background: #f2f2f2;
}

.ProseMirror-menu-submenu-wrap {
position: relative;
margin-right: -4px;
}

.ProseMirror-menu-submenu-label:after {
content: "";
border-top: 4px solid transparent;
border-bottom: 4px solid transparent;
border-left: 4px solid currentColor;
opacity: 0.6;
position: absolute;
right: 4px;
top: calc(50% - 4px);
}

.ProseMirror-menu-submenu {
display: none;
min-width: 4em;
left: 100%;
top: -3px;
}

.ProseMirror-menu-active {
background: #eee;
border-radius: 4px;
}

.ProseMirror-menu-disabled {
opacity: 0.3;
}

.ProseMirror-menu-submenu-wrap:hover .ProseMirror-menu-submenu,
.ProseMirror-menu-submenu-wrap-active .ProseMirror-menu-submenu {
display: block;
}

.ProseMirror-menubar {
border-top-left-radius: inherit;
border-top-right-radius: inherit;
position: relative;
min-height: 1em;
color: #666;
padding: 1px 6px;
top: 0;
left: 0;
right: 0;
border-bottom: 1px solid silver;
background: white;
z-index: 10;
-moz-box-sizing: border-box;
box-sizing: border-box;
overflow: visible;
}

.ProseMirror-icon {
display: inline-block;
line-height: 0.8;
vertical-align: -2px; /* Compensate for padding */
padding: 2px 8px;
cursor: pointer;
}

.ProseMirror-menu-disabled.ProseMirror-icon {
cursor: default;
}

.ProseMirror-icon svg {
fill: currentColor;
height: 1em;
}

.ProseMirror-icon span {
vertical-align: text-top;
}
.ProseMirror-gapcursor {
display: none;
pointer-events: none;
position: absolute;
}

.ProseMirror-gapcursor:after {
content: "";
display: block;
position: absolute;
top: -2px;
width: 20px;
border-top: 1px solid black;
animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite;
}

@keyframes ProseMirror-cursor-blink {
to {
visibility: hidden;
}
}

.ProseMirror-focused .ProseMirror-gapcursor {
display: block;
}

.ProseMirror-example-setup-style hr {
padding: 2px 10px;
border: none;
margin: 1em 0;
}

.ProseMirror-example-setup-style hr:after {
content: "";
display: block;
height: 1px;
background-color: silver;
line-height: 2px;
}

.ProseMirror ul,
.ProseMirror ol {
padding-left: 30px;
}

.ProseMirror blockquote {
padding-left: 1em;
border-left: 3px solid #eee;
margin-left: 0;
margin-right: 0;
}

.ProseMirror-example-setup-style img {
cursor: default;
}

.ProseMirror-prompt {
background: white;
padding: 5px 10px 5px 15px;
border: 1px solid silver;
position: fixed;
border-radius: 3px;
z-index: 11;
box-shadow: -0.5px 2px 5px rgba(0, 0, 0, 0.2);
}

.ProseMirror-prompt h5 {
margin: 0;
font-weight: normal;
font-size: 100%;
color: #444;
}

.ProseMirror-prompt input[type="text"],
.ProseMirror-prompt textarea {
background: #eee;
border: none;
outline: none;
}

.ProseMirror-prompt input[type="text"] {
padding: 0 4px;
}

.ProseMirror-prompt-close {
position: absolute;
left: 2px;
top: 1px;
color: #666;
border: none;
background: transparent;
padding: 0;
}

.ProseMirror-prompt-close:after {
content: "✕";
font-size: 12px;
}

.ProseMirror-invalid {
background: #ffc;
border: 1px solid #cc7;
border-radius: 4px;
padding: 5px 10px;
position: absolute;
min-width: 10em;
}

.ProseMirror-prompt-buttons {
margin-top: 5px;
display: none;
}
  #editor,
  .editor {
  background: white;
  color: black;
  background-clip: padding-box;
  border-radius: 4px;
  border: 2px solid rgba(0, 0, 0, 0.2);
  padding: 5px 0;
  margin-bottom: 23px;
}

.ProseMirror p:first-child,
.ProseMirror h1:first-child,
.ProseMirror h2:first-child,
.ProseMirror h3:first-child,
.ProseMirror h4:first-child,
.ProseMirror h5:first-child,
.ProseMirror h6:first-child {
margin-top: 10px;
}

.ProseMirror {
padding: 4px 8px 4px 14px;
line-height: 1.2;
outline: none;
}

.ProseMirror p {
margin-bottom: 0px;
}
.ProseMirror img {
max-width: 100%;
}

.tooltip {
position: absolute;
pointer-events: none;
z-index: 20;
background: white;
border: 1px solid silver;
border-radius: 2px;
padding: 2px 10px;
margin-bottom: 7px;
-webkit-transform: translateX(-50%);
transform: translateX(-50%);
}
.tooltip:before {
content: "";
height: 0; width: 0;
position: absolute;
left: 50%;
margin-left: -5px;
bottom: -6px;
border: 5px solid transparent;
border-bottom-width: 0;
border-top-color: silver;
}
.tooltip:after {
content: "";
height: 0; width: 0;
position: absolute;
left: 50%;
margin-left: -5px;
bottom: -4.5px;
border: 5px solid transparent;
border-bottom-width: 0;
border-top-color: white;
}
#editor { position: relative; }
.pm-selectionmenu {
background-color: #fff;
box-shadow: 0 4px 14px 0 rgb(0 0 0 / 20%);
white-space: nowrap;
border-radius: 4px;
background-clip: padding-box;
padding: 4px;
}
.kudoshub-prosemirror-composer-icon-btn {
font-size: 14px;
line-height: 18px;
font-weight: 500;
border: none;
border-radius: 4px;
padding: 7px 8px 7px;
display: inline-block;
text-decoration: none;
cursor: pointer;
-webkit-user-select: none;
-moz-user-select: none;
user-select: none;
box-sizing: border-box;
transition: box-shadow linear 40ms;
vertical-align: bottom;
background-color: transparent;
background-clip: padding-box;

}
.kudoshub-prosemirror-composer-icon-btn:hover svg{
fill: #334bfa;
}
.ProseMirror-menu-active {
color: #334bfa;
background-color: #e8f0ff;
}
.ProseMirror-menu-active svg {
fill: #334bfa;
}
.ProseMirror-menuitem {
margin-right:8px;
}
.kudoshub-prosemirror-composer-editor p code {
background-color: #d3d3d3;
}
.kudoshub-prosemirror-composer-editor pre {
margin: 0 0 10px;
padding: 10px;
background-color: #f5f5f5;
overflow: auto;
font-family: Courier,monospace;
font-size: 14px;
line-height: 1.4;
}
[data-align=center] {
text-align: center!important;
}
.kudoshub-prosemirror-composer-editor .ProseMirror a:link, .ProseMirror a:visited, .ProseMirror a:hover, .ProseMirror a:active {
color: rgb(0, 0, 238);
}
.f__text {
padding-right:32px;
width: 100%;
max-width: 558px;
-webkit-appearance: none;
padding: 5px 11px;
box-sizing: border-box;
border: 1px solid rgba(0,0,0,.2);
border-radius: 6px;
flex:1;
} 
.smartlinks-input-container {
display:flex;
width:full;
position:relative;
}
.smart-links-wrapper{
padding:8px 16px;
display: flex;
align-items: center;
cursor:pointer;
}
.smart-links-wrapper:hover{
background-color:rgba(227,231,250,1);
color:rgba(51,75,250,1);
}
.kudoshub-icon svg {
width: 16px;
height: 16px;
display: inline-block;
vertical-align: bottom;
margin-bottom: 2px;
}
.smart-links__list-two{
padding:8px 16px;
display: flex;
align-items: center;
}
.text-blue{
color:rgba(51,75,250,1);
fill: rgba(51,75,250,1);
}
.text-gray {
color: rgba(115,115,118,1);
}
.kudoshub-prosemirror-composer-pointer {
background-color: #fff;
white-space: nowrap;
border-radius: 4px;
background-clip: padding-box;
padding: 14px;
z-index: 10000;
}

.smart-links-info {
display:flex;
align-items:center;
height:32px;
padding:8px 16px;
}
.decoration__line{
width:1px;
height:24px;
background-color:gray;
margin-right:16px;
}

.kudoshub-prosemirror-composer-icon-btn, .kudoshub-prosemirror-composer-labelled-btn {
font-size: 14px;
line-height: 18px;
font-weight: 500;
border: none;
border-radius: 4px;
padding: 7px 8px 7px;
display: inline-block;
text-decoration: none;
cursor: pointer;
-webkit-user-select: none;
-moz-user-select: none;
user-select: none;
box-sizing: border-box;
transition: box-shadow linear 40ms;
vertical-align: bottom;
background-color: transparent;
background-clip: padding-box;
}

.kh-popup-icon{
padding: 1px 0;
display: inline-block;
vertical-align: bottom;
line-height: 20px;
background-color:white;
border:1px solid black;
cursor:pointer;
}

.kh-popup{
  position: absolute;
  max-width: 300px;
  padding: 1px;
  box-shadow: 0 4px 14px 0 rgba(0,0,0,.2), 0 0 0 1px rgba(0,0,0,.05);
  white-space: nowrap;
  border-radius: 4px;
  background-clip: padding-box;
  font-family: system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",sans-serif;
  font-size: 14px;
  line-height: 22px;
  z-index: 3;
  padding:12px;
}

.kh-popup-tiny{
  width: 30px;
  height: 24px;
}

.kh-popup-scrollable {
  overflow-y: auto;
  max-height: 415px;
}
.attribute-selector {
  position: "relative";
}
.attribute-items {
  cursor:pointer;
}
.attribute-items:hover {
  color: blue
}

.kudoshub-intercom-template {
  color: #222222;
  background-color: #f1f1f1;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding-left: 4px;
  padding-right: 4px;
  line-height: 20px !important;
  border-radius: 4px;
  display: inline-block;
  font-weight: normal;
  vertical-align: middle;
  padding: 0 0.4em;
  cursor: auto;
  text-transform: none;
  text-align: center;
  margin: 2px;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.prosemirror-composer-inserter-pointer-line {
  position: fixed;
  border: 1px dashed red;
  box-sizing: border-box;
  width:400px;
}

.inserter-container {
  position: absolute;
  inset: 0px 0px auto auto;
  background-color: white;
  width: min-content;
  z-index: 2;
  top: 0;
}

.attributes-item-container {
  display: block;
  min-width: 135px;
  box-shadow: 2px 2px 9px rgba(0,0,0,.1);
  padding: 10px 15px;
  border-radius: 5px;
}

.show {
  display: block;
  visibility: visible;
}
.hidden {
  display: none;
  visibility:hidden;
}

.attribute-btn {
  box-shadow: 0 4px 14px 0 rgba(0,0,0,.3);
  background-clip: padding-box;
  background-color: #fefefe;
  white-space: nowrap;
  border-radius: 8px;
  margin-left: auto;
  z-index: 10000;
  padding: 10px;
  width: 60px;
}

      </style>
      <body>
        <div id="mountHere"></div>
      </body>
      </html>'
  >
    <Editor iframe={isIframe} />
    <Button>BOOTSTRAP WORKING INSIDE FRAME</Button>
  </Frame>
  )
}

export default IframeComp