import './lib/hatrack.js'
import React from 'react'
import ReactDOM from 'react-dom'

import { Main } from './components/root.jsx'

import {createStore, applyMiddleware} from 'redux'
import {castSender} from './react-redux-chromecast-sender'
import * as chromecast_events from './react-redux-chromecast-sender/constants'

function reducer (state, event) {
  switch (event.type) {
    case chromecast_events.API_AVAILABLE:
    case chromecast_events.API_UNAVAILABLE:
      return Object.assign({}, state, {
        api_available: event.type === chromecast_events.API_AVAILABLE
      })
    case chromecast_events.SESSION_CONNECTED:
      return Object.assign({}, state, {
        session: event.session
      })
    default:
      console.log('Event', event)
  }
  return state
}

function entrypoint (domElm) {
  const middleware = [castSender(
    'CC1AD845', // AppId - chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
    'urn:x-cast:com.google.cast.media' // namespace for communication (namespace must match on receiver)
  )]
  const store = applyMiddleware(...middleware)(createStore)(reducer, {});
  console.log(store.getState())
  store.subscribe(() =>
    console.log(store.getState())
  )
  return ReactDOM.render(
    (<Main store />),
    domElm
  )
}

export { entrypoint }
