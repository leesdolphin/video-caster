import React, { PropTypes } from 'react'

export const VerticalSpacer = React.createClass({
  propTypes: {
    width: PropTypes.number
  },
  render: function () {
    const width = this.props.width || 32
    const radius = Math.floor(0.20 * width)
    const spacing = Math.floor((width - (3 * radius)) / 4)
    const height = 3 * radius + 4 * spacing
    const containerStyle = {
      // Need to wrap so that the dots don't overlap with each other.
      width: '100%',
      height: `${height}px`
    }
    const parentStyle = {
      position: 'relative',
      width: '0px',
      height: '0px',
      top: '50%',
      left: '50%',
      marginLeft: `${width / 2}px`,
      marginRight: `${width / 2}px`
    }
    const dotStyle = {
      borderRadius: `${radius / 2}px`,
      left: `-${radius / 2}px`,
      display: 'block',
      width: `${radius}px`,
      height: `${radius}px`,
      backgroundColor: 'grey',
      position: 'absolute'
    }
    const dots = []
    for (let i = 0; i < 3; i++) {
      const style = Object.assign({}, dotStyle)
      style.top = (i * radius + (i + 1) * spacing) - (height / 2)
      dots.push(<div key={i} style={style} />)
    }
    return <div style={containerStyle}>
      <div style={parentStyle}>
        {dots}
      </div>
    </div>
  }
})
