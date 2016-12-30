import assert from 'assert'

import { loadEpisode, buildCastMedia } from './episode-loader.jsx'
import { loadSeries } from './series-loader.jsx'
import { parseUserUrl } from '../utils/index'

export const EPISODE_LOAD_STARTED = 'kiss.media.episode.load.start'
export const EPISODE_LOAD_FAILED = 'kiss.media.episode.load.fail'
export const EPISODE_LOAD_SUCCEEDED = 'kiss.media.episode.load.success'
export const EPISODE_UPDATE_STARTED = 'kiss.media.episode.update.start'
export const EPISODE_UPDATE_SUCCEEDED = 'kiss.media.episode.update.success'
export const DELETE_EPISODE = 'kiss.media.episode.delete'

export const SERIES_LOAD_STARTED = 'kiss.media.series.load.start'
export const SERIES_LOAD_FAILED = 'kiss.media.series.load.fail'
export const SERIES_LOAD_SUCCEEDED = 'kiss.media.series.load.success'
export const DELETE_SERIES = 'kiss.media.series.delete'

export function requestEpisode (episodeUrl, knownData = {}, loadMore = true) {
  return (dispatch, getState) => {
    if (!episodeUrl) {
      throw new Error('Episode URL is not given ... what am I to do?')
    }
    dispatch({
      episodeUrl,
      knownData,
      type: EPISODE_LOAD_STARTED
    })
    return loadEpisode(episodeUrl).then(function (episodeData) {
      episodeData.episodeUrl = episodeUrl
      dispatch({
        episodeData,
        episodeUrl,
        type: EPISODE_LOAD_SUCCEEDED
      })
      if (loadMore) {
        if (hasNotItem(getState().series, episodeData.seriesLink)) {
          dispatch(requestSeries(episodeData.seriesLink))
        }
        for (const url of [episodeData.prevEpisode, episodeData.nextEpisode]) {
          if (hasNotItem(getState().episodes, url)) {
            dispatch(requestEpisodeRel(url, episodeData))
          }
        }
      }
    }).catch(function (error) {
      dispatch({
        episodeUrl,
        error,
        type: EPISODE_LOAD_FAILED
      })
    })
  }
}

export function requestEpisodeRel (episodeUrl, anotherEpisodesData) {
  // Loads `episodeUrl`, and provides some extra information.
  // Assumes the series is the same; may also inferr episode number & prev/next urls.
  const knownData = {
    seriesLink: anotherEpisodesData.seriesLink
  }
  if (episodeUrl === anotherEpisodesData.prevEpisode) {
    // The requested episode is before the 'rel' epsiode. Add that info
    knownData.nextEpisode = anotherEpisodesData.episodeUrl
    knownData.number = anotherEpisodesData.number - 1
  } else if (episodeUrl === anotherEpisodesData.nextEpisode) {
    // The requested episode is after the 'rel' epsiode. Add that info
    knownData.prevEpisode = anotherEpisodesData.episodeUrl
    knownData.number = anotherEpisodesData.number + 1
  }
  return requestEpisode(episodeUrl, knownData)
}

export function requestSeries (seriesUrl, knownData = {}, loadMore = true) {
  seriesUrl = parseUserUrl(seriesUrl)
  return function (dispatch, getState) {
    dispatch({
      seriesUrl,
      knownData,
      type: SERIES_LOAD_STARTED
    })
    return loadSeries(seriesUrl).then(function (seriesData) {
      seriesData.seriesUrl = seriesUrl
      dispatch({
        seriesData,
        seriesUrl,
        type: SERIES_LOAD_SUCCEEDED
      })
      const state = getState()
      if (!loadMore || !state.episodes) {
        return
      }
      seriesData.episodes.forEach(function (episodeUrl, idx, eps) {
        if (hasNotItem(state.episodes, episodeUrl)) {
          dispatch(requestEpisodeFromSeries(episodeUrl, seriesData))
        }
      })
    }).catch(function (error) {
      dispatch({
        seriesUrl,
        error,
        type: SERIES_LOAD_FAILED
      })
    })
  }
}

export function requestEpisodeFromSeries (episodeUrl, series) {
  return function (dispatch, getState) {
    const knownData = {
      seriesLink: series.seriesUrl,
      title: series.episodeNames[episodeUrl]
    }
    const idx = series.episodes.indexOf(episodeUrl)
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
    return dispatch(requestEpisode(episodeUrl, knownData, false))
  }
}

export function getEpisodeMedia (episodeUrl, quality = false) {
  // Get the chromecast media object and store it.
  return (dispatch, getState) => {
    const episodeData = () => getState().episodes[episodeUrl]
    const seriesData = () => getState().series[episodeData().seriesLink]
    const {media, defaultQuality} = episodeData()
    if (quality === false) {
      quality = defaultQuality
    }
    assert(media.has(quality))
    dispatch({
      episodeUrl,
      type: EPISODE_UPDATE_STARTED
    })
    return Promise.resolve().then(() => {
      // We have a resolved media URL
      return buildCastMedia(episodeData(), seriesData(), quality)
    }).then(({resolvedUrl, castMedia}) => {
      return dispatch({
        episodeUrl,
        episodeData: {
          castMedia: episodeData().castMedia.set(quality, castMedia),
          resolvedMedia: episodeData().resolvedMedia.set(quality, resolvedUrl)
        },
        type: EPISODE_UPDATE_SUCCEEDED
      })
    }).catch(() => dispatch({episodeUrl, type: EPISODE_LOAD_FAILED}))
  }
}

function hasItem (itemDict, itemKey) {
  return (
    itemDict && itemKey && itemDict[itemKey] &&
    (
      itemDict[itemKey].state === 'Loaded' ||
      itemDict[itemKey].state === 'Loading'
    )
  )
}

function hasNotItem (itemDict, itemKey) {
  return itemDict && itemKey && !hasItem(itemDict, itemKey)
}
