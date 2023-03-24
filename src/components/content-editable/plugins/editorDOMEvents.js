import {Plugin} from "prosemirror-state"
import { setElementProperties } from "../utils/setNodeProperties";

function handleHoveringElement(event,element,view) {
  const inserterPointer =  view.dom.parentNode.querySelector('.prosemirror-composer-inserter-pointer-line');
  const editorContainer = view.dom
  const elmRect = element.getBoundingClientRect();
  const editorContainerRect = editorContainer.getBoundingClientRect();
  const topHalf = event.clientY - elmRect.top < elmRect.height / 2;
  // const rulsetBlockRect = rulsetBlock.getBoundingClientRect();
  if(topHalf) {
      setElementProperties(inserterPointer,{top:`${elmRect.top}px`,display:'block'})
      // setElementProperties(rulsetBlock,{transform:`translate(${editorContainerRect.left}px,${elmRect.top-(rulsetBlockRect.height/2)}px)`,display:'block'})
  }else {
      setElementProperties(inserterPointer,{top:`${elmRect.bottom}px`,display:'block'})
      // setElementProperties(rulsetBlock,{transform:`translate(${editorContainerRect.left}px,${elmRect.bottom-(rulsetBlockRect.height/2)}px)`,display:'block'})
  }
}
export function editorDOMEvents(options) {
    return new Plugin({
        props: {
          handleDOMEvents: {
            mousemove(view,event){
                const posAtCoords = view.posAtCoords({
                    left: event.clientX,
                    top: event.clientY,
                  })
          
                  if (!posAtCoords) {
                    return false
                  }
                  
                  const pos = posAtCoords.pos
                  let node = view.domAtPos(pos).node;
                  // let nodes = []
                  let parent = null;
                let lastNode = node;
                if(node && node.pmViewDesc){
                    parent = node.pmViewDesc.parent;
                    while(parent?.parent){
                        lastNode = parent.dom;
                        parent = parent.parent
                    }
                }
                if(lastNode && parent){
                    console.log(lastNode)
                    handleHoveringElement(event,lastNode,view)
                }
                  return false
            },
            click(view, event) {
              // console.log('Clicked on editor root element!',event.target);
            }
          },
          nodeViews: {
            link(node, view, getPos) {
              const dom = document.createElement('a');
              dom.href = node.attrs.href;
              dom.textContent = node.textContent;
              dom.addEventListener('click', (event) => {
                event.preventDefault();
                console.log('Link clicked:', node.attrs.href);
              });
              return {
                dom,
              };
            },          
          },
        }
      })
}