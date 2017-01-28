/* global chrome */

export class ChromecastSessionManager {
  constructor () {
    this.applicationID = null
    this.applicationScope = null
    this.session = null
    this.receiversAvailable = null
  }

  initializeCastPlayer (timeout = 1000) {
    if (!chrome.cast || !chrome.cast.isAvailable) {
      setTimeout(() => this.initializeCastPlayer(timeout * 1.5))
      return
    }
    if (this.applicationID === null) {
      this.applicationID = chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
    }
    if (this.applicationScope === null) {
      this.applicationScope = chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
    } else if (chrome.cast.AutoJoinPolicy[this.applicationScope]) {
      this.applicationScope = chrome.cast.AutoJoinPolicy[this.applicationScope]
    }
    const sessionRequest = new chrome.cast.SessionRequest(this.applicationID)
    const apiConfig = new chrome.cast.ApiConfig(sessionRequest,
      this._sessionListener.bind(this),
      this._receiverListener.bind(this),
      this.applicationScope)

    chrome.cast.initialize(apiConfig, () => {}, this._onError.bind(this))
  }
  _sessionListener (session) {
    this.session = session
    if (session) {

    }
    console.log('_sessionListener', arguments)
  }
  _receiverListener (e) {
    if (e === 'available') {
      this.receiversAvailable = true
    } else {
      this.receiversAvailable = false
    }
  }
  _onError () {
    console.log('_onError', arguments)
  }
}
