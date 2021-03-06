/* eslint-env browser */
/* global chrome*/

function requestDocument (method, url) {
  if (!url) {
    // One argument variant.
    url = method
    method = 'GET'
  }
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest()
    xhr.responseType = 'document'
    xhr.overrideMimeType('text/html')
    xhr.addEventListener('load', function () {
      console.log(xhr.readyState)
      if (xhr.readyState === xhr.DONE) {
        if (xhr.status >= 200 && xhr.status < 400) {
          // 2xx or 3xx status codes generally indicate some form of success.
          resolve(xhr)
        } else {
          reject(xhr)
        }
      }
    })
    xhr.addEventListener('error', function () {
      console.log(xhr.readyState)
      reject(xhr)
    })
    xhr.open(method, url, true)
    xhr.send(null)
  })
}

function resolveRedirects (url) {
  return requestDocument('HEAD', url).then(function (xhr) {
    return xhr.responseURL
  })
}

function onMediaError () {
  console.log('onMediaError', arguments)
}

var playback_media_promise = new Promise(function (purl_resolve, purl_reject) {
  document.addEventListener('DOMContentLoaded', function () {
    if (!/(^\?|&)kiss_url=/.test(document.location.search)) {
      alert("No url. Carp")
      purl_reject("No url")
    }
    var kiss_url = /(^\?|&)kiss_url=([^&]*)(&|$)/.exec(document.location.search)[2]
    kiss_url = decodeURIComponent(kiss_url)
    alert(kiss_url)
    purl_resolve(requestDocument(kiss_url).then(function (xhr) {
      var kiss_document = xhr.responseXML
      var quality_selector = kiss_document.getElementById('selectQuality')
      var qual_to_url = {}
      var default_qual
      for (var i = 0; i < quality_selector.childNodes.length; i++) {
        let option = quality_selector.childNodes[i]
        if (option.tagName === 'OPTION') {
          qual_to_url[option.textContent] = atob(option.value)
          if (option.selected) {
            default_qual = option.textContent
          }
        }
      }
      var url = qual_to_url[default_qual]
      url = url.replace('http://', 'https://')
      return resolveRedirects(url).then(function (mediaUrl) {
        var mediaInfo = new chrome.cast.media.MediaInfo(mediaUrl)
        mediaInfo.contentType = 'video/mp4'
        var metadata = new chrome.cast.media.TvShowMediaMetadata()
        var titleRegex = /^\s*\w+\s+(.*)\s+information\s*$/ig
        var title = titleRegex.exec(kiss_document.querySelector('#navsubbar>p>a').text)[1]
        var episodeSelector = kiss_document.getElementById('selectEpisode')
        metadata.episode = episodeSelector.selectedIndex
        metadata.title = episodeSelector.selectedOptions[0].text.trim()
        metadata.seriesTitle = title
        metadata.images = []  // Images is kinda-hard to get(needs another request.)
        mediaInfo.metadata = metadata
        mediaInfo.customData = {
          'episodeUrl': kiss_url
        }
        return mediaInfo
      })
    }))
  })
})
var cast_api_promise = new Promise(function (cast_resolve, cast_reject) {
  function sessionListener () {
    console.log('sessionListener', arguments)
  }
  function receiverListener (e) {
    console.log('receiverListener', arguments)
    if (e === chrome.cast.ReceiverAvailability.AVAILABLE) {
      chrome.cast.requestSession(onRequestSessionSuccess, onLaunchError)
    }
  }
  function onRequestSessionSuccess (e) {
    console.log('onRequestSessionSuccess', arguments)
    cast_resolve(e)
  }
  function onInitSuccess () {
    console.log('onInitSuccess', arguments)
  }
  function onError () {
    console.log('onError', arguments)
  }
  function onLaunchError () {
    console.log('onLaunchError', arguments)
  }

  window['__onGCastApiAvailable'] = function (loaded, errorInfo) {
    if (loaded) {
      var sessionRequest = new chrome.cast.SessionRequest(
        chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID)
      var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
        sessionListener,
        receiverListener)
      chrome.cast.initialize(apiConfig, onInitSuccess, onError)
    } else {
      console.log(errorInfo)
    }
  }
})

Promise.all([playback_media_promise, cast_api_promise]).then(function (values) {
  var mediaInfo = values[0]
  var cast_session = values[1]

  var request = new chrome.cast.media.LoadRequest(mediaInfo)
  cast_session.loadMedia(request,
    onMediaDiscovered.bind(this, 'loadMedia'),
    onMediaError)

  function onMediaDiscovered (how, media) {
    console.log('onMediaDiscovered', arguments)
  }
})
