/**
 * Inspired by https://github.com/Polymer/observe-js.git
 */

import parsePath from './parsePath'
import toString from './toString'

// Cache the parsed result
const cache = new Map()

function parsePathWithCache(path) {
  if (Object.prototype.toString.call(path) === '[object Array]') return path
  if (path === null || path === undefined) return []

  // Ensure string
  path = String(path)
  if (path.trim().length === 0) return []

  if (!cache.has(path)) {
    const paths = parsePath(path)
    cache.set(path, paths)
  }

  return cache.get(path)
}

export default parsePathWithCache

export {
  toString
}
