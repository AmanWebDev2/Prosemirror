// import './czi-vars.css';
// import './czi-pop-up.css';


import Popup from '../../Popup';
// eslint-disable-next-line no-unused-vars
import React from 'react';
import ReactDOM from 'react-dom';
import uuid from './uudi';
import { useFrame } from 'react-frame-component';

 
let modalsCount = 0;
let popUpsCount = 0;

const Z_INDEX_BASE = 9999;
const MODAL_MASK_ID = 'pop-up-modal-mask-' + uuid();

function showModalMask(){
  const root = document.body || document.documentElement;
  let element = document.getElementById(MODAL_MASK_ID);
  if (!element) {
    element = document.createElement('div');
    element.id = MODAL_MASK_ID;
    element.className = 'czi-pop-up-modal-mask';
    element.setAttribute('data-mask-type', 'czi-pop-up-modal-mask');
    element.setAttribute('role', 'dialog');
    element.setAttribute('aria-modal', 'true');
  }

  if (root && !element.parentElement) {
    root.appendChild(element);
  }
  const style = element.style;

  const selector = '.czi-pop-up-element[data-pop-up-modal]';
  const zIndex = Array.from(document.querySelectorAll(selector)).reduce(
    (zz, el) => Math.max(zz, Number(el.style.zIndex)),
    0
  );

  style.zIndex = zIndex - 1;
}

function hideModalMask(){
  const element = document.getElementById(MODAL_MASK_ID);
  if (element && element.parentElement) {
    element.parentElement.removeChild(element);
  }
}

function getRootElement(
  id,
  forceCreation,
  popUpParams
) {
  const root =
    (popUpParams && popUpParams.container) ||
    document.body ||
    document.documentElement;
  let element = document.getElementById(id);
  if (!element && forceCreation) {
    element = document.createElement('div');
  }

  if (!element) {
    return null;
  }

  if (popUpParams && popUpParams.modal) {
    element.setAttribute('data-pop-up-modal', 'y');
  }

  element.className = 'czi-pop-up-element czi-vars';
  element.id = id;

  const style = element.style;
  const modalZIndexOffset = popUpParams && popUpParams.modal ? 1 : 0;
  if (!(popUpParams && popUpParams.container)) {
    style.zIndex = Z_INDEX_BASE + popUpsCount * 3 + modalZIndexOffset;
  }

  // Populates the default ARIA attributes here.
  // http://accessibility.athena-ict.com/aria/examples/dialog.shtml
  element.setAttribute('role', 'dialog');
  element.setAttribute('aria-modal', 'true');
  if (root && !element.parentElement) {
    root.appendChild(element);
  }
  return element;
}

function renderPopUp(
  rootId,
  close,
  View,
  viewProps,
  popUpParams
) {
  const rootNode = getRootElement(rootId, true, popUpParams);
  const iframe = document.getElementById('kudoshub-editor-frame');
  const tooltip = iframe.contentWindow.document.querySelector('.pm-selectionmenu');
  if (rootNode) {
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
    } catch (error) {
      
    }
  }

  if (modalsCount > 0) {
    showModalMask();
  } else {
    hideModalMask();
  }
}

function unrenderPopUp(rootId) {
  const rootNode = getRootElement(rootId, false);
  if (rootNode) {
    ReactDOM.unmountComponentAtNode(rootNode);
    rootNode.parentElement && rootNode.parentElement.removeChild(rootNode);
  }

  if (modalsCount === 0) {
    hideModalMask();
  }
}

export default function createPopup(
  View,
  viewProps,
  popUpParams
) {
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

  const closePopUp = value => {
    // if (!handle) {
    //   return;
    // }
    // unrenderPopUp(rootId);

    if (modal) {
      modalsCount--;
    }
    popUpsCount--;

    handle = null;

    const onClose = popUpParams && popUpParams.onClose;
    onClose && onClose(value);
  };

  const render = renderPopUp.bind(null, rootId, closePopUp, View);
  const emptyObj = {};

  handle = {
    close: closePopUp,
    update: nextViewProps => {
      currentViewProps = nextViewProps;
      render(currentViewProps || emptyObj, popUpParams || emptyObj);
    },
  };

  render(currentViewProps || emptyObj, popUpParams || emptyObj);
  return handle;
}
