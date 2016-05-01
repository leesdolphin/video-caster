import React from 'react'

import { connect } from 'react-redux'

import { PlaybackContainer } from './chromecast.jsx'
import { SeriesList } from './media/SeriesList.jsx'
import { SeriesInputBox } from './media/SeriesInputBox.jsx'
// import { Header } from './header.jsx'

export const MainView = React.createClass({
  render () {
    if (this.props.media_available) {
      return <PlaybackContainer />
    } else {
      return <div className='container-fluid'>
        <div className='row'>
          <div className='col-xs-12 col-md-8 col-md-push-2'>
            <h1>Welcome</h1>
            <p className='lead'>
              Something Something darkside
            </p>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-4 col-md-push-8 col-xs-12'>
            Hello
          </div>
          <div className='col-md-8 col-md-pull-4 col-xs-12'>
            <SeriesInputBox />
            <SeriesList />
          </div>
        </div>
      </div>
    }
  }
})

export const Main = connect(
  (state) => {
    return {media_available: !!state.media}
  },
  null,
  null,
  {pure: true}
)(MainView)
