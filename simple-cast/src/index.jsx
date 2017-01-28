import React from 'react'
import ReactDOM from 'react-dom'

import {createStore, applyMiddleware, combineReducers} from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import * as storage from 'redux-storage'
import createEngine from 'redux-storage-engine-localstorage'

import {castSender, castMediaManager} from './react-redux-chromecast-sender'
import * as chromecastEvents from './react-redux-chromecast-sender/constants'

import { Main } from './components/root'
import * as media from './media/index'
import * as playQueue from './play_queue/index'

import { ChromecastSessionManager } from './CastManager'

const apiAvailableReducer = function (state = false, event) {
  switch (event.type) {
    case chromecastEvents.API_AVAILABLE:
    case chromecastEvents.API_UNAVAILABLE:
      return event.type === chromecastEvents.API_AVAILABLE
    default:
      return state
  }
}
const dicoveringReducer = function (state = false, event) {
  switch (event.type) {
    case chromecastEvents.DISCOVERING:
      return true
    case chromecastEvents.RECEIVER_AVAILABLE:
    case chromecastEvents.RECEIVER_UNAVAILABLE:
      return false
    default:
      return state
  }
}
const sessionReducer = function (state = false, event) {
  switch (event.type) {
    case chromecastEvents.SESSION_CONNECTED:
      return event.session
    case chromecastEvents.SESSION_DISCONNECTED:
      return false
    default:
      return state
  }
}
const mediaReducer = function (state = false, event) {
  switch (event.type) {
    case chromecastEvents.MEDIA_LOADED:
    case chromecastEvents.MEDIA_STATUS_UPDATED:
      return event.media
    case chromecastEvents.SESSION_DISCONNECTED:
      return false
    default:
      return state
  }
}
function episodesReducer (state = {}, event) {
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

function seriesReducer (state = {}, event) {
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

function playQueueReducer (state = [], event) {
  const newState = Array.from(state)
  switch (event.type) {
    case playQueue.ADD_EPISODE:
      const episodes = Array.from([event.episodeUrl])
      newState.push(episodes)
      return newState
    case playQueue.REMOVE_EPISODE:
      const index = event.index || 0
      newState.splice(index, 1)
      return newState
    case playQueue.REORDER_EPISODES:
      throw Error('*void screaming*')
  }
  return state
}

const reducer = combineReducers({
  api_available: apiAvailableReducer,
  session: sessionReducer,
  media: mediaReducer,
  discovering: dicoveringReducer,
  episodes: episodesReducer,
  series: seriesReducer,
  playQueue: playQueueReducer
})

const mediaQueueLoaderMiddleware = function () {
  return ({dispatch, getState}) => (next) => (action) => {
    // console.log(action)
    let re = null
    switch (action.type) {
      case playQueue.ADD_EPISODE:
      case playQueue.REORDER_EPISODES:
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

const EPISODE_MAP_JS_KEYS = ['media', 'castMedia', 'resolvedMedia']

const episodeLoader = (engine) => {
  return {
    ...engine,
    load () {
      return engine.load().then(function (result) {
        if (result['episodes']) {
          Object.values(result['episodes']).forEach((ep) => {
            EPISODE_MAP_JS_KEYS.forEach((key) => {
              if (key.length === undefined) {
                ep[key] = new Map([])
              } else {
                ep[key] = new Map(ep[key] || [])
              }
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
  createEngine('my-save-key')
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

  const sessionManager = new ChromecastSessionManager()
  sessionManager.initializeCastPlayer()
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
