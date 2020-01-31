(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.pathParser = {}));
}(this, (function (exports) { 'use strict';

  /**
   * Get path char type
   *
   * @param {String} char the char is extracted from path string
   */
  function getPathCharType(char) {
    if (char === undefined) return "eof";
    var code = char.charCodeAt(0);

    switch (code) {
      case 0x5b: // [

      case 0x5d: // ]

      case 0x2e: // .

      case 0x22: // "

      case 0x27: // '

      case 0x30:
        // 0
        return char;

      case 0x5f: // _

      case 0x24:
        // $
        return "ident";

      case 0x20: // Space

      case 0x09: // Tab

      case 0x0a: // Newline

      case 0x0d: // Return

      case 0xa0: // No-break space

      case 0xfeff: // Byte Order Mark

      case 0x2028: // Line Separator

      case 0x2029:
        // Paragraph Separator
        return "ws";
    } // a-z, A-Z


    if (0x61 <= code && code <= 0x7a || 0x41 <= code && code <= 0x5a) return "ident"; // 1-9

    if (0x31 <= code && code <= 0x39) return "number";
    return "else";
  }

  var pathStateMachine = {
    'beforePath': {
      'ws': ['beforePath'],
      'ident': ['inIdent', 'append'],
      '[': ['beforeElement'],
      'eof': ['afterPath']
    },
    'inPath': {
      'ws': ['inPath'],
      '.': ['beforeIdent'],
      '[': ['beforeElement'],
      'eof': ['afterPath']
    },
    'beforeIdent': {
      'ws': ['beforeIdent'],
      'ident': ['inIdent', 'append']
    },
    'inIdent': {
      'ident': ['inIdent', 'append'],
      '0': ['inIdent', 'append'],
      'number': ['inIdent', 'append'],
      'ws': ['inPath', 'push'],
      '.': ['beforeIdent', 'push'],
      '[': ['beforeElement', 'push'],
      'eof': ['afterPath', 'push']
    },
    'beforeElement': {
      'ws': ['beforeElement'],
      '0': ['afterZero', 'append'],
      'number': ['inIndex', 'append'],
      "'": ['inSingleQuote', 'append', ''],
      '"': ['inDoubleQuote', 'append', '']
    },
    'afterZero': {
      'ws': ['afterElement', 'push'],
      ']': ['inPath', 'push']
    },
    'inIndex': {
      '0': ['inIndex', 'append'],
      'number': ['inIndex', 'append'],
      'ws': ['afterElement'],
      ']': ['inPath', 'push']
    },
    'inSingleQuote': {
      "'": ['afterElement'],
      'eof': ['error'],
      'else': ['inSingleQuote', 'append']
    },
    'inDoubleQuote': {
      '"': ['afterElement'],
      'eof': ['error'],
      'else': ['inDoubleQuote', 'append']
    },
    'afterElement': {
      'ws': ['afterElement'],
      ']': ['inPath', 'push']
    }
  };

  const identStart = '[\$_a-zA-Z]';
  const identPart = '[\$_a-zA-Z0-9]';
  const identRegExp = new RegExp('^' + identStart + '+' + identPart + '*' + '$');

  function isIdent(s) {
    return identRegExp.test(s);
  }

  function isIndex(s) {
    return +s === s >>> 0 && s !== '';
  }

  function formatAccessor(key) {
    if (isIndex(key)) {
      return '[' + key + ']';
    } else {
      return '["' + key.replace(/"/g, '\\"') + '"]';
    }
  }

  function toString(paths) {
    let pathString = '';

    for (let i = 0; i < paths.length; i++) {
      const key = paths[i];

      if (isIdent(key)) {
        pathString += i ? '.' + key : key;
      } else {
        pathString += formatAccessor(key);
      }
    }

    return pathString;
  }

  /**
   * Inspired by https://github.com/Polymer/observe-js.git
   */

  function noop() {}

  function parsePath(path) {
    if (Object.prototype.toString.call(path) === '[object Array]') return path;
    if (path === null || path === undefined) return []; // Ensure string

    path = String(path);
    if (path.trim().length === 0) return [];
    var keys = [];
    var index = -1;
    var c,
        newChar,
        key,
        type,
        transition,
        action,
        typeMap,
        mode = 'beforePath';
    var actions = {
      push: function () {
        if (key === undefined) return;
        keys.push(key);
        key = undefined;
      },
      append: function () {
        if (key === undefined) key = newChar;else key += newChar;
      }
    };

    function maybeUnescapeQuote() {
      if (index >= path.length - 1) return false;
      const nextChar = path[index + 1];

      if (mode == 'inSingleQuote' && nextChar == "'" || mode == 'inDoubleQuote' && nextChar == '"') {
        // Skip the next
        index++; // Make `next char` as `new char`

        newChar = nextChar; // Just append then forward next loop

        actions.append();
        return true;
      }

      return false;
    }

    while (mode) {
      index++;
      c = path[index]; // Sepcial case: `\'` or `\"`
      // NOTE: two chars with `\` and {`"`, `'`}

      if (c == '\\' && maybeUnescapeQuote()) {
        continue;
      }

      type = getPathCharType(c);
      typeMap = pathStateMachine[mode];
      transition = typeMap[type] || typeMap['else'] || 'error';

      if (transition == 'error') {
        return null; // parse error
      }

      mode = transition[0];
      action = actions[transition[1]] || noop;
      newChar = transition[2] === undefined ? c : transition[2];
      action();

      if (mode === 'afterPath') {
        return keys;
      }
    }

    return null; // parse error
  }

  exports.default = parsePath;
  exports.toString = toString;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
