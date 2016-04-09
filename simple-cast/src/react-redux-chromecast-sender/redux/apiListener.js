/**
Source taken from react-redux-chromecast-sender NPM module
*/

export function apiListener (onSuccess, onError) {
  // Listen for chromecast available
  window.__onGCastApiAvailable = (loaded, errorInfo) => {
    if (loaded) {
      onSuccess()
    } else {
      onError(errorInfo)
    }
  }
}
