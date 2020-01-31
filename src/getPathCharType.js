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
    case 0x30: // 0
      return char;

    case 0x5f: // _
    case 0x24: // $
      return "ident";

    case 0x20: // Space
    case 0x09: // Tab
    case 0x0a: // Newline
    case 0x0d: // Return
    case 0xa0: // No-break space
    case 0xfeff: // Byte Order Mark
    case 0x2028: // Line Separator
    case 0x2029: // Paragraph Separator
      return "ws";
  }

  // a-z, A-Z
  if ((0x61 <= code && code <= 0x7a) || (0x41 <= code && code <= 0x5a))
    return "ident";

  // 1-9
  if (0x31 <= code && code <= 0x39) return "number";

  return "else";
}

export default getPathCharType;
