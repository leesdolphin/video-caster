/* eslint-env es6*/
import React from 'react'
import { connect } from 'react-redux'

import { PlaybackContainer } from './chromecast.jsx'
import { EpisodeInputBox } from './media/EpisodeInputBox.jsx'
import { EpisodeList } from './media/EpisodeList.jsx'
import { SeriesInputBox } from './media/SeriesInputBox.jsx'
// import { Header } from './header.jsx'

console.log(Promise)

export const MainView = React.createClass({
  render () {
    if (this.props.media_available) {
      return <PlaybackContainer />
    } else {
      return <div>
        <table><td>
          <EpisodeInputBox />
          <br />
          <EpisodeList series='https://kissanime.to/Anime/Sailor-Moon-R'/>
        </td><td>
          <SeriesInputBox />
          <br />
        </td></table>
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
