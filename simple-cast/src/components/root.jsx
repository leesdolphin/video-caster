import React from 'react'

import { connect } from 'react-redux'

import { PlaybackContainer } from './chromecast'
import { CastButton } from './media/CastButton'
import { SeriesList } from './media/SeriesList'
import { SeriesInputBox } from './media/SeriesInputBox'
import { PlayQueueList } from './media/PlayQueueList'
import { FPSCounter } from './generic/FPSCounter'
// import { Header } from './header.jsx'

export const MainView = React.createClass({
  render () {
    return <div className='container-fluid'>
      <div className='row'>
        <div className='col-xs-12 col-md-8 col-md-push-2'>
          <h1>
            Welcome @{' '}
          </h1>
          <p className='lead'>
            Something Something darkside
          </p>
        </div>
      </div>
      <div className='row'>
        <div className='col-md-4 col-md-push-8 col-xs-12'>
          <h2>Play Queue <CastButton /></h2>
          <PlayQueueList />
        </div>
        <div className='col-md-8 col-md-pull-4 col-xs-12'>
          <h2>Series</h2>
          <SeriesInputBox />
          <SeriesList />
        </div>
      </div>
    </div>
  }
})

export const Main = connect(
  null,
  null,
  null,
  {pure: true}
)(MainView)
