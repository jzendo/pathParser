import resolve from "@rollup/plugin-node-resolve"
import babel from "rollup-plugin-babel"
import { terser } from "rollup-plugin-terser"

import { version } from './package.json'

const moreOutput = {
  banner: `
/*!
 * -------------------------------
 *    Path Parser v${version}
 * -------------------------------
 */
`
}

export default {
  input: "src/index.js",
  output: [
    {
      file: 'dist/pathParser.module.js',
      format: 'es',
      ...moreOutput
    },
    {
      file: "dist/pathParser.js",
      name: "pathParser",
      format: "umd",
      exports: "named",
      ...moreOutput
    },
    {
      file: "dist/pathParser.min.js",
      name: "pathParser",
      format: "umd",
      exports: "named",
      plugins: [terser()],
      ...moreOutput
    }
  ],
  plugins: [
    resolve(),
    babel({
      exclude: "node_modules/**" // only transpile our source code
    })
  ]
}
