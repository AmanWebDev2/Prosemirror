import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

export default function tooltipPlugin(tooltipContent) {
  return new Plugin({
    state: {
      init() {
        return {
          active: false,
          pos: null,
        };
      },
      apply(tr, prevState) {
        const state = prevState;
        const { selection } = tr;
        if (selection.empty) {
          state.active = false;
          state.pos = null;
        } else {
          state.active = true;
          state.pos = selection.from;
        }
        return state;
      },
    },
    view(editorView) {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = tooltipContent;
      tooltip.style.display = 'none';
      document.body.appendChild(tooltip);

      function updateTooltip(view, lastState) {
        const { state } = view;
        const { active, pos } = state.plugins.tooltip;

        if (active && pos !== lastState.plugins.tooltip.pos) {
          const coords = editorView.coordsAtPos(pos);
          tooltip.style.left = coords.left + 'px';
          tooltip.style.top = (coords.bottom + 5) + 'px';
          tooltip.style.display = 'block';
        } else if (!active && tooltip.style.display !== 'none') {
          tooltip.style.display = 'none';
        }

        return lastState;
      }

      return {
        update: updateTooltip,
      };
    },
    props: {
      decorations(state) {
        const { active, pos } = state.plugins.tooltip;
        if (active) {
          return DecorationSet.create(state.doc, [
            Decoration.widget(pos, () => {
              const node = document.createElement('div');
              node.className = 'tooltip-target';
              node.appendChild(document.createTextNode('•'));
              return node;
            }),
          ]);
        }
        return null;
      },
    },
  });
}
