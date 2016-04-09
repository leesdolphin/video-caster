/* eslint-env es6*/
import React from 'react'

// import { ChromecastSessionManager } from './chromecast.jsx'
// import { Header } from './header.jsx'

console.log(Promise)

const Main = React.createClass({
  getInitialState () {
    // this.chromecast_manager = new ChromecastSessionManager(this.chromecast_update)
    return {
      'chromecast_session': null
    }
  },
  render () {
    // let content
    // if (this.state.displayContributors) {
    //   content = <ContributorDisplay repo={this.state.repo} />
    // } else {
    //   content = <ChooseRepositoryForm
    //     repo={this.state.repo}
    //     onUserInput={this.updateState}
    //     ensureOAuth={this.ensureOAuth}
    //     loadRepo={this.loadRepo} />
    // }
    // return <StyleRoot>
    //   <Header
    //     repo={this.state.repo}
    //     hasOAuth={this.state.hasOAuth} />
    //   {content}
    //   {JSON.stringify(this.state.error)}
    // </StyleRoot>
    return (<img src='../icon.png' />)
  }
})

export { Main }
