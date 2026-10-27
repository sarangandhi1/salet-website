import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import trailingSlashLinks from '../build/trailing-slash-links.mjs';

// Salet Pro: tools for property professionals (sourcers, estate agents),
// kept apart from salet.uk, which acts only for buyers. It lives in this repo
// so it shares the Salet components, styles and product catalogue in ../src,
// and it deploys to its own Cloudflare Pages project, "salet-pro".
//   npx astro build --root pro && npx wrangler pages deploy pro/dist --project-name salet-pro
export default defineConfig({
  site: 'https://pro.salet.uk',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [sitemap(), trailingSlashLinks()],
  vite: {
    plugins: [tailwindcss()],
  },
});
