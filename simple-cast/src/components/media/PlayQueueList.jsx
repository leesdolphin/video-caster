import React, { PropTypes } from 'react'

import { connect } from 'react-redux'
import { createSelector } from 'reselect'

import { PlayQueueItem } from './PlayQueueItem'

export const PlayQueueListView = React.createClass({
  propTypes: {
    queuedEpisodeUrls: PropTypes.array.isRequired
  },
  render: function () {
    const rows = []
    this.props.queuedEpisodeUrls.forEach((episodeUrl, idx) => {
      rows.push(
        <PlayQueueItem
          queueIndex={idx}
          key={idx} />
      )
    })
    if (rows.length === 0) {
      rows.push(<div key='nothing-queued'>Nothing queued</div>)
    }
    return <div>
      {rows}
    </div>
  }
})

const playQueueSelector = (state) => state.playQueue

const mapStateToProps = createSelector(
  playQueueSelector,
  function (playQueue) {
    return {
      queuedEpisodeUrls: playQueue
    }
  }
)

export const PlayQueueList = connect(
  mapStateToProps,
  null,
  null,
  {pure: true}
)(PlayQueueListView)
