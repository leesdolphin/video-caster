define(['kiss/KissDecryptor', 'kiss/utils', 'kiss/http'], (KissDecryptor, kUtils, kHttp) => {
  /**
   * Get the previous and next episode URLs(if they exist) from the navigation arrows.
   */
  function docLoadSiblingEpisodes(kissDocument) {
    function imageLink(id) {
      const arrowImg = kissDocument.getElementById(id);
      if (arrowImg) {
        const parent = arrowImg.parentNode;
        if (parent && parent.tagName === 'A' && parent.href) {
          return parent.href;
        }
      }
      return null;
    }
    return {
      prevEpisode: imageLink('btnPrevious'),
      nextEpisode: imageLink('btnNext'),
    };
  }

  /**
   * Get the episode index and the episode title from the episode select box.
   */
  function docLoadEpisodeInfo(kissDocument) {
    const episodeSelector = kissDocument.getElementById('selectEpisode');
    return {
      number: episodeSelector.selectedIndex,
      title: episodeSelector.selectedOptions[0].text.trim(),
    };
  }

  /**
   * Get the media URLs and the qualities from the select box on the page.
   */
  function docLoadMedia(kissDocument) {
    let defaultQuality;
    const qualitySelector = kissDocument.getElementById('selectQuality');
    const qualities = [];
    const urlPromises = [];
    // Loop over every `option` tag in the selector extracting the quality and it's url.
    for (let i = 0; i < qualitySelector.childNodes.length; i += 1) {
      const option = qualitySelector.childNodes[i];
      if (option.tagName === 'OPTION') {
        qualities.push(option.textContent);
        // Kiss* store the URLs in the `value` attribute as a Base64 encoded string.
        const raw = kUtils.base64Decode(option.value);
        if (raw.startsWith('http://') || raw.startsWith('https://')) {
          // No encryption; we can push directly.
          urlPromises.push(raw);
        } else {
          // URL is encrypted. Ask the decryptor to decrypt it and return the parsed URL.
          urlPromises.push(KissDecryptor.getInstance().decrypt(option.value).then(
            url => kUtils.parseUserUrl(url, kissDocument.baseURI),
          ));
        }
        if (option.selected) {
          defaultQuality = option.textContent;
        }
      }
    }
    return Promise.all(urlPromises).then((urls) => {
      const qualToUrlMap = new Map(qualities.map((qual, idx) => [qual, urls[idx]]));
      return {
        defaultQuality,
        media: qualToUrlMap,
        castMedia: new Map(),
        resolvedMedia: new Map(),
      };
    });
  }

  /**
   * Get the link to the series page from the navigation bar.
   */
  function docLoadSeriesLink(kissDocument) {
    const navbar = kissDocument.getElementById('navsubbar');
    if (navbar) {
      const links = navbar.getElementsByTagName('a');
      if (links) {
        return {
          seriesLink: links[0].href,
        };
      }
    }
    return {};
  }

  /**
   * Return a promise that will resolve to the episode information.
   */
  function loadEpisode(episodeUrl) {
    return kHttp.fetchHtmlPage(episodeUrl, {
      credentials: 'include',
    }).then(kissDocument =>
      // We combine all these objects together; but we try to resolve
      // any promises first; just incase we want to add loading of other
      // information here.
      kUtils.combineObjectPromises(
        { url: kissDocument.url },
        docLoadSiblingEpisodes(kissDocument),
        docLoadEpisodeInfo(kissDocument),
        docLoadMedia(kissDocument),
        docLoadSeriesLink(kissDocument),
      ));
  }

  return loadEpisode;
});
