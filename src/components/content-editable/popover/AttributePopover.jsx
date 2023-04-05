import React from 'react'
import attributeSVG from "../../../../src/assets/svg/attribute.svg";

const AttributePopover = () => {
  return (
    <>
    <div className="kudoshub-prosemirror-popover kudoshub-prosemirror-composer-pointer fallback-editor-container">
        <div className="container kudoshub-prosemirror-composer-editor-box">
            <div className="row fallback-editor">
                <div className="col-12 items-center fallback-editor-info">
                    <div className="row ">
                    <span className="col-1 items-center flex-none fallback-editor-icon">
                        <img src={attributeSVG} alt="" />
                    </span>
                    <span className="col fallback-editor-info-text">
                        Recipient's name will be inserted here
                    </span>
                    </div>
                </div>
                <label htmlFor="" className='d-flex align-items-center'>
                    <span className="flex-none fallback-editor-label font-weight-bold">Fallback</span>
                    <input placeholder="If we can't find name" className="flex-1 kudoshub-prosemirror-composer-editor-box-input o__with-icon fallback-editor-input" data-test-fallback-editor-input="" type="text" />
                </label>
            </div>
        </div>
    </div>
    </>
  )
}

export default AttributePopover