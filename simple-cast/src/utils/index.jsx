/* global URL: false */

import { List } from 'immutable'

export function combineObjectPromises (...promises) {
  return Promise.all(promises).then((promiseResults) => {
    return Object.assign({}, ...promiseResults)
  })
}

export function swapImmutableList (list, idxMap) {
  const swapedIndexes = (
    idxMap
      .map((v) => parseInt(v) || 0)
      .mapKeys((v) => parseInt(v) || 0)
  )
  const fliped = swapedIndexes.flip()
  // OldIndex: NewIndex
  if (fliped.size !== swapedIndexes.size) {
    console.error('Indexes are not a 1-to-1 mapping', swapedIndexes, fliped)
    throw new Error('Indexes are not a 1-to-1 mapping')
  }
  return list.map((val, idx) => {
    console.log('Updating', idx, 'fwd swap', swapedIndexes.get(idx, 'Not Found'), 'rev swap', fliped.get(idx, 'Not Found'))
    if (swapedIndexes.has(idx)) {
      return list.get(swapedIndexes.get(idx))
    } else if (fliped.has(idx)) {
      return list.get(fliped.get(idx))
    } else {
      return val
    }
  })
}

export function parseUserUrl (url, base = 'about:blank') {
  try {
    return new URL(url, base).href
  } catch (e) {
    try {
      return new URL('http://' + url, base).href
    } catch (e) {
      throw new Error(`URL given cannot be converted into a recognised url: ${url}(base ${base})`)
    }
  }
}

const timeoutFunction = (fn) => window.setTimeout(fn, 500)

export function rateLimit (count, name = '<unknown>') {
  request.pendingQueue = List()
  request.inProgressQueue = List()
  const check = () => request.inProgressQueue.size < count
  function execNext () {
    if (request.pendingQueue.size === 0 || !check()) {
      return
    }
    console.log(`Resolving the first item in the '${name}' queue`)
    const resolver = request.pendingQueue.first()
    request.pendingQueue = request.pendingQueue.shift()
    resolver()
  }
  let idx = 0
  function request (cb) {
    // function wrapper (...args) {
    //   const thisNum = idx++
    //   let promise
    //   if (check()) {
    //     console.log(`Insta-resolving ${thisNum} avaliable in the '${name}' queue`)
    //     promise = Promise.resolve().then(() => cb(...args))
    //     request.inProgressQueue = request.inProgressQueue.push(promise)
    //   } else {
    //     console.log(`Queued Promise ${thisNum} in the '${name}' queue`)
    //     const queuedPromise = new Promise((resolve) => {
    //       request.pendingQueue = request.pendingQueue.push(resolve)
    //     })
    //     promise = queuedPromise.then(() => {
    //       request.inProgressQueue = request.inProgressQueue.push(promise)
    //       return cb(...args)
    //     })
    //     timeoutFunction(execNext)
    //   }
    //   function resolvedFn () {
    //     console.log(`${thisNum} Promise Completed for the '${name}' queue`)
    //     request.inProgressQueue = request.inProgressQueue.delete(
    //       request.inProgressQueue.indexOf(promise))
    //     timeoutFunction(execNext)
    //   }
    //   promise.then(resolvedFn, resolvedFn)
    //   return promise
    // }
    return cb
    // return wrapper
  }
  request.Promise = (fn) => request(fn)()
  return request
}
