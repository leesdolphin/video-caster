import invariant from 'invariant'

import { SESSION_CONNECTED, MEDIA_ERROR, MEDIA_LOAD, MEDIA_LOADED, MEDIA_LOADING,
         MEDIA_PAUSE, MEDIA_PLAY, MEDIA_STATUS_UPDATED, MEDIA_SEEK }
       from '../constants'

export function castMediaManager () {
  return ({dispatch, getState}) => {
    let activeSession

    // -----------------------------------------------------
    // Middleware

    const mediaLoaded = (media) => {
      media.addUpdateListener((data) => {
        dispatch({ type: MEDIA_STATUS_UPDATED, media })
      })
      dispatch({ type: MEDIA_LOADED, media })
    }
    const requires_media = (fn) => {
      if (!activeSession) {
        dispatch({ type: MEDIA_ERROR, error: 'No active session' })
        return
      } else if (!activeSession.media.length) {
        dispatch({ type: MEDIA_ERROR, error: 'No media in active session' })
        return
      } else {
        return fn(activeSession.media[0])
      }
    }
    return (next) => (action) => {
      switch (action.type) {
        case SESSION_CONNECTED:
          const {session} = action
          invariant(!!session, 'No session for session connected event!?!?')
          activeSession = session
          activeSession.addMediaListener(mediaLoaded)
          next(action)
          if (activeSession.media.length > 0) {
            // Fire MEDIA_LOADED event.
            mediaLoaded(activeSession.media[0])
          }
          break
        case MEDIA_LOAD:
          const {media} = action

          invariant(!!media, 'Cannot load media without media to load.')

          if (!activeSession) {
            next({ type: MEDIA_ERROR, error: 'No active session' })
            return
          }
          const request = new window.chrome.cast.media.LoadRequest(media)

          next({ type: MEDIA_LOADING, media })
          activeSession.loadMedia(request, mediaLoaded, (error) => {
            next({ type: MEDIA_ERROR, error })
          })
          break
        case MEDIA_PLAY:
          return requires_media((media) => {
            media.play()
          })
        case MEDIA_PAUSE:
          return requires_media((media) => {
            media.pause()
          })
        case MEDIA_SEEK:
          let seek_request
          if ('seek_request' in action) {
            seek_request = action.seek_request
          } else {
            seek_request = new chrome.cast.media.SeekRequest()
            seek_request.currentTime = action.seek_time
            if ('new_state' in action) {
              seek_request.resumeState = action.new_state
            }
          }
          return requires_media((media) => {
            media.seek(seek_request, () => {}, (error) => {
              next({ type: MEDIA_ERROR, error })
            })
          })
        default:
          return next(action)
      }
    }
  }
}
