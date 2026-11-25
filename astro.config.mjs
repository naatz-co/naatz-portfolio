import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.naatz.co',
  trailingSlash: 'never',
  build: { format: 'file' },
  compressHTML: true,
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404') && !page.includes('/about-v2'),
      serialize: (item) => ({ ...item, url: item.url.replace(/\/$/, '') || 'https://www.naatz.co' }),
    }),
  ],
});
