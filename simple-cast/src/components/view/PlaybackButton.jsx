import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

export const PlaybackButtonView = React.createClass({
  propTypes: {
    disabled: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
  },
  render: function () {
    return <button
      onClick={this.props.onClick}
      disabled={this.props.disabled}>
      {this.props.children}
    </button>
  }
})

const mapStateToProps = (state, ownProps) => {
  return {
    // Disable the button when the player state matches(you can't play a playing video.)
    disabled: ownProps.playbackState === state.media.playerState
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch({
        type: ownProps.event
      })
    }
  }
}

export const PlaybackButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(PlaybackButtonView)
