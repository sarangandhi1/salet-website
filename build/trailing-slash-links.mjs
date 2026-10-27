// Cloudflare Pages serves every page at "/path/" and answers "/path" with a
// 308 redirect. Internal links written as "/path" therefore make Google (and
// visitors) take a redirect hop on every click, and those hops show up in
// Search Console as "Page with redirect".
//
// After the build, this rewrites internal hrefs in the generated HTML to the
// final "/path/" form. It only touches a link when the page it points to was
// actually built (dist/<path>/index.html exists), so files (/sw.js,
// /og/x.png), other sites and unknown paths are left exactly as written.
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(p);
    else if (entry.name.endsWith('.html')) yield p;
  }
}

export default function trailingSlashLinks() {
  return {
    name: 'trailing-slash-links',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const built = new Map();
        const isPage = async (path) => {
          if (!built.has(path)) {
            built.set(path, await stat(join(root, path, 'index.html')).then(() => true, () => false));
          }
          return built.get(path);
        };

        // href="/a/b" or href="/a/b#x" or href="/a/b?q=1": path has no dot in
        // its last segment and does not already end in a slash.
        const re = /href="(\/(?!\/)[^"#?]*?[^/"#?])([?#][^"]*)?"/g;
        let files = 0;
        let links = 0;
        for await (const file of htmlFiles(root)) {
          const html = await readFile(file, 'utf8');
          const matches = [...html.matchAll(re)];
          if (matches.length === 0) continue;
          let out = '';
          let last = 0;
          let changed = 0;
          for (const m of matches) {
            const [whole, path, suffix = ''] = m;
            const lastSeg = path.slice(path.lastIndexOf('/') + 1);
            if (lastSeg.includes('.') || !(await isPage(path))) continue;
            out += html.slice(last, m.index) + `href="${path}/${suffix}"`;
            last = m.index + whole.length;
            changed++;
          }
          if (changed === 0) continue;
          await writeFile(file, out + html.slice(last));
          files++;
          links += changed;
        }
        logger.info(`added trailing slash to ${links} internal links in ${files} pages`);
      },
    },
  };
}
