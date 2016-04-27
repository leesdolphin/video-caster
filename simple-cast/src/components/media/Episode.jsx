import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { LoadingSpinner } from '../generic/LoadingSpinner.jsx'

export const EpisodeView = React.createClass({
  propTypes: {
    episode: PropTypes.object.isRequired
  },
  render () {
    const e = this.props.episode
    let extras = ''
    if (e.state === 'Loading') {
      extras = <LoadingSpinner />
    } else if (e.state === 'Failed') {
      extras = <div>
        <b>Failed to load data.</b>Internal Information: <br />
        <small><pre>{e.error}</pre></small>
      </div>
    }
    return <div>
      <h2>{e.title}<small>{`(No. ${e.number + 1})`}</small></h2>
      <div>Link: <a href={e.episode_url}>{e.episode_url}</a></div>
      <div>{'Watch Now '}
        <a href={e.media[e.defaultQuality]}>{`in ${e.defaultQuality}`}</a>
      </div>
      {extras}
    </div>
  }
})

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {

  }
}

export const Episode = connect(
  mapStateToProps,
  mapDispatchToProps
)(EpisodeView)
