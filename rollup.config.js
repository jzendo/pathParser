import resolve from "@rollup/plugin-node-resolve"
import babel from "rollup-plugin-babel"
import { terser } from "rollup-plugin-terser"

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/pathParser.js",
      name: "pathParser",
      format: "umd"
    },
    {
      file: "dist/pathParser.min.js",
      name: "pathParser",
      format: "umd",
      plugins: [terser()]
    }
  ],
  plugins: [
    resolve(),
    babel({
      exclude: "node_modules/**" // only transpile our source code
    })
  ]
}
