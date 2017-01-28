import React from 'react'

export const FPSCounter = React.createClass({
  slowFrame: 1000 / 30,
  hideAfterFrames: 60 * 2.5,
  fps (time) {
    this.frameReq = window.requestAnimationFrame(this.fps)
    if (time && this.oldTime) {
      let slowFrame = this.state.slowFrame
      let timeSinceSlow = this.state.timeSinceSlow
      const msBetweenFrames = (time - this.oldTime)
      if (msBetweenFrames > this.slowFrame) {
        slowFrame = time
        timeSinceSlow = this.hideAfterFrames
      }
      if (timeSinceSlow) {
        timeSinceSlow--
      }
      if (timeSinceSlow < 0) {
        slowFrame = timeSinceSlow = false
      }
      if (!slowFrame && !this.state.slowFrame) {

      }
      // let frameTimes = this.state.frameTimes
      // if (frameTimes.length > 60) {  // 1 Second of 'perfect' frames.
      //   frameTimes = frameTimes.pop().unshift(msBetweenFrames)
      // } else {
      //   frameTimes = frameTimes.unshift(msBetweenFrames)
      // }

      this.setState({
        slowFrame, timeSinceSlow
        // , frameTimes
      })
    }
    if (time) {
      this.oldTime = time
    }
  },
  componentDidMount () {
    this.fps()
  },
  componentWillUnmount () {
    if (this.frameReq) {
      window.cancelAnimationFrame(this.frameReq)
    }
  },
  getInitialState () {
    return {
      frameTimes: [],
      slowFrame: false,
      timeSinceSlow: false
    }
  },
  render () {
    const frameTimes = this.state.frameTimes
    let shortFps, longFps
    if (frameTimes.length) {
      // const shortTimes = frameTimes.splice(5)
      // let shortMs, longMs
      // shortMs = shortTimes.reduce((a, b) => a + b, 0) / shortTimes.length
      // shortFps = shortMs ? Math.floor(1000 / shortMs) : 0
      // longMs = frameTimes.reduce((a, b) => a + b, 0) / (frameTimes.length)
      // longFps = longMs ? Math.floor(1000 / longMs) : 0
    } else {
      shortFps = longFps = 0
    }
    let style = {}
    if (this.state.timeSinceSlow) {
      const colorPercentage = 100 - (100.0 * this.state.timeSinceSlow / this.hideAfterFrames)
      style = {
        backgroundColor: `rgb(100%, ${colorPercentage}%, ${colorPercentage}%)`
      }
    }
    const fps = <span style={style}>{shortFps}/{longFps} FPS</span>
    return fps
  }
})
