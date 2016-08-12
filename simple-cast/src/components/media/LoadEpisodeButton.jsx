import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { requestEpisode } from '../../media/index.jsx'

export const LoadEpisodeButtonView = React.createClass({
  propTypes: {
    relEpisode: PropTypes.object.isRequired,
    direction: PropTypes.string.isRequired,
    loadEpisode: PropTypes.func.isRequired
  },
  onClick () {
    const ep = this.props.relEpisode
    const dir = this.props.direction
    const requestedUrl = this.props.relEpisode[dir]
    if (!requestedUrl) {
      return null
    }
    const knownData = {
      seriesLink: ep.seriesLink
    }
    if (dir === 'prevEpisode') {
      // Trying to get previous episode.
      // So we know which episode comes next(this one), and it's number.
      knownData['nextEpisode'] = ep.episodeUrl
      knownData['number'] = ep.number - 1
    } else if (dir === 'nextEpisode') {
      knownData['prevEpisode'] = ep.episodeUrl
      knownData['number'] = ep.number + 1
    } else {
      // What !!! I don't know about that direction, so ... yeah, nah
      return null
    }
    this.props.loadEpisode(requestedUrl, knownData)
  },
  render () {
    const dir = this.props.direction
    const requestedUrl = this.props.relEpisode[dir]
    if (!requestedUrl) {
      return <span />
    }
    let btnText = ''
    if (dir === 'prevEpisode') {
      btnText = 'Get Previous Episode'
    } else if (dir === 'nextEpisode') {
      btnText = 'Get Next Episode'
    } else {
      return <span />
    }
    return <button className='btn btn-primary-outline' onClick={this.onClick}>{btnText}</button>
  }
})

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadEpisode (requestedUrl, knownData = {}) {
      dispatch(requestEpisode(requestedUrl, knownData, false))
    }
  }
}

export const LoadEpisodeButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoadEpisodeButtonView)
