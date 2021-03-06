import getPathCharType from './getPathCharType'
import pathStateMachine from './pathStateMachine'

function noop() {}

function parsePath(path) {
  var keys = []
  var index = -1
  var c,
    newChar,
    key,
    type,
    transition,
    action,
    typeMap,
    mode = 'beforePath'

  var actions = {
    push: function() {
      if (key === undefined) return

      keys.push(key)
      key = undefined
    },

    append: function() {
      if (key === undefined) key = newChar
      else key += newChar
    }
  }

  function maybeUnescapeQuote() {
    if (index >= path.length - 1) return false

    const nextChar = path[index + 1];

    if ((mode == 'inSingleQuote' && nextChar == "'") ||
        (mode == 'inDoubleQuote' && nextChar == '"')) {
      // Skip the next
      index++
      // Make `next char` as `new char`
      newChar = nextChar
      // Just append then forward next loop
      actions.append()
      return true
    }

    return false
  }

  while (mode) {
    index++

    c = path[index]

    // Sepcial case: `\'` or `\"`
    // NOTE: two chars with `\` and {`"`, `'`}
    if (c == '\\' && maybeUnescapeQuote(mode)) {
      continue
    }

    type = getPathCharType(c)
    typeMap = pathStateMachine[mode]
    transition = typeMap[type] || typeMap['else'] || 'error'

    if (transition == 'error') {
      return null // parse error
    }

    mode = transition[0]
    action = actions[transition[1]] || noop
    newChar = transition[2] === undefined ? c : transition[2]
    action()

    if (mode === 'afterPath') {
      return keys
    }
  }

  return null // parse error
}

export default parsePath
