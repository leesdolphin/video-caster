/* global chrome*/
/**
Source taken from react-redux-chromecast-sender NPM module
*/

import invariant from 'invariant'
import { apiListener } from './apiListener'
import { discover } from './discover'

import { API_AVAILABLE, API_UNAVAILABLE, DISCOVER_START, DISCOVER_STOP, DISCOVERING,
         DISCOVERY_ERROR, RECEIVER_AVAILABLE, RECEIVER_UNAVAILABLE, SESSION_CONNECT,
         SESSION_CONNECTING, SESSION_CONNECTED, SESSION_DISCONNECT,
         SESSION_DISCONNECTING, SESSION_DISCONNECTED, SESSION_ERROR, MSG_SEND,
         MSG_SENDING, MSG_SENT, MSG_RECEIVED, MSG_ERROR, MEDIA_LOADED }
       from '../constants'

export function castSender (appId, namespace, discoveryConfig, autoDiscover = true) {
  return ({dispatch, getState}) => {
    // -----------------------------------------------------
    // Set up Chromecast comms
    let apiAvailable = false

    apiListener(() => {
      apiAvailable = true

      // notify of api available, not super useful but hey..
      dispatch({ type: API_AVAILABLE })

      if (autoDiscover) {
        dispatch({ type: DISCOVER_START })
      }
    }, (error) => {
      dispatch({ type: API_UNAVAILABLE, error })
      apiAvailable = false
    })

    // -----------------------------------------------------
    // Chromecast events

    let cancelDiscovery
    let activeSession

    // Chromecast session initialized
    function sessionListener (session) {
      activeSession = session

      dispatch({
        type: SESSION_CONNECTED,
        session})

      // set up message bus
      session.addMessageListener(namespace, (_namespace, message) => {
        const payload = JSON.parse(message)
        dispatch({
          type: MSG_RECEIVED,
          payload})
      })
    }

    // Triggers when chromecasts are available
    // Can trigger asynchronously if chromecasts later become available
    // for instance if switching wifi network
    function receiverListener (event) {
      switch (event) {
        case chrome.cast.ReceiverAvailability.AVAILABLE:
          dispatch({ type: RECEIVER_AVAILABLE })
          break
        case chrome.cast.ReceiverAvailability.UNAVAILABLE:
          dispatch({ type: RECEIVER_UNAVAILABLE })
          setTimeout(function () {
            dispatch({ type: DISCOVER_START })
          }, 1000)
          break
        default:
          console.warn(`Unhandled "receiveListener" event "${event}"`)
          break
      }
    }

    // -----------------------------------------------------
    // Middleware

    return (next) => (action) => {
      switch (action.type) {
        case DISCOVER_START:
          // start looking for chromecasts
          const config = Object.assign({}, {
            // how often to retry if chromecast unavailable
            retryInterval: 1000,

            // https://developers.google.com/cast/docs/reference/chrome/chrome.cast#.AutoJoinPolicy
            autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
          }, discoveryConfig, action.options) // default -> options passed to middleware -> action options
          cancelDiscovery = discover(appId, sessionListener, receiverListener, config, () => {
            dispatch({ type: DISCOVERING })
          }, (error) => {
            dispatch({ type: DISCOVERY_ERROR, error })
          })
          break
        case DISCOVER_STOP:
          if (cancelDiscovery) {
            cancelDiscovery()
            cancelDiscovery = null
          }
          break
        case SESSION_CONNECT:
          next({ type: SESSION_CONNECTING })

          window.chrome.cast.requestSession(
            sessionListener,
            (error) => {
              next({ type: SESSION_ERROR, error })
            }
          )
          break
        case SESSION_DISCONNECT:
          next({ type: SESSION_DISCONNECTING })
          activeSession.stop(() => {
            next({ type: SESSION_DISCONNECTED })
          }, (error) => {
            next({ type: SESSION_ERROR, error })
          })
          break
        case MSG_SEND:
          const {payload} = action

          invariant(!!payload, 'Can not send message without payload')

          if (!activeSession) {
            next({ type: MSG_ERROR, error: 'No active session' })
            return
          }

          next({ type: MSG_SENDING, payload })
          activeSession.sendMessage(namespace, JSON.stringify(payload), () => {
            next({ type: MSG_SENT })
          }, (error) => {
            next({ type: MSG_ERROR, error })
          })
          break
        default:
          return next(action)
      }
    }
  }
}
