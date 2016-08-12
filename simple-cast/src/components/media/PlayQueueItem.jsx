import React, { PropTypes } from 'react'

import { connect } from 'react-redux'
import { createSelector } from 'reselect'

import { createKeyedSelector } from '../../utils/cache'

import { removeEpisode } from '../../play_queue/index'

import { PlaybackContainer } from '../view/PlaybackContainer'

import { PlayQueueItemPlayButton } from './PlayQueueItemPlayButton'

export const PlayQueueItemView = React.createClass({
  propTypes: {
    queueIndex: PropTypes.number.isRequired,
    episode: PropTypes.object.isRequired,
    isPlaying: PropTypes.bool.isRequired,
    removeEpisodeFromQueue: PropTypes.func.isRequired
  },
  render () {
    const e = this.props.episode
    let playbackControls = ''
    if (this.props.isPlaying) {
      playbackControls = <PlaybackContainer />
    }
    return <div className='media'>
      <div className='media-body'>
        <h3 className='media-heading'>{e.title}<small>{`(No. ${e.number + 1})`}</small></h3>
        <div>{'Watch Now '}
          <a href={e.media[e.defaultQuality]}>{`in ${e.defaultQuality}`}</a>
        </div>
        {playbackControls}
      </div>
      <div className='media-right'>
        <div><PlayQueueItemPlayButton episodeUrl={e.episodeUrl} /></div>
        <div>
          <button
            className='btn btn-primary-outline btn-sm'
            onClick={this.props.removeEpisodeFromQueue}>Remove</button>
        </div>
      </div>
    </div>
  }
})

const episodesSelector = (state) => state.episodes

const mapStateToProps = createKeyedSelector(
  (state, ownProps) => state.playQueue.get(ownProps.queueIndex),  // EpURL from queue.
  (episodeUrl) => createSelector(
      createSelector(
        episodesSelector,
        (allEpisodes) => allEpisodes[episodeUrl]
      ),
      (state) => {
        return false
      },
      (episode, isPlaying) => {
        return {episode, isPlaying}
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
