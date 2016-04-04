function pause_videos () {
  var videos = document.getElementsByTagName('video')
  for (var i = 0; i < videos.length; i++) {
    var video = videos[i]
    if (video && video.pause) {
      try {
        video.pause()
      } catch (e) {}
    }
  }
}

window.addEventListener('load', pause_videos)
pause_videos()
