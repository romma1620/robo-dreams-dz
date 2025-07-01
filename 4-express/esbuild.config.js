import { build } from 'esbuild';

build({
  entryPoints: ['src/server.js'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  outfile: 'dist/server.js',
  sourcemap: true,
  external: ['express', 'helmet', 'cors', 'compression', 'express-rate-limit'],
}).catch(() => process.exit(1));
