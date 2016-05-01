
export function buildOrderedEpisodeList (episodes, series) {
  function reducer (episode_url) {
    const episode = episodes[episode_url]
    if (episode) {
      episode_array[episode.number] = episodes[episode_url]
      if (episode.nextEpisode) {
        // Indicate there is another episode by filling in with a null.
        // This means we are not loading the episode; but we know it's there.
        episode_array[episode.number + 1] = episode_array[episode.number + 1]
      }
    }
  }
  const episode_array = []
  if (!series) {
    console.log('Series not given', episode_array)
    return episode_array
  } else if (series.series_url && series.episodes) {
    // Already got all the series' episodes in order; Just use that.
    // We also know how many episodes there are. So fill out that information too.
    episode_array.length = series.episodes.length
    series.episodes.forEach(reducer)
    console.log('Series given', series, episodes, episode_array)
  } else {
    const series_url = series.series_url || series
    for (const episode_url in episodes) {
      if (episodes[episode_url].seriesLink === series_url) {
        reducer(episode_url)
      }
    }
    console.log('Series URL given', series, episodes, episode_array)
  }
  for (let i = 0; i < episode_array.length; i++) {
    // Make the array dense(not sparse) by assigning 'null' to every empty slot.
    //  and leaving the old values where they are.
    episode_array[i] = episode_array[i]
  }
  return episode_array
}
