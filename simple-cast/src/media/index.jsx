import { loadEpisode } from './episode-loader.jsx'
export const REQUEST_EPISODE = 'kiss.media.request_episode'
export const EPISODE_LOAD_STARTED = 'kiss.media.episode.load.start'
export const EPISODE_LOAD_FAILED = 'kiss.media.episode.load.fail'
export const EPISODE_LOAD_SUCCEEDED = 'kiss.media.episode.load.success'

export function requestPosts (episode_url) {
  return {
    type: REQUEST_EPISODE,
    episode_url
  }
}

export function episode_middleware () {
  return ({dispatch, getState}) => {
    return (next) => (action) => {
      if (action.type === REQUEST_EPISODE) {
        const episode_url = action.episode_url
        loadEpisode(episode_url).then(function (episode_data) {
          dispatch({
            episode_data,
            episode_url,
            type: EPISODE_LOAD_SUCCEEDED
          })
        }).catch(function () {
          dispatch({
            episode_url,
            type: EPISODE_LOAD_FAILED
          })
        })
        dispatch({
          episode_url,
          type: EPISODE_LOAD_STARTED
        })
      } else {
        next(action)
      }
    }
  }
}
