
export function buildOrderedEpisodeList (episodes, series) {
  function reducer (episodeUrl) {
    const episode = episodes[episodeUrl]
    if (episode) {
      episodeArray[episode.number] = episodes[episodeUrl]
      if (episode.nextEpisode) {
        // Indicate there is another episode by filling in with a null.
        // This means we are not loading the episode; but we know it's there.
        episodeArray[episode.number + 1] = episodeArray[episode.number + 1]
      }
    }
  }
  const episodeArray = []
  if (!series) {
    return episodeArray
  } else if (series.seriesUrl && series.episodes) {
    // Already got all the series' episodes in order; Just use that.
    // We also know how many episodes there are. So fill out that information too.
    episodeArray.length = series.episodes.length
    series.episodes.forEach(reducer)
  } else {
    const seriesUrl = series.seriesUrl || series
    for (const episodeUrl in episodes) {
      if (episodes[episodeUrl].seriesLink === seriesUrl) {
        reducer(episodeUrl)
      }
    }
  }
  for (let i = 0; i < episodeArray.length; i++) {
    // Make the array dense(not sparse) by assigning 'null' to every empty slot.
    //  and leaving the old values where they are.
    episodeArray[i] = episodeArray[i]
  }
  return episodeArray
}
