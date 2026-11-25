// Publish a single /sitemap.xml (the site has < 50 URLs, so no index file is needed).
import { rename, rm } from 'node:fs/promises';
await rename('dist/sitemap-0.xml', 'dist/sitemap.xml');
await rm('dist/sitemap-index.xml', { force: true });
console.log('sitemap: dist/sitemap.xml');
