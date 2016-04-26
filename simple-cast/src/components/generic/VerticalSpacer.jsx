import React from 'react'

export const VerticalSpacer = React.createClass({
  render: function () {
    return <div className='react_vertical_dots'>
      <div key='1' className='react_vertical_dot' />
      <div key='2' className='react_vertical_dot' />
      <div key='3' className='react_vertical_dot' />
    </div>
  }
})
