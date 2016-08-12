import React from 'react'

import { connect } from 'react-redux'

import * as chromecast_events from '../../react-redux-chromecast-sender/constants'

import { removeEpisode } from '../../play_queue/index'

export const PlayQueueItemPlayButtonView = React.createClass({
  propTypes: {
  },
  render () {
    return <button onClick={this.props.playEpisode}>
      <span className='fa fa-play'></span>
    </button>
  }
})

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    playEpisode () {
      dispatch((dispatch, getState) => {
        const episode = getState().episodes[ownProps.episodeUrl]
        const media = episode.castMedia.get(ownProps.quality ||
                                            episode.defaultQuality)
        dispatch({
          media,
          type: chromecast_events.MEDIA_LOAD
        })
      })
    }
  }
}

export const PlayQueueItemPlayButton = connect(
  null,
  mapDispatchToProps,
  null,
  {pure: true}
)(PlayQueueItemPlayButtonView)
