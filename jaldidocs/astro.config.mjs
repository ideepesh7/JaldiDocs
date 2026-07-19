import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://jaldidocs.pages.dev',
  trailingSlash: 'always',
  vite: {
    cacheDir: '.vite-cache',
  },
  integrations: [
    react(),
    tailwind(),
  ],
  output: 'static',
});
