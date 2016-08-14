
import { rateLimit } from './index'

class ExtendableError extends Error {
  constructor (message) {
    super(message)
    this.name = this.constructor.name
    this.message = message
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = (new Error(message)).stack
    }
  }
}

export class RequestBlockedError extends ExtendableError {
  constructor (message, response = null) {
    super(message)
    this.response = response
  }
}

export class AutomationBlockedError extends ExtendableError {
  constructor (message, response = null) {
    super(message)
    this.response = response
  }
}

const fetchLimiter = rateLimit(1, 'fetch(kiss)')

export function checkResponse (response) {
  if (response.ok) {
    return response
  } else {
    const error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

export function kissParseHtml (response) {
  return response.text().then((responseText) => {
    const doc = (new window.DOMParser()).parseFromString(responseText, 'text/html')
    // doc.location = response.url
    const newBase = doc.createElement('base')
    newBase.setAttribute('href', response.url)
    doc.getElementsByTagName('head')[0].appendChild(newBase)
    doc.url = response.url
    return doc
  })
}

export function kissFetchHtml (...args) {
  return kissFetch(...args).then(checkResponse).then(kissParseHtml)
}

export function kissFetch (...args) {
  return fetchLimiter.Promise(
    () => window.fetch(...args).then(function (response) {
      if (response.status === 503) {
        // Kiss* is blocking our request. Most likely due to missing session cookies.
        // Cannot do any sort of magic(I've tried), best bet is to return to the UI
        // and make the user:
        //  Open the tab; wait for the timeout; close the tab; re-request the action
        return Promise.reject(new RequestBlockedError('Blocked.', response))
      } else if (response.url.includes('/Special/AreYouHuman?')) {
        return Promise.reject(
          new AutomationBlockedError('You are human; I am not ... sigh', response))
      } else {
        return response
      }
    })
  )
}
