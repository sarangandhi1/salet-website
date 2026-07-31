import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://salet.uk',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      // /guide/read is the gated thank-you page: robots.txt disallows it, so
      // listing it in the sitemap would contradict that.
      filter: (page) => !page.includes('/guide/read'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
