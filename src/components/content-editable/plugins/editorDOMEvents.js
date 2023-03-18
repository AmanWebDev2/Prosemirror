import {Plugin} from "prosemirror-state"
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
                    // console.log(lastNode)
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