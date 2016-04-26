import { kiss_fetch_html } from '../utils/kiss_fetch.jsx'
import { combineObjectPromises } from '../utils/index.jsx'

function loadSiblingEpisodes (kiss_document) {
  function imageLink (id) {
    const arrowImg = kiss_document.getElementById(id)
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

function loadEpisodeInfo (kiss_document) {
  const episodeSelector = kiss_document.getElementById('selectEpisode')
  return {
    number: episodeSelector.selectedIndex,
    title: episodeSelector.selectedOptions[0].text.trim()
  }
}

function loadMedia (kiss_document) {
  let defaultQuality
  const quality_selector = kiss_document.getElementById('selectQuality')
  const qual_to_url = {}
  for (let i = 0; i < quality_selector.childNodes.length; i++) {
    const option = quality_selector.childNodes[i]
    if (option.tagName === 'OPTION') {
      qual_to_url[option.textContent] = window.atob(option.value)
      if (option.selected) {
        defaultQuality = option.textContent
      }
    }
  }
  return {
    defaultQuality,
    media: qual_to_url
  }
}

function loadSeriesLink (kiss_document) {
  const navbar = kiss_document.getElementById('navsubbar')
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

export function loadEpisode (episodeUrl) {
  return kiss_fetch_html(episodeUrl, {
    credentials: 'include'
  }).then(function (kiss_document) {
    // We combine all these objects together; but we try to resolve
    // any promises first; just incase we want to add loading of other
    // information here.
    return combineObjectPromises(
      {url: kiss_document.url},
      loadSiblingEpisodes(kiss_document),
      loadEpisodeInfo(kiss_document),
      loadMedia(kiss_document),
      loadSeriesLink(kiss_document)
    )
  })
}
