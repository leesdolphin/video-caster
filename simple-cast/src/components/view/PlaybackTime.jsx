import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

const zeroPad = (num) => {
  if (num < 0) {
    return '' + num
  } else if (num === 0) {
    return '00'
  } else if (num < 10) {
    return '0' + num
  } else {
    return num
  }
}

export const PlaybackTimeView = React.createClass({
  propTypes: {
    currentTime: PropTypes.number.isRequired,
    showHours: PropTypes.bool
  },
  render: function () {
    const secs = parseInt(this.props.currentTime % 60)
    const mins = parseInt(this.props.currentTime / 60)
    if (this.props.showHours) {
      const hours = parseInt(mins / 60)
      const mins = mins % 60
      return <span>
        {hours}:{zeroPad(mins)}:{zeroPad(secs)}
      </span>
    } else {
      return <span>
        {mins}:{zeroPad(secs)}
      </span>
    }
  }
})

const mapStateToProps = (state, ownProps) => {
  return {
    // Disable the button when the player state matches(you can't play a playing video.)
    currentTime: state.media_currentTime
  }
}

export const PlaybackTime = connect(
  mapStateToProps
)(PlaybackTimeView)
