import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import trailingSlashLinks from './build/trailing-slash-links.mjs';

export default defineConfig({
  site: 'https://salet.uk',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      // /guide/read is the gated thank-you page: robots.txt disallows it, so
      // listing it in the sitemap would contradict that.
      // /track-record is held out of search until real case studies exist.
      filter: (page) => !page.includes('/guide/read') && !page.includes('/track-record'),
    }),
    trailingSlashLinks(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
