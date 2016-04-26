import { kiss_fetch_html } from '../utils/kiss_fetch.jsx'
import { combineObjectPromises } from '../utils/index.jsx'

function loadSeriesInformation (kiss_document) {
  const series_container = kiss_document.querySelector('.bigBarContainer')
  if (!series_container) {
    return Promise.reject('Unknown format.')
  }
  const series_link = series_container.querySelector('a.bigChar')
  return {
    title: series_link.textContent.trim()
  }
}

function loadEpisodeList (kiss_document) {
  const episodeTable = kiss_document.querySelector('.episodeList table>tbody')
  if (!episodeTable) {
    return {}  // No episodes; but still a valid series(I hope).
  }
  const episodes = []
  const episodeNames = {}  // Separate to keep order, but also give this info.
  const episodeLinks = episodeTable.getElementsByTagName('a')
  for (let i = 0; i < episodeLinks.length; i++) {
    const link = episodeLinks[i]
    episodes[i] = link.href
    episodeNames[link.href] = link.textContent.trim()
  }
  return {
    episodes, episodeNames
  }
}

export function loadSeries (seriesUrl) {
  return kiss_fetch_html(seriesUrl, {
    credentials: 'include'
  }).then(function (kiss_document) {
    return combineObjectPromises(
      {url: kiss_document.url},
      loadSeriesInformation(kiss_document),
      loadEpisodeList(kiss_document)
    )
  })
}
