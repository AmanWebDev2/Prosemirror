import { Plugin, PluginKey } from 'prosemirror-state';
const cursorPositionPluginKey = new PluginKey('cursorPosition')

export function selection() {
    return new Plugin({
      key: cursorPositionPluginKey,
      state: {
        init() {
          return { pos: 0 }
        },
        apply(tr, state) {
          const { $cursor } = tr.selection
          if ($cursor) {
            const pos = $cursor.pos
            if (pos !== state.pos) {
              return { pos }
            }
          }
          return state
        }
      },
      from:0,
      view(editorView) {
        return new Selection(editorView)
      },
      props: {
        handleClickOn(view,pos,event) {
          console.log('clicked')
          const start = view.coordsAtPos(this.from);
          const ruleSetPosBlockElm = view.dom.parentNode.querySelector(".rulset-position");
          if(ruleSetPosBlockElm) {
            const rulsetElm = ruleSetPosBlockElm.firstElementChild;
            let topPos = +ruleSetPosBlockElm.style.top.replace('px',''); 
            if(Math.ceil(topPos) !== Math.ceil(start.top) )
            ruleSetPosBlockElm.style.top = start.top+"px";
            rulsetElm.style.display = "block";
          }
        }
      }
      })
};

class Selection {

  constructor(view) {
    this.update(view, null);
  }

  update(view) {
    this.handleUpdate(view)
  }

  handleUpdate = (editorView) => {
    const { state } = editorView
    const { from, to } = state.selection;
    this.from = from;
    const start = editorView.coordsAtPos(from);
    const ruleSetPosBlockElm = editorView.dom.parentNode.querySelector(".rulset-position");
    if(ruleSetPosBlockElm) {
      const rulsetElm = ruleSetPosBlockElm.firstElementChild;
      let topPos = +ruleSetPosBlockElm.style.top.replace('px',''); 
      if(Math.ceil(topPos) !== Math.ceil(start.top) )
      ruleSetPosBlockElm.style.top = start.top+"px";
      rulsetElm.style.display = "block";
    }
  }

}