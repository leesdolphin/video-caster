import { List, Map } from 'immutable'

import assert from 'assert'

import { checkResponse, kissFetch, kissParseHtml } from '../utils/kiss_fetch'
import { combineObjectPromises, parseUserUrl, rateLimit } from '../utils/index.jsx'
import { KissDecryptor } from '../utils/kiss_decrypt'

const kissCartoonDecryptor = (() => {
  let decryptor = null
  return function (ciphertext) {
    return Promise.resolve().then(() => {
      if (!decryptor) {
        decryptor = new KissDecryptor()
      }
      return decryptor.decrypt(ciphertext)
    })
  }
})()

function loadSiblingEpisodes (kissDocument) {
  function imageLink (id) {
    const arrowImg = kissDocument.getElementById(id)
    if (arrowImg) {
      const parent = arrowImg.parentNode
      if (parent && parent.tagName === 'A' && parent.href) {
        return parent.href
      }
    }
    return null
  }
  return {
    prevEpisode: imageLink('btnPrevious'),
    nextEpisode: imageLink('btnNext')
  }
}

function loadEpisodeInfo (kissDocument) {
  const episodeSelector = kissDocument.getElementById('selectEpisode')
  return {
    number: episodeSelector.selectedIndex,
    title: episodeSelector.selectedOptions[0].text.trim()
  }
}

function loadMedia (kissDocument) {
  let defaultQuality
  const qualitySelector = kissDocument.getElementById('selectQuality')
  let qualitiesList = new List()
  let urlsPromiseList = new List()
  for (let i = 0; i < qualitySelector.childNodes.length; i++) {
    const option = qualitySelector.childNodes[i]
    if (option.tagName === 'OPTION') {
      qualitiesList = qualitiesList.push(option.textContent)
      const raw = window.atob(option.value)
      let result
      if (raw.startsWith('http://') || raw.startsWith('https://')) {
        result = raw
      } else {
        result = kissCartoonDecryptor(option.value).then(
          (url) => parseUserUrl(url, kissDocument.baseURI)
        )
      }
      urlsPromiseList = urlsPromiseList.push(result)
      if (option.selected) {
        defaultQuality = option.textContent
      }
    }
  }
  return Promise.all(urlsPromiseList.toArray()).then((urls) => {
    const qualToUrlMap = new Map(qualitiesList.zip(new List(urls)))
    return {
      defaultQuality,
      media: qualToUrlMap,
      castMedia: new Map(),
      resolvedMedia: new Map()
    }
  })
}

function loadSeriesLink (kissDocument) {
  const navbar = kissDocument.getElementById('navsubbar')
  if (navbar) {
    const links = navbar.getElementsByTagName('a')
    if (links) {
      return {
        seriesLink: links[0].href
      }
    }
  }
  return {}
}

const htmlLimiter = rateLimit(2, 'html')

export function loadEpisode (episodeUrl) {
  return kissFetch(episodeUrl, {
    credentials: 'include'
  }).then(htmlLimiter((response) => {
    return kissParseHtml(response).then((kissDocument) => {
      // We combine all these objects together; but we try to resolve
      // any promises first; just incase we want to add loading of other
      // information here.
      return combineObjectPromises(
        {url: kissDocument.url},
        loadSiblingEpisodes(kissDocument),
        loadEpisodeInfo(kissDocument),
        loadMedia(kissDocument),
        loadSeriesLink(kissDocument)
      )
    })
  }))
}

export function resolveMediaUrl (mediaUrl) {
  /**
   * Take a media URL and return promise that will resolve to the media URL
   * after following the redirects.
   */
  const url = new window.URL(mediaUrl)
  // This allows us to make the request because we have specified we are allowed
  // to access any https:// website, but not necessarily and http://
  url.protocol = 'https:'
  return window.fetch(url, {
    method: 'HEAD',
    redirect: 'follow',
    referrer: 'no-referrer',
    cors: 'no-cors'
  }).then(checkResponse)
}

export function buildCastMedia (episode, series, quality) {
  const {resolvedMedia, media} = episode
  return Promise.resolve(
    resolvedMedia.get(quality) || media.get(quality)
  ).then((url) => {
    assert(url)
    return resolveMediaUrl(url)
  }).then((response) => {
    const contentType = response.headers.get('Content-Type') || 'video/mp4'
    const resolvedUrl = response.url
    return {contentType, resolvedUrl}
  }).then(({contentType, resolvedUrl}) => {
    const metadata = new window.chrome.cast.media.TvShowMediaMetadata()
    metadata.episode = episode.number
    metadata.title = episode.title
    metadata.seriesTitle = series.title
    metadata.images = []  // Images is kinda-hard to get(needs another request.)

    const castMedia = new window.chrome.cast.media.MediaInfo(resolvedUrl, contentType)
    castMedia.metadata = metadata
    castMedia.customData = {
      episodeUrl: episode.episodeUrl
    }
    return {resolvedUrl, castMedia}
  })
}
