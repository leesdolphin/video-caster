// import { List } from 'immutable'

import { kiss_fetch_html } from '../utils/kiss_fetch.jsx'
import { combineObjectPromises } from '../utils/index.jsx'

function loadSeriesInformation (kissDocument) {
  const seriesContainer = kissDocument.querySelector('.bigBarContainer')
  if (!seriesContainer) {
    return Promise.reject('Unknown format.')
  }
  const seriesLink = seriesContainer.querySelector('a.bigChar')
  return {
    title: seriesLink.textContent.trim()
  }
}

function loadEpisodeList (kissDocument) {
  const episodeTable = kissDocument.querySelector('.episodeList table>tbody')
  if (!episodeTable) {
    return {}  // No episodes; but still a valid series(I hope).
  }
  const episodes = []
  const episodeNames = {}  // Separate to keep order, but also give this info.
  const episodeLinks = episodeTable.getElementsByTagName('a')
  for (let i = 0; i < episodeLinks.length; i++) {
    const link = episodeLinks[i]
    // episodes.push(link.href)  // Oldest to Newest ordering
    episodes.unshift(link.href)  // Newest to Oldest ordering.
    episodeNames[link.href] = link.textContent.trim()
  }
  return {
    episodes, episodeNames
  }
}

function loadCoverImage (kissDocument) {
  const rightBoxes = kissDocument.getElementsByClassName('rightBox')
  for (let i = 0; i < rightBoxes.length; i++) {
    const rightBox = rightBoxes[i]
    const titleBars = rightBox.getElementsByClassName('barTitle')
    if (!titleBars) {
      continue
    } else if (titleBars[0].textContent.trim() === 'Cover') {
      // Found the correct block
      const images = rightBox.getElementsByTagName('img')
      if (!images) {
        continue
      }
      return {
        coverImage: images[0].src
      }
    }
  }
  return {}
}

export function loadSeries (seriesUrl) {
  return kiss_fetch_html(seriesUrl, {
    credentials: 'include'
  }).then(function (kissDocument) {
    return combineObjectPromises(
      {url: kissDocument.url},
      loadSeriesInformation(kissDocument),
      loadEpisodeList(kissDocument),
      loadCoverImage(kissDocument)
    )
  })
}
