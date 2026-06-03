/**
 * Bundles the css package: copies reset + components into dist, and produces an
 * index.css that imports tokens + reset + components in the right order.
 */
import { mkdir, copyFile, writeFile, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const distDir = new URL('../dist/', import.meta.url);
const srcDir = new URL('../src/', import.meta.url);

await mkdir(distDir, { recursive: true });
await copyFile(new URL('reset.css', srcDir), new URL('reset.css', distDir));
await copyFile(new URL('components.css', srcDir), new URL('components.css', distDir));

// Resolve the tokens css path so index.css can @import it relative to node_modules.
const index = `/* @bion-mfe-ui/css — single entry. Pulls tokens, reset, components. */
@import '@bion-mfe-ui/tokens/css';
@import './reset.css';
@import './components.css';
`;
await writeFile(new URL('index.css', distDir), index);

console.log('css: wrote dist/{reset,components,index}.css');
