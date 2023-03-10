class TooltipView {
  constructor(node) {
    // The editor will use this as the node's DOM representation
    console.log(node)
    this.dom = document.createElement("div");
    this.dom.src = node.attrs.src;
    this.dom.innerHTML = `
      <div>
        <span>Bold</span>
        <span>Italic</span>
        <span>Code</span>
      </div>
      `;
    this.dom.addEventListener("click", (e) => {
      console.log("You clicked me!");
      e.preventDefault();
    });
  }

  stopEvent() {
    return true;
  }
}

class ParagraphView {
    constructor(node) {
      this.dom = this.contentDOM = document.createElement("p")
      if (node.content.size == 0) this.dom.classList.add("empty")
    }
  
    update(node) {
      if (node.type.name != "paragraph") return false
      if (node.content.size > 0) this.dom.classList.remove("empty")
      else this.dom.classList.add("empty")
      return true
    }
  }
  
export default TooltipView;

