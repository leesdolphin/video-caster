import React, { PropTypes } from 'react'

import { connect } from 'react-redux'

import { LoadingSpinner } from '../generic/LoadingSpinner.jsx'
import { ErrorRender } from '../generic/ErrorRender.jsx'

export const EpisodeDisplayView = React.createClass({
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
        <h3 className='media-heading'>{e.title}<small>{`(No. ${e.number + 1})`}</small></h3>
        <div>{'Watch Now '}
          <a href={e.media[e.defaultQuality]}>{`in ${e.defaultQuality}`}</a>
        </div>
        {extras}
      </div>
    </div>
  }
})

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {}
}

export const EpisodeDisplay = connect(
  mapStateToProps,
  mapDispatchToProps
)(EpisodeDisplayView)
