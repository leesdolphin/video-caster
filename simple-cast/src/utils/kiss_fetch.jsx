
// const fetchLimiter = rateLimit(1, 'fetch(kiss)')
import { DocumentFetcher } from '../kiss-getter/http'

const fetcher = new DocumentFetcher()

export function kissFetchHtml (...args) {
  return fetcher.fetchHtmlPage(...args)
}

export function kissFetch (...args) {
  return fetcher.fetchPage(...args)
}
