define(['crypto-js'], (CryptoJS) => {
  function parseUserUrl(url, base = 'about:blank') {
    try {
      return new URL(url, base).href;
    } catch (e) {
      try {
        return new URL(`http://${url}`, base).href;
      } catch (e2) {
        throw new Error(`URL given cannot be converted into a recognised url: ${url}(base ${base})`);
      }
    }
  }

  function combineObjectPromises(...promises) {
    return Promise.all(promises).then(
      promiseResults => Object.assign({}, ...promiseResults));
  }

  function base64Decode(base64String) {
    return CryptoJS.enc.Base64.parse(base64String).toString();
  }

  return {
    base64Decode,
    combineObjectPromises,
    parseUserUrl,
  };
});
