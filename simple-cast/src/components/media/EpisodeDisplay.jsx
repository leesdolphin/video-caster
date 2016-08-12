import React, { PropTypes } from 'react'

import { connect } from 'react-redux'
import { createSelector } from 'reselect'

import { createKeyedSelector } from '../../utils/cache'

import { addEpisode } from '../../play_queue/index'
import { getEpisodeMedia } from '../../media/index'

import { LoadingSpinner } from '../generic/LoadingSpinner.jsx'
import { ErrorRender } from '../generic/ErrorRender.jsx'

export const EpisodeDisplayView = React.createClass({
  propTypes: {
    episode: PropTypes.object.isRequired,
    addEpisodeToQueue: PropTypes.func.isRequired,
    resolveMedia: PropTypes.func.isRequired
  },
  render () {
    const e = this.props.episode
    let extras = ''
    if (e.state === 'Loading') {
      extras = <LoadingSpinner />
    } else if (e.state === 'Failed') {
      extras = <div>
        <b>Failed to load data.</b>Internal Information: <br />
        <ErrorRender error={e.error} />
      </div>
    }
    let image = ''
    // TODO: Support episode images.
    return <div className='media'>
      <div className='media-left'>
        {image}
      </div>
      <div className='media-body'>
        <h3 className='media-heading'>
          {e.title}
          <small>{` (No. ${e.number + 1})`}</small>
          <a href={e.episodeUrl} target='_blank' className='heading-link'></a>
        </h3>
        <div>{'Watch Now '}
          <a href={e.media.get(e.defaultQuality)}>{`in ${e.defaultQuality}`}</a>
          // <button onClick={this.props.resolveMedia}>Resolve Media</button>
        </div>
        {extras}
      </div>
      <div className='media-right'>
        <button
          className='btn btn-secondary-outline btn-sm'
          onClick={this.props.addEpisodeToQueue}>Add To Queue</button>
      </div>
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
    addEpisodeToQueue () {
      dispatch(addEpisode(ownProps.episodeUrl))
    },
    resolveMedia () {
      dispatch(getEpisodeMedia(ownProps.episodeUrl))
    }
  }
}

export const EpisodeDisplay = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {pure: true}
)(EpisodeDisplayView)
