define(['kiss/utils', 'kiss/http'], (kUtils, kHttp) => {
  function loadSeriesInformation(kissDocument) {
    const seriesContainer = kissDocument.querySelector('.bigBarContainer');
    if (!seriesContainer) {
      return Promise.reject('Unknown format.');
    }
    const seriesLink = seriesContainer.querySelector('a.bigChar');
    return {
      title: seriesLink.textContent.trim(),
    };
  }

  function loadEpisodeList(kissDocument) {
    const episodeTable = kissDocument.querySelector('.episodeList table>tbody');
    if (!episodeTable) {
      return {};  // No episodes; but still a valid series(I hope).
    }
    const episodes = [];
    const episodeNames = {};  // Separate to keep order, but also give this info.
    const episodeLinks = episodeTable.getElementsByTagName('a');
    for (let i = 0; i < episodeLinks.length; i += 1) {
      const link = episodeLinks[i];
      // episodes.push(link.href)  // Oldest to Newest ordering
      episodes.unshift(link.href);  // Newest to Oldest ordering.
      episodeNames[link.href] = link.textContent.trim();
    }
    return {
      episodes, episodeNames,
    };
  }

  function loadCoverImage(kissDocument) {
    const rightBoxes = kissDocument.getElementsByClassName('rightBox');
    for (const rightBox of rightBoxes) {
      const titleBars = rightBox.getElementsByClassName('barTitle');
      if (titleBars && titleBars[0].textContent.trim() === 'Cover') {
        // Found the correct block
        const images = rightBox.getElementsByTagName('img');
        if (images) {
          return {
            coverImage: images[0].src,
          };
        }
      }
    }
    return {};
  }

  function loadSeries(seriesUrl) {
    return kHttp.fetchHtmlPage(seriesUrl, {
      credentials: 'include',
    }).then(kissDocument => kUtils.combineObjectPromises(
        { url: kissDocument.url },
        loadSeriesInformation(kissDocument),
        loadEpisodeList(kissDocument),
        loadCoverImage(kissDocument),
      ));
  }

  return loadSeries;
});
