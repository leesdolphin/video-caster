import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { Main } from './components/root.jsx'

import {createStore, applyMiddleware, combineReducers} from 'redux'
import {castSender, castMediaManager} from './react-redux-chromecast-sender'
import * as chromecast_events from './react-redux-chromecast-sender/constants'

const api_available_reducer = function (state = false, event) {
  switch (event.type) {
    case chromecast_events.API_AVAILABLE:
    case chromecast_events.API_UNAVAILABLE:
      return event.type === chromecast_events.API_AVAILABLE
    default:
      return state
  }
}
const dicovering_reducer = function (state = false, event) {
  switch (event.type) {
    case chromecast_events.DISCOVERING:
      return true
    case chromecast_events.RECEIVER_AVAILABLE:
    case chromecast_events.RECEIVER_UNAVAILABLE:
      return false
    default:
      return state
  }
}
const session_reducer = function (state = false, event) {
  switch (event.type) {
    case chromecast_events.SESSION_CONNECTED:
      return event.session
    case chromecast_events.SESSION_DISCONNECTED:
      return false
    default:
      return state
  }
}
const media_reducer = function (state = false, event) {
  switch (event.type) {
    case chromecast_events.MEDIA_LOADED:
    case chromecast_events.MEDIA_STATUS_UPDATED:
      return event.media
    case chromecast_events.SESSION_DISCONNECTED:
      return false
    default:
      return state
  }
}
const reducer = combineReducers({
  api_available: api_available_reducer,
  session: session_reducer,
  media: media_reducer,
  discovering: dicovering_reducer
})

function entrypoint (domElm) {
  const middleware = [castSender(
    'CC1AD845', // AppId - chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
    'urn:x-cast:com.google.cast.media' // namespace for communication (namespace must match on receiver)
  ), castMediaManager()]
  const store = applyMiddleware(...middleware)(createStore)(reducer, {})
  setInterval(() => {
    if (store.getState()['media']) {
      store.getState()['media'].getStatus(null, () => {}, () => {})
    }
  }, 1000)
  return ReactDOM.render(
    (<Provider store={store}><Main /></Provider>),
    domElm
  )
}

export { entrypoint }
