
function checkResponse (response) {
  if (response.ok) {
    return response
  } else {
    const error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

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
    'prevEpisode': imageLink('btnPrevious'),
    'nextEpisode': imageLink('btnNext')
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

export function loadEpisode (episodeUrl) {
  return window.fetch(episodeUrl, {
    credentials: 'include'
  }).then(function (response) {
    return response.text().then(function (response_text) {
      checkResponse(response)
      const kiss_document = (new window.DOMParser()).parseFromString(response_text, 'text/html')

      return Promise.all([
        {url: response.url},
        loadSiblingEpisodes(kiss_document),
        loadEpisodeInfo(kiss_document),
        loadMedia(kiss_document)
      ])
    })
  }).then(function (episodeInformation) {
    return Object.assign({}, ...episodeInformation)
  })
}
