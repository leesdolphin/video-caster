import React, { PropTypes } from 'react'

import { connect } from 'react-redux'

import { requestEpisode } from '../../media/index.jsx'

export const EpisodeInputBoxView = React.createClass({
  propTypes: {
    onClick: PropTypes.func.isRequired
  },
  getInitialState () {
    return {value: 'https://kissanime.to/Anime/Sailor-Moon-R/Episode-047?id=101211'}
  },
  handleChange (event) {
    this.setState({value: event.target.value})
  },
  onClick () {
    return this.props.onClick(this.state.value)
  },
  render () {
    return <div>
      <input
        className='form-control'
        type={'text'}
        value={this.state.value}
        onChange={this.handleChange} />
      <button className='btn btn-primary-outline btn-sm' onClick={this.onClick}>Load Ep</button>
    </div>
  }
})

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick (episode_url) {
      dispatch(requestEpisode(episode_url))
    }
  }
}

export const EpisodeInputBox = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {pure: true}
)(EpisodeInputBoxView)
