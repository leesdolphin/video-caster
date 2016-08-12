import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import * as chromecastEvents from '../../react-redux-chromecast-sender/constants'

export const PlaybackScrobberView = React.createClass({
  propTypes: {
    duration: PropTypes.number.isRequired,
    currentTime: PropTypes.number.isRequired,
    onScrobb: PropTypes.func.isRequired
  },
  render: function () {
    return <input
      className='form-control'
      type='range'
      min='0'
      max={this.props.duration}
      value={this.props.currentTime}
      onChange={this.props.onScrobb}
      />
  }
})
const mapStateToProps = (state) => {
  return {
    duration: state.media.duration,
    currentTime: state.media.currentTime
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    onScrobb: (event) => {
      dispatch({
        type: chromecastEvents.MEDIA_SEEK,
        seek_time: event.target.value
      })
    }
  }
}
export const PlaybackScrobber = connect(
  mapStateToProps,
  mapDispatchToProps
)(PlaybackScrobberView)
