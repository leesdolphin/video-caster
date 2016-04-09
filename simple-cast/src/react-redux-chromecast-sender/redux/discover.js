/**
Source taken from react-redux-chromecast-sender NPM module
*/

export function discover (appId, sessionListener, receiverListener, config, onDiscover, onError) {
  const chrome = window.chrome

  let attempts = 0
  let timeout

  const run = () => {
    if (onDiscover) {
      onDiscover(++attempts)
    }

    // try to find chromecasts
    if (!chrome.cast || !chrome.cast.isAvailable) {
      // try again
      timeout = setTimeout(run, config.retryInterval)
    } else {
      const sessionRequest = new chrome.cast.SessionRequest(appId)

      const apiConfig = new chrome.cast.ApiConfig(
        sessionRequest,
        sessionListener,
        receiverListener,
        config.autoJoinPolicy
      )

      chrome.cast.initialize(apiConfig, () => {
        // successful
        // no need to do anything as the receiverListener will take it from here
      }, err => {
        console.error(err)
        if (onError) {
          onError(err)
        }
      })
    }
  }

  // start discovery
  run()

  // call this to cancel lookup
  return () => {
    clearTimeout(timeout)
  }
}
