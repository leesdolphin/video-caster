define(['kiss/http'], (kHttp) => {
  /**
   * Take a media URL and return promise that will resolve to the media URL
   * after following the redirects.
   */
  function resolveMediaUrl(mediaUrl) {
    const url = new window.URL(mediaUrl);
    // This allows us to make the request because we have specified we are allowed
    // to access any https:// website, but not necessarily and http://
    url.protocol = 'https:';
    return kHttp.fetchPage(url, {
      method: 'HEAD',
      redirect: 'follow',
      referrer: 'no-referrer',
      cors: 'no-cors',
    });
  }

  return resolveMediaUrl;
});
