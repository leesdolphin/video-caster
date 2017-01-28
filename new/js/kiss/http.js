define(['./exceptions'], (exceptions) => {
  const { FetchError, RequestBlockedError, AutomationBlockedError } = exceptions;

  function checkResponse(url) {
    return (response) => {
      if (response.status === 503) {
        // console.log(new RequestBlockedError(response, url))
        return Promise.reject(new RequestBlockedError(response, url));
      } else if (response.url.includes('/Special/AreYouHuman?')) {
        // console.log(new AutomationBlockedError(response, url))
        return Promise.reject(new AutomationBlockedError(response, url));
      } else if (!response.ok) {
        // console.log(new FetchError(response, url))
        return Promise.reject(new FetchError(response, url));
      }
      return response;
    };
  }

  function fetchPage(url, opts = { credentials: 'include' }) {
    return window.fetch(url, opts).then(checkResponse(url));
  }

  function fetchHtmlPage(url, opts = { credentials: 'include' }) {
    return fetchPage(url, opts).then(response =>
      response.text().then((responseText) => {
        const doc = (new window.DOMParser()).parseFromString(responseText, 'text/html');
        const newBase = doc.createElement('base');
        newBase.setAttribute('href', response.url);
        doc.getElementsByTagName('head')[0].appendChild(newBase);
        doc.url = response.url;
        return doc;
      }),
    );
  }

  return {
    checkResponse,
    fetchPage,
    fetchHtmlPage,
  };
});
