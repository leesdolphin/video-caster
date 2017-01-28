

define(['idb'], (idb) => {
  let initPromise;
  const migrations = [
    (upgradeDB) => {
      const epStore = upgradeDB.createObjectStore('episode', { keyPath: 'url' });
      epStore.createIndex('episodeSeries', 'seriesLink', { unique: false });

      upgradeDB.createObjectStore('series', { keyPath: 'url' });
    },
    (upgradeDB) => {
      const epStore = upgradeDB.transaction.objectStore('episode');
      epStore.createIndex('episodeSeriesIdx', ['seriesLink', 'number'], { unique: false });
    },
  ];

  function arrayToMapFn(keyName) {
    return arr => new Map(arr.map(item => [item[keyName], item]));
  }
  function closeTransaction(transaction) {
    return re => transaction.complete.then(() => re);
  }


  function init() {
    if (!initPromise) {
      initPromise = idb.open('kiss-storage', migrations.length, (upgradeDB) => {
        for (let i = upgradeDB.oldVersion; i < migrations.length; i += 1) {
          migrations[i](upgradeDB);
        }
      });
    }
    return initPromise;
  }

  function loadAllEpisodes() {
    return init().then((db) => {
      const transaction = db.transaction('episode', 'readonly');
      const epStore = transaction.objectStore('episode');
      return epStore.getAll().then(closeTransaction(transaction));
    }).then(arrayToMapFn('url'));
  }

  function loadAllEpisodesInSeries(seriesLink) {
    return init().then((db) => {
      const transaction = db.transaction('episode', 'readonly');
      const epStore = transaction.objectStore('episode').index('episodeSeries');
      return epStore.getAll(seriesLink).then(closeTransaction(transaction));
    }).then(arrayToMapFn('url'));
  }

  function loadAllSeries() {
    return init().then((db) => {
      const transaction = db.transaction('series', 'readonly');
      const srStore = transaction.objectStore('series');
      return srStore.getAll().then(closeTransaction(transaction));
    }).then(arrayToMapFn('url'));
  }

  function loadAllData() {
    return Promise.all([loadAllEpisodes(), loadAllSeries()])
    .then(([episodes, series]) => ({ episodes, series }));
  }

  function saveEpisode(episode) {
    return init().then((db) => {
      const transaction = db.transaction('episode', 'readwrite');
      const epStore = transaction.objectStore('episode');
      return epStore.put(episode)
        .then(closeTransaction(transaction))
        .then(() => episode);
    });
  }
  function saveAllEpisodes(_episodes) {
    let episodes;
    if (_episodes instanceof Map) {
      episodes = _episodes.values();
    } else if (_episodes instanceof Array || _episodes instanceof Set) {
      episodes = _episodes;
    } else {
      throw new Error('Cannot accept episodes that are not in a map, array or set');
    }
    return init().then((db) => {
      const transaction = db.transaction('episode', 'readwrite');
      const epStore = transaction.objectStore('episode');
      const storagePromises = [transaction.complete];
      for (const episode of episodes) {
        storagePromises.append(epStore.put(episode));
      }
      return Promise.all(storagePromises)
        .then(closeTransaction(transaction))
        .then(() => _episodes);
    });
  }
  function saveSeries(series) {
    return init().then((db) => {
      const transaction = db.transaction('series', 'readwrite');
      const srStore = transaction.objectStore('series');
      return srStore.put(series)
        .then(closeTransaction(transaction))
        .then(() => series);
    });
  }
  function saveAllSeries(_series) {
    let series;
    if (_series instanceof Map) {
      series = _series.values();
    } else if (_series instanceof Array || _series instanceof Set) {
      series = _series;
    } else {
      throw new Error('Cannot accept series that are not in a map, array or set');
    }
    return init().then((db) => {
      const transaction = db.transaction('series', 'readwrite');
      const srStore = transaction.objectStore('series');
      const storagePromises = [transaction.complete];
      for (const singleSeries of series) {
        storagePromises.append(srStore.put(singleSeries));
      }
      return Promise.all(storagePromises)
        .then(closeTransaction(transaction))
        .then(() => _series);
    });
  }

  return {
    init,
    loadAllEpisodes,
    loadAllEpisodesInSeries,
    loadAllSeries,
    loadAllData,
    saveEpisode,
    saveAllEpisodes,
    saveSeries,
    saveAllSeries,
  };
});
