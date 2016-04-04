/* eslint-env browser */
/* global chrome*/

var dom_loaded = new Promise(function (resolve) {
  document.addEventListener('DOMContentLoaded', resolve)
})

var active_tab = new Promise(function (resolve, reject) {
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    if (tabs.length) {
      resolve(tabs[0])
    } else {
      reject()
    }
  })
})

var injected_content = active_tab.then(function (tab) {
  if (/^http[s]?:\/\/(www\.)?kiss(cartoon\.me|anime\.to)/.test(tab.url)) {
    chrome.tabs.executeScript(tab.id, {file: 'inject/pause_videos.js'}, function () {})
    return tab.url
  } else {
    throw new Error('Nope')
  }
})
injected_content.then(function () {
  dom_loaded.then(function () {
    document.body.className = 'vids'
  })
}).catch(function () {
  dom_loaded.then(function () {
    document.body.className = 'no-vids'
  })
})

dom_loaded.then(function () {
  document.getElementById('click-to-play').addEventListener('click', function () {
    injected_content.then(function (url) {
      var param = encodeURIComponent(url)
      chrome.tabs.create({url: '../index.html?kiss_url=' + param})
    })
  })
})

injected_content
