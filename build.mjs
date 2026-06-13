import { build } from 'esbuild';

await build({
    entryPoints: ['index.jsx'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile: 'dist/okisys',
    banner: { js: '#!/usr/bin/env node' },
    packages: 'external',
});
