import React, { PropTypes } from 'react'

import { connect } from 'react-redux'
import { createSelector } from 'reselect'

import { createKeyedSelector } from '../../utils/cache'

import { removeEpisode } from '../../play_queue/index'

import { PlaybackContainer } from '../view/PlaybackContainer'

export const PlayQueueItemView = React.createClass({
  propTypes: {
  },
  render () {
    const e = this.props.episode
    let playbackControls = ''
    if (this.props.isPlaying) {
      playbackControls = <PlaybackContainer />
    }
    return <div>
      <PlaybackButton
        playbackState={chrome.cast.media.PlayerState.PLAYING}
        event={chromecast_events.MEDIA_PLAY}>
        {"Play"}
      </PlaybackButton>
      <PlaybackButton
        playbackState={chrome.cast.media.PlayerState.PAUSED}
        event={chromecast_events.MEDIA_PAUSE}>
        {"Pause"}
      </PlaybackButton>
      <PlaybackScrobber />
      {"Playback possition: "}
      <PlaybackTime />
    </div>
  }
})

const episodesSelector = (state) => state.episodes

const mapStateToProps = createKeyedSelector(
  (state, ownProps) => ownProps.episodeUrl,
  (episodeUrl) => createSelector(
      createSelector(
        episodesSelector,
        (allEpisodes) => allEpisodes[episodeUrl]
      ),
      (episode) => {
        return {episode}
      }
    )
)

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    removeEpisodeFromQueue () {
      dispatch(removeEpisode(ownProps.queueIndex))
    }
  }
}

export const PlayQueueItem = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {pure: true}
)(PlayQueueItemView)
