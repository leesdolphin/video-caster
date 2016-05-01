import React, { PropTypes } from 'react'

import { connect } from 'react-redux'
import { createSelector } from 'reselect'

import { createKeyedSelector } from '../../utils/cache'
import { buildOrderedEpisodeList } from '../../utils/episodes.jsx'

import { EpisodeDisplay } from './EpisodeDisplay.jsx'
import { LoadEpisodeButton } from './LoadEpisodeButton.jsx'

import { LoadingSpinner } from '../generic/LoadingSpinner.jsx'
import { VerticalSpacer } from '../generic/VerticalSpacer.jsx'

export const EpisodeListView = React.createClass({
  propTypes: {
    episodes: PropTypes.arrayOf(React.PropTypes.object).isRequired
  },
  render: function () {
    const rows = []
    let previous_type = null
    let spacer_id = 0
    let last_episode = null
    this.props.episodes.forEach((episode) => {
      if (episode && episode.url) {
        // We have some data. Let the Episode object handle showing it's state
        // It may have failed; or it may be updating.
        if (previous_type === 'space' || previous_type === null) {
          const key = `next-ep-btn-${episode.episode_url}`
          // Last one was an space; but now we have an episode. So we'll add a
          //  button to load it.
          rows.push(
            <LoadEpisodeButton
              relEpisode={episode}
              direction='prevEpisode'
              key={key} />
          )
        }
        previous_type = 'episode'
        last_episode = episode
        rows.push(<EpisodeDisplay episode={episode} key={episode.episode_url} />)
        return
      } else if (episode && episode.state === 'Loading') {
        if (previous_type !== 'loading') {
          // Don't show multiple loading spinners next to each other.
          previous_type = 'loading'
          const key = `spinner-${spacer_id++}`
          rows.push(<LoadingSpinner key={key}/>)
        }
      } else {
        if (previous_type === 'episode') {
          // Last one was an episode; now we don't have an episode; we have a gap.
          // Note the `direction` is the URL we want to load next.
          const key = `prev-ep-btn-${last_episode.episode_url}`
          rows.push(
            <LoadEpisodeButton
              relEpisode={last_episode}
              direction='nextEpisode'
              key={key} />
          )
        }
        // We have no data. Either the episode is completely unknown
        // Or we tried to load it and it failed. Either way, we acknowledge
        // the gap
        if (previous_type !== 'space') {
          previous_type = 'space'
          const key = `spinner-${spacer_id++}`
          rows.push(<VerticalSpacer key={key} />)
        }
      }
    })
    // if (rows.length === 0 || (rows.length === 1 && previous_type === 'space')) {
    //   // We have nothing, so we'll just show a blank div.
    //   // Or we just have a spacer element; so we'll also show a blank div.
    //   return <div />
    // }
    return <div>{rows}</div>
  }
})

const episodeSelector = (state) => state.episodes
const seriesSelector = (state) => state.series

const mapStateToProps = createKeyedSelector(
  (state, ownProps) => ownProps.seriesUrl,
  (series_url) => createSelector(
      createSelector(
        episodeSelector,
        createSelector(
          seriesSelector,
          (series) => series[series_url] || series_url
        ),
        buildOrderedEpisodeList
      ),
      function (episodes_list) {
        return {
          episodes: episodes_list
        }
      }
    )
)

export const EpisodeList = connect(
  mapStateToProps,
  null,
  null,
  {pure: true}
)(EpisodeListView)
