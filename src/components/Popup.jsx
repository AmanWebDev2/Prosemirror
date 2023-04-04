import React, { useEffect } from "react";
import uuid from "./content-editable/utils/uudi";
import PopUpManager from "./content-editable/PopupManager";
import {
  atAnchorBottomLeft,
  atViewportCenter,
} from "./content-editable/utils/PopupPosition";

const Popup = (props) => {
  console.log(props);
  const { View, viewProps, close,popUpParams } = props;
  const dummy = {};
  const _id = uuid();
  useEffect(() => {
    let _bridge = null;
    const _getDetails = () => {
      const { anchor, autoDismiss, position, modal } = popUpParams;
      return {
        anchor,
        autoDismiss: autoDismiss === false ? false : true,
        body: document.getElementById(_id),
        close,
        modal: modal === true,
        position: position || (modal ? atViewportCenter : atAnchorBottomLeft),
      };
    };
    _bridge = { getDetails: _getDetails };
    PopUpManager.register(_bridge);
  }, []);

  return (
    <>
      <div data-pop-up-id={uuid()} id={uuid()} className='wrapper'>
        <View {...(viewProps || dummy)} close={close} />
      </div>
    </>
  );
};

export default Popup;
