
export const REQUEST_EPISODE = 'kiss.media.request_episode'
export const EPISODE_INFORMATION = 'kiss.media.episode_info'

export function requestPosts (episode_url) {
  return {
    type: REQUEST_EPISODE,
    episode_url
  }
}

export function episodeInformation (episode_url, media_url, metadata) {
  return {
    type: EPISODE_INFORMATION,
    episode_url,
    media_url,
    metadata
  }
}
