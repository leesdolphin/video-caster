import React, { PropTypes } from 'react'

// From https://github.com/chenglou/react-spinner/commit/50e7d9e
export const LoadingSpinner = React.createClass({
  propTypes: {
    width: PropTypes.number
  },
  render () {
    const bars = []
    const dim = this.props.width || 32
    const spinnerBarStyles = {
      animation: 'react-spinner_spin 1.2s linear infinite',
      borderRadius: '5px',
      backgroundColor: 'grey',
      position: 'absolute',
      width: (0.20 * dim) + 'px',
      height: (0.078 * dim) + 'px',
      top: (-0.039 * dim) + 'px',
      left: (-0.10 * dim) + 'px'
    }
    const spinnerStyles = {
      position: 'relative',
      width: '0px',
      height: '0px',
      top: '50%',
      left: '50%',
      margin: (dim / 2) + 'px'
    }

    for (let i = 0; i < 12; i++) {
      const barStyle = Object.assign({}, spinnerBarStyles)
      barStyle.AnimationDelay = barStyle.animationDelay = (i - 12) / 10 + 's'

      barStyle.Transform = barStyle.transform = 'rotate(' + (i * 30) + 'deg) translate(146%)'

      bars.push(
        <div style={barStyle} className='react-spinner_bar' key={i} />
      )
    }

    return (
      <div style={spinnerStyles}>
        {bars}
      </div>
    )
  }
})
