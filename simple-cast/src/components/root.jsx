/* eslint-env es6*/
import React from 'react'
import { connect } from 'react-redux'

import { PlaybackContainer } from './chromecast.jsx'
import { LoadingSpinner } from './generic/LoadingSpinner.jsx'
import { EpisodeInputBox } from './media/EpisodeInputBox.jsx'
// import { Header } from './header.jsx'

console.log(Promise)

export const MainView = React.createClass({
  render () {
    if (this.props.media_available) {
      return <PlaybackContainer />
    } else {
      return <div>
        <LoadingSpinner />
        <br />
        <EpisodeInputBox />
      </div>
    }
  }
})

export const Main = connect(
  (state) => {
    return {media_available: !!state.media}
  },
  () => { return {} }
)(MainView)
