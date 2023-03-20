import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from "@rollup/plugin-terser";

export default {
  input: 'index.mjs',
  output: {
    banner: '#!/usr/bin/env node',
    file: 'dist/outfile.cjs',
    format: 'cjs',
  },
  plugins: [
    resolve({
      preferBuiltins: true,
    }),
    commonjs(),
    terser(),
  ],
  external: [
    'fs',
    'path',
    'http',
    'https',
    'url',
    'stream',
    'crypto',
    'zlib',
    'util',
    'events',
    'assert',
    'buffer',
    'querystring',
    'os',
    'child_process',
    'cluster',
    'dgram',
    'dns',
    'net',
    'readline',
    'repl',
    'timers',
    'tty',
    'vm',
    'worker_threads',
  ],
};