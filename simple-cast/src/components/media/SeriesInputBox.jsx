import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { requestSeries } from '../../media/index.jsx'

export const SeriesInputBoxView = React.createClass({
  propTypes: {
    onClick: PropTypes.func.isRequired
  },
  getInitialState () {
    return {value: 'http://kisscartoon.me/Cartoon/Steven-Universe-Season-02'}
  },
  handleChange (event) {
    this.setState({value: event.target.value})
  },
  onClick (event) {
    event.preventDefault()
    return this.props.onClick(this.state.value)
  },
  render () {
    return <form ref='form' onSubmit={this.onClick}>
      <input
        className='form-control'
        type={'text'}
        value={this.state.value}
        onChange={this.handleChange} />
      <button
        className='btn btn-primary-outline btn-sm'
        type='submit'>
          Load Series
      </button>
    </form>
  }
})

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick (seriesUrl) {
      dispatch(requestSeries(seriesUrl))
    }
  }
}

export const SeriesInputBox = connect(
  mapStateToProps,
  mapDispatchToProps
)(SeriesInputBoxView)
