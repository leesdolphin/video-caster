import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { requestSeries } from '../../media/index.jsx'

export const SeriesInputBoxView = React.createClass({
  propTypes: {
    onClick: PropTypes.func.isRequired
  },
  getInitialState () {
    return {value: 'https://kissanime.to/Anime/Sailor-Moon-R'}
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
      <button onClick={this.onClick}>Load Series</button>
    </div>
  }
})

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick (Series_url) {
      dispatch(requestSeries(Series_url))
    }
  }
}

export const SeriesInputBox = connect(
  mapStateToProps,
  mapDispatchToProps
)(SeriesInputBoxView)
