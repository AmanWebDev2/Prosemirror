import React from "react";
import ReactDOM from "react-dom";

import Popup from "../../Popup";
import uuid from "./uudi";

let modalsCount = 0;
let popUpsCount = 0;

function renderPopUp(rootId, close, View, viewProps, popUpParams) {
  let tooltip;
  if (popUpParams.isIframe) {
    const iframe = document.getElementById("kudoshub-editor-frame");
    tooltip = iframe.contentWindow.document.querySelector(".pm-selectionmenu");
  } else {
    tooltip = document.querySelector(".pm-selectionmenu");
  }
  const component = (
    <Popup
      View={View}
      close={close}
      popUpParams={popUpParams}
      viewProps={viewProps}
    />
  );
  try {
    ReactDOM.render(component, tooltip);
  } catch (error) {}
}

export default function createPopup(View, viewProps, popUpParams, params) {
  const rootId = uuid();
  let handle = null;
  let currentViewProps = viewProps;

  viewProps = viewProps || {};
  popUpParams = popUpParams || {};

  const modal = popUpParams.modal || !popUpParams.anchor;
  popUpParams.modal = modal;

  popUpsCount++;
  if (modal) {
    modalsCount++;
  }

  const closePopUp = (value) => {
    const onClose = popUpParams && popUpParams.onClose;
    onClose && onClose(value);
  };

  const render = renderPopUp.bind(null, rootId, closePopUp, View);
  const emptyObj = {};

  handle = {
    close: closePopUp,
    update: (nextViewProps) => {
      currentViewProps = nextViewProps;
      render(currentViewProps || emptyObj, popUpParams || emptyObj);
    },
  };
  render(currentViewProps || emptyObj, popUpParams || emptyObj);
  return handle;
}
