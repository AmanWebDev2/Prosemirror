import attributeSvg from "../../../assets/svg/attribute.svg"
import { Plugin, PluginKey } from "prosemirror-state";
import { renderGrouped } from "prosemirror-menu";
import { attributes } from "../../../data/attributes";

const cursorPositionPluginKey = new PluginKey("cursorPosition");

export function rulseSetAttribute(options) {
  return new Plugin({
    key: cursorPositionPluginKey,
    state: {
      init() {
        return { pos: 0 };
      },
      apply(tr, state) {
        const { $cursor } = tr.selection;
        if ($cursor) {
          const pos = $cursor.pos;
          if (pos !== state.pos) {
            return { pos };
          }
        }
        return state;
      },
    },
    from: 0,
    view(editorView) {
      return new RulseSetAttribute(editorView);
    },
    props: {
      handleClickOn(view, pos, event) {
        const start = view.coordsAtPos(pos);
        const ruleSetPosBlockElm = view.dom.parentNode.querySelector(".rulset-position");
        if (ruleSetPosBlockElm) {
          const rulsetElm = ruleSetPosBlockElm.querySelector('.rulset-icon-container');

          let topPos = +ruleSetPosBlockElm.style.top.replace("px", "");
          rulsetElm.style.display = "block";

          if (Math.ceil(topPos) !== Math.ceil(start.top))
          rulsetElm.style.display = "block";
          ruleSetPosBlockElm.style.top = start.top + "px";

          // attribute display none
          const attributeSelector = view.dom.parentNode.querySelector(".attribute-selector");
          if(attributeSelector && attributeSelector.style.display !== "none") {
            attributeSelector.style.display = "none";
          }

        }
      },
    },
  });
}

class RulseSetAttribute {
  createRulesetNode() {
    const rulesetBlockContainer=document.createElement("div");
    rulesetBlockContainer.classList.add("rulsetBlock-container","pos");

    const rulesetPosContainer=document.createElement("div");
    rulesetPosContainer.style.position = "absolute";
    rulesetPosContainer.classList.add("rulset-position","pos");

    const lightTheme = document.createElement("div");
    lightTheme.classList.add("light-theme","kh-popup-tiny",'rulset-icon-container');

    const span=document.createElement("span");
    span.style.width = '24px';
    span.style.height = '34px';
    span.style.display = 'flex';
    span.style.alignItems = 'center';
    span.style.justifyContent = 'center';
    span.classList.add("kh-popup","kh-popup-icon")
    span.textContent = "asdf"

    const img=document.createElement("img");
    img.src = attributeSvg;

    lightTheme.appendChild(span);
    span.appendChild(img);
    rulesetPosContainer.appendChild(lightTheme);
    rulesetBlockContainer.appendChild(rulesetPosContainer);

    return rulesetBlockContainer;
  }
  createRulsetMenu() {
    const div = document.createElement("div");
    div.classList.add("attribute-selector","kh-popup");
    const scrollableDiv = document.createElement("div");
    scrollableDiv.classList.add("kh-popup-scrollable");
    attributes.forEach((attribute) => {
      const p = document.createElement("p");
      p.textContent = attribute.display;
      p.style.width = '100%';
      p.classList.add('attribute-items');

      scrollableDiv.appendChild(p);
    });
    div.append(scrollableDiv)
    return div;
  }

  constructor(view) {
    this.view = view;

    this.ruleSetMenu = this.createRulsetMenu();
    this.ruleSetNode = this.createRulesetNode();
        
    let { dom, update } = renderGrouped(this.editorView,[]);

    const editorRect = view.dom.getBoundingClientRect();
    this.rulsetIconWrapper = this.ruleSetNode.querySelector('.rulset-icon-container');

    if(this.rulsetIconWrapper) {
      this.rulsetIconWrapper.style.display = "block"
    }

    this.ruleSetNode.firstElementChild.style.left = `${editorRect.width+10}px`

    this.ruleSetNode.firstElementChild.addEventListener("click",this.handleClick.bind(this));

    this.contentUpdate = update;

    const isRulset = view.dom.parentNode.contains(this.rulsetIconWrapper);
    console.log(view.dom.parentNode,isRulset);

    if(!isRulset) { 
      this.ruleSetNode.appendChild(dom);
      view.dom.parentNode.appendChild(this.ruleSetNode);
    }
      
    // if selection then attribute selector remove
    this.update(view, null);
  }

  update(view) {
    // Update the Content state before calculating the position
     this.contentUpdate(this.view.state);
    this.handleUpdate(view)
  }

  handleClick() {
    console.log("rulset clicked");
    this.rulsetIconWrapper.style.display = "none";
    this.ruleSetNode.firstElementChild.append(this.ruleSetMenu);
    this.ruleSetMenu.style.display = 'block';
  }

  handleUpdate = (editorView) => {
    const { state } = editorView;
    const { from } = state.selection;
    this.from = from;
    const start = editorView.coordsAtPos(from);
    const ruleSetPosBlockElm =
      editorView.dom.parentNode.querySelector(".rulset-position");
    if (ruleSetPosBlockElm) {
      const rulsetElm = ruleSetPosBlockElm.firstElementChild;
      let topPos = +ruleSetPosBlockElm.style.top.replace("px", "");
      if (Math.ceil(topPos) !== Math.ceil(start.top))
        ruleSetPosBlockElm.style.top = start.top + "px";
      rulsetElm.style.display = "block";
    }
  };

  destroy() {
    if(this.ruleSetNode) {
      this.ruleSetNode.remove();
    }
  }
}
