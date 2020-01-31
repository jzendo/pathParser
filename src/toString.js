const identStart = '[\$_a-zA-Z]'
const identPart = '[\$_a-zA-Z0-9]'
const identRegExp = new RegExp('^' + identStart + '+' + identPart + '*' + '$')

function isIdent(s) {
  return identRegExp.test(s)
}

function isIndex(s) {
  return +s === s >>> 0 && s !== ''
}

function formatAccessor(key) {
  if (isIndex(key)) {
    return '[' + key + ']'
  } else {
    return '["' + key.replace(/"/g, '\\"') + '"]'
  }
}

export default function toString(paths) {
  let pathString = ''
  for (let i = 0; i < paths.length; i++) {
    const key = paths[i]
    if (isIdent(key)) {
      pathString += i ? '.' + key : key
    } else {
      pathString += formatAccessor(key)
    }
  }

  return pathString
}
