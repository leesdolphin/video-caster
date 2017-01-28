
define([/* 'chromecast!media', */'kiss/media'], (/*ccMedia, */resolveMediaUrl) => {
  function buildCastMedia(episode, series, quality) {
    const { resolvedMedia, media } = episode;
    return Promise.resolve(
      resolvedMedia.get(quality) || media.get(quality),
    ).then((url) => {
      if (!url) {
        throw new Error(`Cannot create ChromeCast media from an unknown URL. Quality ${quality}`);
      }
      return resolveMediaUrl(url);
    }).then((response) => {
      const contentType = response.headers.get('Content-Type') || 'video/mp4';
      const resolvedUrl = response.url;
      return { contentType, resolvedUrl };
    }).then(({ contentType, resolvedUrl }) => {
      const metadata = new chrome.cast.media.TvShowMediaMetadata();
      metadata.episode = episode.number;
      metadata.title = episode.title;
      metadata.seriesTitle = series.title;
      metadata.images = [series.coverImage];

      const castMedia = new chrome.cast.media.MediaInfo(resolvedUrl, contentType);
      castMedia.metadata = metadata;
      castMedia.customData = {
        episodeUrl: episode.episodeUrl,
      };
      return { resolvedUrl, castMedia };
    });
  }

  return buildCastMedia;
});
