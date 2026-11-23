import { defineConfig } from 'astro/config';
import site from './src/data/site.json' with { type: 'json' };
import { normalizeBase } from './src/lib/urls.mjs';

export default defineConfig({
  site: process.env.SITE_URL || site.url,
  base: normalizeBase(process.env.BASE_PATH ?? site.base),
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
