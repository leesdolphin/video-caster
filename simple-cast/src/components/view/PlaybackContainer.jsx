/* global chrome*/
import React from 'react'

import * as chromecast_events from '../../react-redux-chromecast-sender/constants'

import { PlaybackScrobber } from './PlaybackScrobber.jsx'
import { PlaybackButton } from './PlaybackButton.jsx'
import { PlaybackTime } from './PlaybackTime.jsx'

export const PlaybackContainer = React.createClass({
  render: function () {
    return <span>
      <PlaybackButton
        playbackState={chrome.cast.media.PlayerState.PLAYING}
        event={chromecast_events.MEDIA_PLAY}>
        {"Play"}
      </PlaybackButton>
      <PlaybackButton
        playbackState={chrome.cast.media.PlayerState.PAUSED}
        event={chromecast_events.MEDIA_PAUSE}>
        {"Pause"}
      </PlaybackButton>
      <PlaybackScrobber />
      {"Playback possition: "}
      <PlaybackTime />
    </span>
  }
})
