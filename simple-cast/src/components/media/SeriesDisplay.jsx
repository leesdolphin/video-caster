import React, { PropTypes } from 'react'

import { connect } from 'react-redux'
import { createSelector } from 'reselect'

import { createKeyedSelector } from '../../utils/cache'

import { LoadingSpinner } from '../generic/LoadingSpinner.jsx'
import { ErrorRender } from '../generic/ErrorRender.jsx'

import { EpisodeList } from './EpisodeList'

export const SeriesDisplayView = React.createClass({
  propTypes: {
    series: PropTypes.object.isRequired
  },
  getInitialState () {
    return {
      showEpisodes: false
    }
  },
  toggleEpisodeShow () {
    this.setState(Object.assign(
      this.state,
      {showEpisodes: !this.state.showEpisodes}
    ))
  },
  render () {
    const s = this.props.series
    const content = []
    if (s.title) {
      let episodes = ''
      if (s.episodes) {
        episodes = <small> ({s.episodes.length} Episodes)</small>
      }
      content.push(
        <h2 key='title' className='media-heading'>
          {s.title}
          {episodes}
        </h2>)
    }
    if (s.state === 'Loading') {
      content.push(<LoadingSpinner key='state' />)
    } else if (s.state === 'Failed') {
      content.push(
        <div key='state'>
          <b>Failed to load data.</b>Internal Information: <br />
          <ErrorRender error={s.error} />
        </div>
      )
    }
    if (s.episodes && s.series_url) {
      if (this.state.showEpisodes) {
        content.push(
          <div key='eps'>
            <button className='btn btn-primary-outline btn-sm' key='eps' onClick={this.toggleEpisodeShow}>Hide Epsiodes</button>
            <EpisodeList seriesUrl={s.series_url} />
          </div>
        )
      } else {
        content.push(
          <button className='btn btn-primary-outline btn-sm' key='eps' onClick={this.toggleEpisodeShow}>Show Epsiodes</button>
        )
      }
    }
    let image = ''
    if (s.coverImage) {
      image = <img className='media-object' src={s.coverImage} alt={`Cover Image for ${s.title}`} />
    }
    return <div className='media'>
      <div className='media-left'>
        {image}
      </div>
      <div className='media-body'>
        {content}
      </div>
    </div>
  }
})

const seriesSelector = (state) => state.series

const mapStateToProps = createKeyedSelector(
  (state, ownProps) => ownProps.seriesUrl,
  (seriesUrl) => createSelector(
      createSelector(
        seriesSelector,
        (allSeries) => allSeries[seriesUrl]
      ),
      (series) => {
        return {series}
      }
    )
)

export const SeriesDisplay = connect(
  mapStateToProps,
  null,
  null,
  {pure: true}
)(SeriesDisplayView)
