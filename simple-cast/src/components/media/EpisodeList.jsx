import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { LoadingSpinner } from '../generic/LoadingSpinner.jsx'
import { VerticalSpacer } from '../generic/VerticalSpacer.jsx'

import { buildOrderedEpisodeList } from '../../utils/episodes.jsx'

const Episode = null

export const EpisodeListView = React.createClass({
  propTypes: {
    episodes: PropTypes.arrayOf(React.PropTypes.object).isRequired
  },
  render: function () {
    const rows = []
    let previous_type = null
    let spacer_id = 0
    this.props.episodes.forEach(function (episode) {
      if (episode && episode.url) {
        // We have some data. Let the Episode object handle showing it's state
        // It may have failed; or it may be updating.
        previous_type = 'episode'
        rows.append(<Episode episode key={episode.episode_url} />)
      } else if (episode && episode.state === 'Loading') {
        if (previous_type !== 'loading') {
          // Don't show multiple loading spinners next to each other.
          previous_type = 'loading'
          rows.append(<LoadingSpinner key={`spinner-${spacer_id++}`}/>)
        }
      } else {
        // We have no data. Either the episode is completely unknown
        // Or we tried to load it and it failed. Either way, we acknowledge
        // the gap
        if (previous_type !== 'space') {
          previous_type = 'space'
          rows.append(<VerticalSpacer key={`spacer-${spacer_id++}`} />)
        }
      }
    })
    if (rows.length === 0 || (rows.length === 1 && previous_type === 'space')) {
      // We have nothing, so we'll just show a blank div.
      // Or we just have a spacer element; so we'll also show a blank div.
      return <div />
    }
    return <div>{rows}</div>
  }
})

const mapStateToProps = (state, ownProps) => {
  return {
    episodes: buildOrderedEpisodeList(state.episodes, ownProps.series)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    // onClick: () => {
    //   dispatch({
    //     type: ownProps.event
    //   })
    // }
  }
}

export const EpisodeList = connect(
  mapStateToProps,
  mapDispatchToProps
)(EpisodeListView)
