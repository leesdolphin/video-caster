
const defSeries = [
  'http://kisscartoon.se/Cartoon/Rwby-Season-01',
  'http://kisscartoon.se/Cartoon/Rwby-Season-02',
  'http://kisscartoon.se/Cartoon/Rwby-Season-3',
  'http://kisscartoon.se/Cartoon/Rwby-Season-4',
];


define(['./kiss/episodes', './kiss/series', 'kiss/storage/indexedDb'], (loadEpisode, loadSeries, idb) => {
  idb.loadAllSeries().then(allSeries =>
    Promise.all(defSeries.map((seriesUrl) => {
      if (!allSeries.has(seriesUrl)) {
        return loadSeries(seriesUrl).then(idb.saveSeries);
      }
      return allSeries.get(seriesUrl);
    })),
  ).then(selectedSeries =>
    Promise.all(selectedSeries.map(singleSeries =>
      idb.loadAllEpisodesInSeries(singleSeries.url).then(allEpisodes =>
        Promise.all(singleSeries.episodes.map((epUrl) => {
          if (!allEpisodes.has(epUrl)) {
            return loadEpisode(epUrl).then(idb.saveEpisode);
          }
          return allEpisodes.get(epUrl);
        })).then(loadedEps => [singleSeries, loadedEps]),
      ),
    )),
  );
});
