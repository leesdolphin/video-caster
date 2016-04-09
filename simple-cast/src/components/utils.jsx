import React from 'react'

// Taken from the ReactJS docs
// http://facebook.github.io/react/docs/reusable-components.html#mixins
const SetIntervalMixin = {
  componentWillMount: function () {
    this.intervals = []
  },
  setInterval: function () {
    this.intervals.push(setInterval.apply(null, arguments))
  },
  componentWillUnmount: function () { 
    this.intervals.forEach(clearInterval)
  }
}

export { SetIntervalMixin }
