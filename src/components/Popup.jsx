import React from "react";
import uuid from "./content-editable/utils/uudi";

const Popup = (props) => {
  const { View, viewProps, close } = props;
  const dummy = {};
  return (
    <>
      <div data-pop-up-id={uuid()} id={uuid()} className='wrapper'>
        {/* view --> component to be rendered */}
        <View {...(viewProps || dummy)} close={close} />
      </div>
    </>
  );
};

export default Popup;
