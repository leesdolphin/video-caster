
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

export function checkResponse (response) {
  if (response.ok) {
    return response
  } else {
    const error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

export function kiss_fetch_html (...args) {
  return kiss_fetch(...args).then(checkResponse).then((response) => {
    return response.text().then((response_text) => {
      const doc = (new window.DOMParser()).parseFromString(response_text, 'text/html')
      // doc.location = response.url
      const newBase = doc.createElement('base')
      newBase.setAttribute('href', response.url)
      doc.getElementsByTagName('head')[0].appendChild(newBase)
      doc.url = response.url
      return doc
    })
  })
}

export function kiss_fetch (...args) {
  return window.fetch(...args).then(function (response) {
    if (response.status === 503) {
      // Kiss* is blocking our request. Most likely due to missing session cookies.
      // Cannot do any sort of magic(I've tried), best bet is to return to the UI
      // and make the user:
      //  Open the tab; wait for the timeout; close the tab; re-request the action
      return Promise.reject(new RequestBlockedError('Blocked.', response))
    } else {
      return response
    }
  })
}
