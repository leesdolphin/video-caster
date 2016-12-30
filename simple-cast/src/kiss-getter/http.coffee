
{FetchError, RequestBlockedError, AutomationBlockedError} = require('./exceptions')

class DocumentFetcher

  checkResponse: (url) ->
    (response) =>
      if response.status == 503
        console.log new RequestBlockedError response, url
        Promise.reject new RequestBlockedError response, url
      else if response.url.includes('/Special/AreYouHuman?')
        console.log new AutomationBlockedError response, url
        Promise.reject new AutomationBlockedError response, url
      else if !response.ok
        console.log new FetchError response, url
        Promise.reject new FetchError response, url
      response

  fetchPage: (url, opts={credentials: 'include'}) ->
    window.fetch url, opts
      .then @checkResponse url

  fetchHtmlPage: (url, opts={credentials: 'include'}) ->
    @fetchPage url, opts
      .then (response) =>
        response.text()
          .then (responseText) =>
            doc = (new window.DOMParser).parseFromString responseText, 'text/html'
            newBase = doc.createElement 'base'
            newBase.setAttribute 'href', response.url
            doc.getElementsByTagName('head')[0].appendChild newBase
            doc.url = response.url
            doc


module.exports = {
  DocumentFetcher
}
