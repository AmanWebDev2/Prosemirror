export default function lookUpElement(el, predict) {
  while (el && el.nodeName) {
    if (predict(el)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}
