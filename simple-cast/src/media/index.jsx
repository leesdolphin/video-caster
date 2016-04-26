import { loadEpisode } from './episode-loader.jsx'
import { loadSeries } from './series-loader.jsx'

export const REQUEST_EPISODE = 'kiss.media.request_episode'
export const EPISODE_LOAD_STARTED = 'kiss.media.episode.load.start'
export const EPISODE_LOAD_FAILED = 'kiss.media.episode.load.fail'
export const EPISODE_LOAD_SUCCEEDED = 'kiss.media.episode.load.success'

export const REQUEST_SERIES_INFORMATION = 'kiss.media.request_series'
export const SERIES_LOAD_STARTED = 'kiss.media.series.load.start'
export const SERIES_LOAD_FAILED = 'kiss.media.series.load.fail'
export const SERIES_LOAD_SUCCEEDED = 'kiss.media.series.load.success'

export function requestEpisode (episode_url) {
  return {
    type: REQUEST_EPISODE,
    episode_url
  }
}

export function requestSeries (series_url) {
  return {
    type: REQUEST_SERIES_INFORMATION,
    series_url
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
        }).catch(function (error) {
          dispatch({
            episode_url,
            error,
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

export function series_middleware () {
  return ({dispatch, getState}) => {
    return (next) => (action) => {
      if (action.type === REQUEST_SERIES_INFORMATION) {
        const series_url = action.series_url
        loadSeries(series_url).then(function (series_data) {
          dispatch({
            series_data,
            series_url,
            type: SERIES_LOAD_STARTED
          })
        }).catch(function (error) {
          dispatch({
            series_url,
            error,
            type: SERIES_LOAD_FAILED
          })
        })
        dispatch({
          series_url,
          type: SERIES_LOAD_SUCCEEDED
        })
      } else {
        next(action)
      }
    }
  }
}
