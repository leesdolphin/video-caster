
export function combineObjectPromises (...promises) {
  return Promise.all(promises).then((promise_results) => {
    return Object.assign({}, ...promise_results)
  })
}
