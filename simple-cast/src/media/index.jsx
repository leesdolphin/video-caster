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

export function requestEpisode (episode_url, known_data = {}, load_more = true) {
  return (dispatch, getState) => {
    if (!episode_url) {
      throw new Error('Episode URL is not given ... what am I to do?')
    }
    dispatch({
      episode_url,
      known_data,
      type: EPISODE_LOAD_STARTED
    })
    loadEpisode(episode_url).then(function (episode_data) {
      episode_data.episode_url = episode_url
      dispatch({
        episode_data,
        episode_url,
        type: EPISODE_LOAD_SUCCEEDED
      })
      if (load_more) {
        if (hasNotItem(getState().series, episode_data.seriesLink)) {
          dispatch(requestSeries(episode_data.seriesLink))
        }
        for (const url of [episode_data.prevEpisode, episode_data.nextEpisode]) {
          if (hasNotItem(getState().episodes, url)) {
            dispatch(requestEpisodeRel(url, episode_data))
          }
        }
      }
    }).catch(function (error) {
      dispatch({
        episode_url,
        error,
        type: EPISODE_LOAD_FAILED
      })
    })
  }
}

export function requestEpisodeRel (episode_url, another_episodes_data) {
  // Loads `episode_url`, and provides some extra information.
  // Assumes the series is the same; may also inferr episode number & prev/next urls.
  const known_data = {
    seriesLink: another_episodes_data.seriesLink
  }
  if (episode_url === another_episodes_data.prevEpisode) {
    // The requested episode is before the 'rel' epsiode. Add that info
    known_data.nextEpisode = another_episodes_data.episode_url
    known_data.number = another_episodes_data.number - 1
  } else if (episode_url === another_episodes_data.nextEpisode) {
    // The requested episode is after the 'rel' epsiode. Add that info
    known_data.prevEpisode = another_episodes_data.episode_url
    known_data.number = another_episodes_data.number + 1
  }
  return requestEpisode(episode_url, known_data)
}

export function requestSeries (series_url, known_data = {}, load_more = true) {
  return function (dispatch, getState) {
    dispatch({
      series_url,
      known_data,
      type: SERIES_LOAD_STARTED
    })
    setImmediate(() =>
      loadSeries(series_url).then(function (series_data) {
        series_data.series_url = series_url
        dispatch({
          series_data,
          series_url,
          type: SERIES_LOAD_SUCCEEDED
        })
        const state = getState()
        if (!load_more || !state.episodes) {
          return
        }
        series_data.episodes.forEach(function (episode_url, idx, eps) {
          if (hasNotItem(state.episodes, episode_url)) {
            dispatch(requestEpisodeFromSeries(episode_url, series_data))
          }
        })
      }).catch(function (error) {
        dispatch({
          series_url,
          error,
          type: SERIES_LOAD_FAILED
        })
      })
    )
  }
}

export function requestEpisodeFromSeries (episode_url, series) {
  return function (dispatch, getState) {
    const knownData = {
      seriesLink: series.series_url,
      title: series.episodeNames[episode_url]
    }
    const idx = series.episodes.indexOf(episode_url)
    if (idx === -1) {
      return
    }
    knownData.number = idx
    if (idx > 0) {
      knownData.prevEpisode = series.episodes[idx - 1]
    }
    if (idx < series.episodes.length - 1) {
      knownData.nextEpisode = series.episodes[idx + 1]
    }
    dispatch(requestEpisode(episode_url, knownData, false))
  }
}

function hasItem (item_dict, item_key) {
  return (
    item_dict && item_key && item_dict[item_key] &&
    (
      item_dict[item_key].state === 'Loaded' ||
      item_dict[item_key].state === 'Loading'
    )
  )
}

function hasNotItem (item_dict, item_key) {
  return item_dict && item_key && !hasItem(item_dict, item_key)
}
