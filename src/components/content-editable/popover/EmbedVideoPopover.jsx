import React from 'react'

const EmbedVideoPopover = (props) => {
  return (
    <>
    <div className="embercom-prosemirror-popover embercom-prosemirror-composer-pointer">
        <div className="embercom-prosemirror-composer-editor-readonly-text">
            {props.url || ''}
        </div>
    </div>
    </>
  )
}

export default EmbedVideoPopover