function requestDocument (method, url) {
  if (!url) {
    // One argument variant.
    url = method;
    method = 'GET';
  }
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'document';
    xhr.overrideMimeType('text/html');
    xhr.addEventListener('load', function () {
      if (xhr.readyState === xhr.DONE) {
        if (xhr.status >= 200 && xhr.status < 400) {
          // 2xx or 3xx status codes generally indicate some form of success.
          resolve(xhr);
        } else {
          reject(xhr);
        }
      }
    });
    xhr.open('GET', url, true);
    xhr.send(null);
  });
}

function resolveRedirects(url) {
  return requestDocument('HEAD', url).then(function(xhr) {
    return xhr.responseURL
  })
}

function onMediaError() {
  console.log('onMediaError', arguments);
}


var playback_url_promise = new Promise(function (purl_resolve, purl_reject) {
  document.addEventListener('DOMContentLoaded', function () {
    requestDocument('https://kissanime.to/Anime/Sailor-Moon-R/Episode-055').then(function(xhr) {
      var quality_selector = xhr.responseXML.getElementById('selectQuality');
      var qual_to_url = {};
      var default_qual = undefined;
      for (var i = 0; i < quality_selector.childNodes.length; i++) {
        let option = quality_selector.childNodes[i]
        if (option.tagName = 'OPTION') {
          qual_to_url[option.textContent] = atob(option.value)
          if (option.selected) {
            default_qual = option.textContent
          }
        }
      }
      var url = qual_to_url[default_qual]
      return resolveRedirects(url).then(purl_resolve)
    }).catch(purl_reject);
  });
})

var cast_api_promise = new Promise(function (cast_resolve, cast_reject) {

  function sessionListener() {
    console.log('sessionListener', arguments);
  }
  function receiverListener(e) {
    if( e === chrome.cast.ReceiverAvailability.AVAILABLE) {
      chrome.cast.requestSession(onRequestSessionSuccess, onLaunchError);
    }
  }
  function onRequestSessionSuccess(e) {
    window.session = e;
    if (window.playback_url) {
      bootstrap_playback(window.playback_url)
    }
  }
  function onInitSuccess() {
    console.log('onInitSuccess', arguments);
  }
  function onError() {
    console.log('onError', arguments);
  }
  function onLaunchError() {
    console.log('onLaunchError', arguments);
  }

  window['__onGCastApiAvailable'] = function(loaded, errorInfo) {
    if (loaded) {
      var sessionRequest = new chrome.cast.SessionRequest(
                       chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID);
      var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
                                                sessionListener,
                                                receiverListener);
      chrome.cast.initialize(apiConfig, onInitSuccess, onError);
    } else {
      console.log(errorInfo);
    }
  }
});

function bootstrap_playback(url) {
  var mediaInfo = new chrome.cast.media.MediaInfo(url);
  var request = new chrome.cast.media.LoadRequest(mediaInfo);
  session.loadMedia(request,
     onMediaDiscovered.bind(this, 'loadMedia'),
     onMediaError);

  function onMediaDiscovered(how, media) {
     currentMedia = media;
  }
}
