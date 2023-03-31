import { markActive } from "./markActive";

export const handleMenuPosition=({view,isLinkActive,iframe,menu})=> {
    const { state, readOnly } = view;
    const { from, to } = state.selection;
    const start = view.coordsAtPos(from);
    const end = view.coordsAtPos(to);


     try {
      let box = menu.getBoundingClientRect();

      let offsetParentBox = menu.offsetParent ? menu.offsetParent.getBoundingClientRect():document.body.getBoundingClientRect();
      let left =
        (start.left + end.left) / 2 - box.width / 2 - offsetParentBox.left;
      if (left < 5) {
        left = 5;
      }
      
      if (
        (
            (markActive(state, state.schema.marks.link) && !(!state || readOnly || state.selection.from !== state.selection.to) )|| isLinkActive)
      ) {
        if(iframe) {
            menu.style.top = start.bottom + "px"
            menu.style.left = left + "px"
        }else {
        }
        menu.style.transform = `translate(${left}px,${start.bottom}px)`; 
      } else {
        if(iframe) {
          menu.style.top = (start.top - offsetParentBox.top - box.height + view.dom.parentNode.parentNode.scrollTop)+ "px";
          menu.style.left = left + "px";
        }else {
          menu.style.transform = `translate(${left}px,${(start.top - offsetParentBox.top - box.height + view.dom.parentNode.scrollTop)}px)`;
        }
      }
    } catch (err) {
        console.error(err);
    }
  }