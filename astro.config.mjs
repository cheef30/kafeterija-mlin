import { defineConfig } from 'astro/config';

// Sajt živi na https://cheef30.github.io/kafeterija-mlin/
// Ako se kasnije pređe na sopstveni domen: site = 'https://domen.rs', base = '/'.
export default defineConfig({
  site: 'https://cheef30.github.io',
  base: '/kafeterija-mlin',
  trailingSlash: 'ignore',
  build: { format: 'directory', inlineStylesheets: 'always' },
  compressHTML: true,
  devToolbar: { enabled: false },
});
