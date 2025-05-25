import { build } from 'esbuild'

build({
  entryPoints: ['src/server.ts'],
  outdir: './dist',
  bundle: true,
  minify: true,
  sourcemap: true,
  platform: 'node',
  target: ['node20'],
  logLevel: 'info',
  color: true,
  ignoreAnnotations: true,
  tsconfig: './tsconfig.json'
})
