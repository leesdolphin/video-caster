import React from 'react'
import ReactDOM from 'react-dom'

import {createStore, applyMiddleware, combineReducers} from 'redux'
import { Provider } from 'react-redux'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'

import * as storage from 'redux-storage'
import createEngine from 'redux-storage-engine-localstorage'
import immutablejs from 'redux-storage-decorator-immutablejs'

import {castSender, castMediaManager} from './react-redux-chromecast-sender'
import * as chromecast_events from './react-redux-chromecast-sender/constants'

import { List, Map, fromJS } from 'immutable'

import { swapImmutableList } from './utils/index'
import { kissDecrypt } from './utils/kiss_decrypt'

import { Main } from './components/root'
import * as media from './media/index'
import * as play_queue from './play_queue/index'

import { ChromecastSessionManager } from './CastManager'

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
  const newState = Object.assign({}, state)
  switch (event.type) {
    case media.EPISODE_LOAD_STARTED:
    case media.EPISODE_UPDATE_STARTED:
      newState[event.episodeUrl] = Object.assign(
        {},
        newState[event.episodeUrl],
        event.knownData,
        {
          episodeUrl: event.episodeUrl,
          state: 'Loading',
          error: null
        }
      )
      return newState
    case media.EPISODE_LOAD_FAILED:
      // We keep the old data around in case it is useful.
      newState[event.episodeUrl] = Object.assign(
        {},
        newState[event.episodeUrl],
        {
          episodeUrl: event.episodeUrl,
          state: 'Failed',
          error: event.error
        }
      )
      return newState
    case media.EPISODE_LOAD_SUCCEEDED:
      newState[event.episodeUrl] = Object.assign(
        {},
        event.episodeData,
        {
          episodeUrl: event.episodeUrl,
          state: 'Loaded',
          error: null
        }
      )
      return newState
    case media.EPISODE_UPDATE_SUCCEEDED:
      newState[event.episodeUrl] = Object.assign(
        {},
        state[event.episodeUrl],
        event.episodeData,
        {
          episodeUrl: event.episodeUrl,
          state: 'Loaded',
          error: null
        }
      )
      return newState
    default:
      return state
  }
}

function series_reducer (state = {}, event) {
  const newState = Object.assign({}, state)
  switch (event.type) {
    case media.SERIES_LOAD_STARTED:
      newState[event.seriesUrl] = Object.assign(
        {},
        newState[event.seriesUrl],
        event.knownData,
        {
          seriesUrl: event.seriesUrl,
          state: 'Loading',
          error: null
        }
      )
      return newState
    case media.SERIES_LOAD_FAILED:
      // We keep the old data around in case it is useful.
      newState[event.seriesUrl] = Object.assign(
        {},
        newState[event.seriesUrl],
        {
          seriesUrl: event.seriesUrl,
          state: 'Failed',
          error: event.error
        }
      )
      return newState
    case media.SERIES_LOAD_SUCCEEDED:
      newState[event.seriesUrl] = Object.assign(
        {},
        event.seriesData,
        {
          seriesUrl: event.seriesUrl,
          state: 'Loaded',
          error: null
        }
      )
      return newState
    case media.EPISODE_LOAD_SUCCEEDED:
      const episode = event.episodeData
      if (!episode) {
        return state
      }
      const episodeUrl = episode.url
      const episodeIdx = episode.number
      const episodeName = episode.title
      const episodeSeries = episode.seriesLink
      const series = newState[episodeSeries]
      if (!series) {
        return state
      }
      const seriesIdx = series.episodes.indexOf(episodeUrl)
      if (series.episodes[episodeIdx] !== episodeUrl ||
          seriesIdx === -1 ||
          series.episodeNames[episodeUrl] !== episodeName) {
        const newSeriesEps = Array.from(series.episodes)
        if (seriesIdx !== -1) {
          newSeriesEps.splice(seriesIdx, 1)
        }
        newSeriesEps[episodeIdx] = episodeUrl
        const newNames = Object.assign(
          {}, series.episodeNames
        )
        newNames[episodeUrl] = episodeName
        newState[episodeSeries] = Object.assign(
          {},
          series,
          {
            episodes: newSeriesEps,
            episodeNames: newNames
          }
        )
        return newState
      } else {
        return state
      }
    default:
      return state
  }
}

