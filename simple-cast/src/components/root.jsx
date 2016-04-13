/* eslint-env es6*/
import React from 'react'
import { connect } from 'react-redux'

import { PlaybackContainer } from './chromecast.jsx'
// import { Header } from './header.jsx'

console.log(Promise)

export const MainView = React.createClass({
  render () {
    if (this.props.media_available){
      return <PlaybackContainer />
    } else {
      return <span />
    }
  }
})

export const Main = connect(
  (state) => {
    return {media_available: !!state.media}
  },
  () => { return {} }
)(MainView)
