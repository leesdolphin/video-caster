import { getEpisodeMedia } from '../media/index'

export const ADD_EPISODE = 'kiss.play_queue.add_episode'
export const REMOVE_EPISODE = 'kiss.play_queue.remove_episode'
export const REORDER_EPISODES = 'kiss.play_queue.reorder_episodes'

export function addEpisode (episodeUrl, quality = null) {
  return (dispatch, getState) => {
    dispatch({
      episodeUrl,
      type: ADD_EPISODE
    })
    const episodeData = getState().episodes[episodeUrl]
    if (quality == null) {
      quality = episodeData.defaultQuality
    }
    if (!episodeData.castMedia.has(quality)) {
      return dispatch(getEpisodeMedia(episodeUrl, quality))
    } else {
      return Promise.resolve()
    }
  }
}

export function removeEpisode (index) {
  return {
    index,
    type: REMOVE_EPISODE
  }
}
