import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser'

// const isDev = process.env.NODE_ENV !== 'production'

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/axios-refresh-token.cjs.js',
      format: 'cjs',
      name: 'cjs'
    },
    {
      file: 'dist/axios-refresh-token.es.js',
      format: 'es',
      name: 'es'
    },
    {
      file: 'dist/axios-refresh-token.umd.js',
      format: 'umd',
      name: 'umd'
    }
  ],
  plugins: [
    json(),
    nodeResolve(),
    commonjs(),
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
      plugins: [
        '@babel/plugin-transform-runtime'
      ]
    }),
    terser()
  ]
}
