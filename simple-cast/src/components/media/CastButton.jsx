import React, { PropTypes } from 'react'

import { connect } from 'react-redux'

import * as castEvents from '../../react-redux-chromecast-sender/constants.js'

export const CastButtonView = React.createClass({
  propTypes: {
    isConnected: PropTypes.bool.isRequired,
    isConnecting: PropTypes.bool.isRequired,
    connectToChromeCast: PropTypes.func.isRequired,
    disconnectFromChromeCast: PropTypes.func.isRequired
  },
  render () {
    if (!this.props.isConnected) {
      return <button
        onClick={this.props.connectToChromeCast}>
          Connect to Chrome Cast
      </button>
    } else {
      return <button
        onClick={this.props.disconnectFromChromeCast}>
          Disconnect from Chrome Cast
      </button>
    }
  }
})

const mapStateToProps = (state, ownProps) => {
  // TODO: Consider state.
  return {
    isConnecting: false,
    isConnected: !!state.session
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    connectToChromeCast () {
      dispatch({
        type: castEvents.SESSION_CONNECT
      })
    },
    disconnectFromChromeCast () {
      dispatch({
        type: castEvents.SESSION_DISCONNECT
      })
    }
  }
}

export const CastButton = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {pure: true}
)(CastButtonView)
