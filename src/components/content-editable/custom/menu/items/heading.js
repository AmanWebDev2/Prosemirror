import { MenuItem } from "prosemirror-menu";
import { findParentNodeOfType } from "prosemirror-utils";
import toggleHeading from "../../../utils/ToggleHeading";
import { HEADING } from "../../schema/nodes/Names";

export const headingTwoItem = new MenuItem({
  label: "heading two",

  run(state, dispatch, view) {
    const { schema, selection } = state;
    const tr = toggleHeading(state.tr.setSelection(selection), schema, 2);
    view.focus();
    if (tr.docChanged) {
      dispatch && dispatch(tr);
      return true;
    } else {
      return false;
    }
  },
  active(state) {
    // return markActive(state,markType.heading);
    const result = this._findHeading(state);
    return !!(
      result &&
      result.node &&
      result.node.attrs &&
      result.node.attrs.level === 2
    );
  },

  _findHeading(state) {
    const heading = state.schema.nodes[HEADING];
    const fn = heading ? findParentNodeOfType(heading) : () => {};
    return fn(state.selection);
  },
  isActive(state) {
    const result = this._findHeading(state);
    return !!(
      result &&
      result.node &&
      result.node.attrs &&
      result.node.attrs.level === 1
    );
  },

  render() {
    const item = document.createElement("div");
    item.innerHTML = `
      <button class="kudoshub-prosemirror-composer-icon-btn
      " data-test-text-formatter-header="" type="button">
      H2
    </button>
      `;
    item.className = "heading-two-item";
    return item;
  },
});

export const headingOneItem = new MenuItem({
  label: "heading one",
  enable(state) {
    return true;
  },
  run(state, dispatch, view) {
    const { schema, selection } = state;
    const tr = toggleHeading(state.tr.setSelection(selection), schema, 1);
    view.focus();
    if (tr.docChanged) {
      dispatch && dispatch(tr);
      return true;
    } else {
      return false;
    }
  },
  active(state) {
    const result = this._findHeading(state);
    return !!(
      result &&
      result.node &&
      result.node.attrs &&
      result.node.attrs.level === 1
    );
  },
  _findHeading(state) {
    const heading = state.schema.nodes[HEADING];
    const fn = heading ? findParentNodeOfType(heading) : () => {};
    return fn(state.selection);
  },
  isActive(state) {
    const result = this._findHeading(state);
    return !!(
      result &&
      result.node &&
      result.node.attrs &&
      result.node.attrs.level === 1
    );
  },

  render() {
    const item = document.createElement("div");
    item.innerHTML = `
      <button class="kudoshub-prosemirror-composer-icon-btn
      " data-test-text-formatter-header="" type="button">
      H1
    </button>
      `;
    item.className = "heading-one-item";
    return item;
  },
});
