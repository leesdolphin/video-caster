import React from 'react'
import ReactDOM from 'react-dom'

import {createStore, applyMiddleware, combineReducers} from 'redux'
import { Provider } from 'react-redux'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'

import {castSender, castMediaManager} from './react-redux-chromecast-sender'
import * as chromecast_events from './react-redux-chromecast-sender/constants'

import { List, Map } from 'immutable'

import { swapImmutableList } from './utils/index'

import { Main } from './components/root'
import * as media from './media/index'
import * as play_queue from './play_queue/index'

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
function episodes_reducer (state = {}, event) {
  const new_state = Object.assign({}, state)
  switch (event.type) {
    case media.EPISODE_LOAD_STARTED:
      new_state[event.episode_url] = Object.assign(
        {},
        new_state[event.episode_url],
        event.known_data,
        {
          episode_url: event.episode_url,
          state: 'Loading',
          error: null
        }
      )
      return new_state
    case media.EPISODE_LOAD_FAILED:
      // We keep the old data around in case it is useful.
      new_state[event.episode_url] = Object.assign(
        {},
        new_state[event.episode_url],
        {
          episode_url: event.episode_url,
          state: 'Failed',
          error: event.error
        }
      )
      return new_state
    case media.EPISODE_LOAD_SUCCEEDED:
      new_state[event.episode_url] = Object.assign(
        {},
        event.episode_data,
        {
          episode_url: event.episode_url,
          state: 'Loaded',
          error: null
        }
      )
      return new_state
    default:
      return state
  }
}

function series_reducer (state = {}, event) {
  const new_state = Object.assign({}, state)
  switch (event.type) {
    case media.SERIES_LOAD_STARTED:
      new_state[event.series_url] = Object.assign(
        {},
        new_state[event.series_url],
        event.known_data,
        {
          series_url: event.series_url,
          state: 'Loading',
          error: null
        }
      )
      return new_state
    case media.SERIES_LOAD_FAILED:
      // We keep the old data around in case it is useful.
      new_state[event.series_url] = Object.assign(
        {},
        new_state[event.series_url],
        {
          series_url: event.series_url,
          state: 'Failed',
          error: event.error
        }
      )
      return new_state
    case media.SERIES_LOAD_SUCCEEDED:
      new_state[event.series_url] = Object.assign(
        {},
        event.series_data,
        {
          series_url: event.series_url,
          state: 'Loaded',
          error: null
        }
      )
      return new_state
    default:
      return state
  }
}

function play_queue_reducer (state = List(), event) {
  switch (event.type) {
    case play_queue.ADD_EPISODE:
      const episodes = List(event.episodes || [event.episode])
      return state.concat(episodes)
    case play_queue.REMOVE_EPISODE:
      const index = event.index || 0
      return state.remove(index)
    case play_queue.REORDER_EPISODES:
      return swapImmutableList(state, Map(event.swapedIndexes))
  }
  return state
}

const reducer = combineReducers({
  api_available: api_available_reducer,
  session: session_reducer,
  media: media_reducer,
  discovering: dicovering_reducer,
  episodes: episodes_reducer,
  series: series_reducer,
  play_queue: play_queue_reducer
})

function entrypoint (domElm) {
  const middleware = [
    castSender(
      'CC1AD845', // AppId - chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
      'urn:x-cast:com.google.cast.media' // namespace for communication (namespace must match on receiver)
    ),
    castMediaManager(),
    createLogger({duration: true, collapsed: true, logErrors: false})
  ]
  const store = createStore(reducer, applyMiddleware(thunk, ...middleware))
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