function playQueueReducer (state = List(), event) {
  if (!List.isList(state)) {
    state = List(state)
  }
  switch (event.type) {
    case play_queue.ADD_EPISODE:
      const episodes = List([event.episodeUrl])
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
  playQueue: playQueueReducer
})


const mediaQueueLoaderMiddleware = function () {
  return ({dispatch, getState}) => (next) => (action) => {
    // console.log(action)
    let re = null
    switch (action.type) {
      case play_queue.ADD_EPISODE:
      case play_queue.REORDER_EPISODES:
      case 'REDUX_STORAGE_LOAD':
        re = next(action)
        break
      default:
        return next(action)
    }
    const state = getState()
    state.playQueue.forEach(function (episodeUrl) {
      const ep = state.episodes[episodeUrl]
      if (ep.state !== 'Loading' ||
          !ep.castMedia || ep.castMedia.count() === 0 ||
          !ep.resolvedMedia || ep.resolvedMedia.count() === 0) {
        dispatch(media.getEpisodeMedia(episodeUrl))
      }
    })
    return re
  }
}


const animationFrameMiddleware = function () {
  return ({dispatch, getState}) => (next) => {
    let frameRequest = null
    let actionList = List()
    function animFrame (startTime) {
      // Don't start anything 5 milliseconds before the end of a 60FPS frame.
      const finishBy = startTime + (1000 / 60) - 5
      while (actionList.size && window.performance.now() < finishBy) {
        // While we have time and items
        const item = actionList.first()
        actionList = actionList.shift()
        next(item)
      }
      frameRequest = requestNext()
    }
    function requestNext () {
      if (actionList.size) {
        return window.requestAnimationFrame(animFrame)
      } else {
        return null
      }
    }
    return (action) => {
      actionList = actionList.push(action)
      if (!frameRequest) {
        frameRequest = requestNext()
      }
    }
  }
}

const EPISODE_IM_JS_KEYS = ['media', 'castMedia', 'resolvedMedia']

const episodeLoader = (engine) => {
  return {
    ...engine,
    load () {
      return engine.load().then(function (result) {
        if (result['episodes']) {
          Object.values(result['episodes']).forEach((ep) => {
            EPISODE_IM_JS_KEYS.forEach((key) => {
              ep[key] = fromJS(ep[key])
            })
            if (ep['state'] !== 'Loaded') {
              ep['state'] = 'Pending'
            }
          })
        }
        delete result['session']
        delete result['discovering']
        delete result['api_available']
        return result
      })
    }
  }
}

const engine = episodeLoader(
  immutablejs(
    createEngine('my-save-key'),
    [
      ['playQueue']
    ]
  )
)

function entrypoint (domElm) {
  const middleware = [
    // animationFrameMiddleware(),
    castSender(
      'CC1AD845', // AppId - chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
      'urn:x-cast:com.google.cast.media' // namespace for communication (namespace must match on receiver)
    ),
    mediaQueueLoaderMiddleware(),
    castMediaManager(),
    // createLogger({duration: true, collapsed: true, logErrors: true}),
    storage.createMiddleware(engine)
  ]
  const store = createStore(storage.reducer(reducer), applyMiddleware(thunk, ...middleware))

  storage.createLoader(engine)(store)
  // setInterval(() => {
  //   if (store.getState()['media']) {
  //     // store.getState()['media'].getStatus(null, () => {
  //     //   console.log(arguments)
  //     // }, () => {
  //     //   console.log(arguments)
  //     // })
  //   }
  // }, 1000)

  // const sessionManager = new ChromecastSessionManager()
  // sessionManager.initializeCastPlayer()
  return () => {
    ReactDOM.render(
      (<Provider store={store}>
        <Main />
      </Provider>),
      domElm
    )
  }
}

export { entrypoint }
