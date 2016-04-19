import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { requestPosts } from '../../media/index.jsx'

export const EpisodeInputBoxView = React.createClass({
  propTypes: {
    onClick: PropTypes.func.isRequired
  },
  getInitialState () {
    return {value: ''}
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
        type={'text'}
        value={this.state.value}
        onChange={this.handleChange} />
      <button onClick={this.onClick}>Load Ep</button>
    </div>
  }
})

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick (episodeUrl) {
      dispatch(requestPosts(episodeUrl))
    }
  }
}

export const EpisodeInputBox = connect(
  mapStateToProps,
  mapDispatchToProps
)(EpisodeInputBoxView)
