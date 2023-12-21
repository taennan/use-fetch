import typescript from 'rollup-plugin-typescript2'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/es/index.js',
      format: 'es',
      exports: 'named',
      sourcemap: true
    },
    {
      file: 'dist/cjs/index.cjs',
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    }
  ],
  plugins: [
    typescript()
  ],
  external: ['react', 'react-dom']
}
