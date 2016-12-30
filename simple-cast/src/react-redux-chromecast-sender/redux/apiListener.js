/**
Source taken from react-redux-chromecast-sender NPM module
*/

export function apiListener (onSuccess, onError) {
  // Listen for chromecast available
  function timer () {
    if (window.chrome.cast) {
      onSuccess && onSuccess()
      return
    }
    timeout = setTimeout(timer, 250)
  }
  let timeout = setTimeout(timer, 50)
  window.__onGCastApiAvailable = (loaded, errorInfo) => {
    clearTimeout(timeout)
    if (loaded) {
      onSuccess()
      onSuccess = false
    } else {
      onError(errorInfo)
    }
  }
}
