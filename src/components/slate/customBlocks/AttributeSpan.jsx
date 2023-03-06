import React from 'react'

const AttributeSpan = (props) => {
  return (
    <div {...props.attribute}>{props.children}</div>
  )
}

export default AttributeSpan    