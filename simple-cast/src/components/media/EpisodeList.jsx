import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { LoadingSpinner } from './generic/LoadingSpinner.jsx'

const Episode = null

export const EpisodeListView = React.createClass({
  propTypes: {
    loadingPrev: PropTypes.boolean,
    loadingNext: PropTypes.boolean,
    episodes: PropTypes.arrayOf(React.PropTypes.object).isRequired
  },
  render: function () {
    const rows = []
    const prevLoader = this.props.loadingPrev ? <LoadingSpinner key='prev'/> : ''
    const nextLoader = (this.props.loadingNext && !this.props.loadingPrev
      ? <LoadingSpinner key='next'/> : '')

    this.props.episodes.forEach(function (episode) {
      rows.append(<Episode episode key={episode.url} />)
    })

    return <div>{prevLoader}{rows}{nextLoader}</div>
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
