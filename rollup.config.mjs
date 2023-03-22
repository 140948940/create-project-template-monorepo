import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import babel from '@rollup/plugin-babel';
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';
export default {
  input: "index.mjs",
  output: {
    banner: "#!/usr/bin/env node",
    file: "outfile.cjs",
    format: "cjs",
  },
  plugins: [
    resolve({
      preferBuiltins: true,
    }),
    commonjs(),
    babel({
      babelHelpers: "runtime",
      presets: [
        // ["@babel/env", {"modules": false},"env"],
        [
          "@babel/preset-env",
          {
            modules:false,
            targets: {
              node: "14",
            },
            useBuiltIns: 'usage',
            corejs:{ version: "3", proposals: true }
          },
          
        ],
      ],
      plugins:["@babel/plugin-transform-runtime"]
    }),
    terser(),
  ],
  external: [
    "fs",
    "path",
    "http",
    "https",
    "url",
    "stream",
    "crypto",
    "zlib",
    "util",
    "events",
    "assert",
    "buffer",
    "querystring",
    "os",
    "child_process",
    "cluster",
    "dgram",
    "dns",
    "net",
    "readline",
    "repl",
    "timers",
    "tty",
    "vm",
    "worker_threads",
  ],
};
