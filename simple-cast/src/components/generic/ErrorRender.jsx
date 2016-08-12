import React, { PropTypes } from 'react'

import { RequestBlockedError } from '../../utils/kiss_fetch'

const URL = window.URL

// From https://github.com/chenglou/react-spinner/commit/50e7d9e
export const ErrorRender = React.createClass({
  propTypes: {
    error: PropTypes.object
  },
  render () {
    const e = this.props.error
    if (!e) {
      return null
    } else if (e instanceof RequestBlockedError) {
      const baseUrl = new URL(this.props.error.response.url)
      const homeUrl = new URL('/', baseUrl)

      return <div className='errorCard card card-block text-xs-center card-danger-outline'>
        <h3 className='card-title'>We are being blocked!</h3>
        <p className='card-text'>To bypass the block click the button below and wait until the page loads; then close it.</p>
        <a href={homeUrl} target='_blank' className='btn btn-primary'>Bypass Block</a>
      </div>
    } else {
      return <div>'Oh!'</div>
    }
  }
})
