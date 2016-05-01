import { Map } from 'immutable'

export function createKeyedSelector (key_fn, create_selector_fn) {
  let selectors = Map()
  return (...args) => {
    const key = key_fn(...args)
    if (!selectors.has(key)) {
      selectors = selectors.set(key, create_selector_fn(key))
    }
    return selectors.get(key)(...args)
  }
}
