/* eslint-env browser */
/* global chrome*/

const NICE_VIEW = 'https://www.tumblr.com/video_file/141890925789/tumblr_o4sov7RUno1tg1ng2/720'

;(function () {
  var cast_session
  function disabled (elm, set_disabled) {
    if (set_disabled) {
      elm.setAttribute('disabled', 'disabled')
    } else {
      elm.removeAttribute('disabled')
    }
  }
  function cast_reject () {
    window.alert("Nope")
  }

  document.addEventListener('DOMContentLoaded', function () {
    function onMediaError () {
      console.log('onMediaError', arguments)
    }

    function sessionListener (session) {
      if (!cast_session) {
        cast_session = session
        play_url(NICE_VIEW)
      }
    }
    function receiverListener (e) {
      console.log('receiverListener', arguments)
      if (e === chrome.cast.ReceiverAvailability.AVAILABLE) {
        window.setTimeout(function () {
          if (!cast_session) {
            chrome.cast.requestSession(onRequestSessionSuccess, onLaunchError)
          }
        }, 20)
      } else {
        cast_reject(['receiver not AVAILABLE', e])
      }
    }
    function onRequestSessionSuccess (session) {
      console.log('onRequestSessionSuccess', arguments)
      if (!cast_session) {
        cast_session = session
        play_url(NICE_VIEW)
      }
    }
    function onInitSuccess () {
      console.log('onInitSuccess', arguments)
    }
    function onError () {
      console.log('onError', arguments)
      // cast_reject(['receiver not AVAILABLE', e])
    }
    function onLaunchError (cause) {
      cast_reject(['launch error', cause])
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

    function play_url (playback_url) {
      var mediaInfo = new chrome.cast.media.MediaInfo(playback_url)
      mediaInfo.contentType = 'video/mp4'
      var request = new chrome.cast.media.LoadRequest(mediaInfo)
      cast_session.loadMedia(request,
        onMediaDiscovered.bind(this, 'loadMedia'),
        onMediaError)

      function onMediaDiscovered (how, media) {
        console.log('onMediaDiscovered', arguments)
      }
    }


    const play_button = document.getElementById('play')
    const pause_button = document.getElementById('pause')
    play_button.addEventListener('click', play_button_listener)
    // pause_button.addEventListener(pause_button_listener)
    disabled(play_button, true)
    disabled(pause_button, true)



    function play_button_listener () {

    }
  })
})()
