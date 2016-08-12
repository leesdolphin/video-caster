import React, { PropTypes } from 'react'

import { connect } from 'react-redux'
import { createSelector } from 'reselect'

import { SeriesDisplay } from './SeriesDisplay.jsx'

export const SeriesListView = React.createClass({
  propTypes: {
    series: PropTypes.arrayOf(React.PropTypes.object).isRequired
  },
  render: function () {
    const rows = []
    this.props.series.forEach((series) => {
      rows.push(
        <SeriesDisplay
          seriesUrl={series.seriesUrl}
          key={series.seriesUrl} />
      )
    })
    // if (rows.length === 0 || (rows.length === 1 && previous_type === 'space')) {
    //   // We have nothing, so we'll just show a blank div.
    //   // Or we just have a spacer element; so we'll also show a blank div.
    //   return <div />
    // }
    return <div>{rows}</div>
  }
})

const allSeriesSelector = (state) => state.series
const seriesTitleSort = (a, b) => {
  if (a.title < b.title) {
    return -1
  } else if (a.title > b.title) {
    return 1
  } else {
    return 0
  }
}

const mapStateToProps = createSelector(
  createSelector(
    allSeriesSelector,
    (allSeries) => {
      const seriesList = []
      for (const seriesUrl in allSeries) {
        seriesList.push(allSeries[seriesUrl])
      }
      seriesList.sort(seriesTitleSort)
      return seriesList
    }
  ),
  (seriesList) => {
    return {
      series: seriesList
    }
  }
)

const mapDispatchToProps = (dispatch, ownProps) => {
  return {}
}

export const SeriesList = connect(
  mapStateToProps,
  mapDispatchToProps
)(SeriesListView)
