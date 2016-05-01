
export function combineObjectPromises (...promises) {
  return Promise.all(promises).then((promise_results) => {
    return Object.assign({}, ...promise_results)
  })
}

export function swapImmutableList (list, idx_map) {
  const swapedIndexes = (
    idx_map
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
