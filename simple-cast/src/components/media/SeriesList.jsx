import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { SeriesDisplay } from './SeriesDisplay.jsx'

import { buildOrderedSeriesList } from '../../utils/Series.jsx'

export const SeriesListView = React.createClass({
  propTypes: {
    series: PropTypes.arrayOf(React.PropTypes.object).isRequired
  },
  render: function () {
    const rows = []
    this.props.series.forEach((series) => {
      if (series && series.url) {
        rows.push(<SeriesDisplay series={series} key={series.series_url} />)
        return
      }
    })
    // if (rows.length === 0 || (rows.length === 1 && previous_type === 'space')) {
    //   // We have nothing, so we'll just show a blank div.
    //   // Or we just have a spacer element; so we'll also show a blank div.
    //   return <div />
    // }
    return <div>{rows}</div>
  }
})

const mapStateToProps = (state, ownProps) => {
  return {
    series: buildOrderedSeriesList(state.series, ownProps.series)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
}

export const SeriesList = connect(
  mapStateToProps,
  mapDispatchToProps
)(SeriesListView)
