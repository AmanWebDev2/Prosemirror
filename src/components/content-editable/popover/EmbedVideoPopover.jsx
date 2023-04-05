import React from 'react'

const EmbedVideoPopover = (props) => {
  return (
    <>
    <div className="kudoshub-prosemirror-popover kudoshub-prosemirror-composer-pointer">
        <div className="kudoshub-prosemirror-composer-editor-readonly-text">
            {props.value || ''}
        </div>
    </div>
    </>
  )
}

export default EmbedVideoPopover