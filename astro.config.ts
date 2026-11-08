import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig, fontProviders } from 'astro/config';

import { unified } from '@astrojs/markdown-remark';

import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import compress from 'astro-compress';
import type { AstroIntegration } from 'astro';

import astrowind from './vendor/integration';
import loadConfig from './vendor/integration/utils/loadConfig';

import { readingTimeRemarkPlugin, responsiveTablesRehypePlugin } from './src/utils/frontmatter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Blog taxonomy sections marked `robots.index: false` in `src/config.yaml` are
// kept out of the sitemap. Listing a URL that we then ask crawlers not to index
// spends crawl budget on nothing and sends two contradictory signals at once.
// The prefixes are derived from the config instead of hardcoded because these
// pathnames are meant to be renamed (see the comments in `src/config.yaml`).
interface BlogSectionConfig {
  isEnabled?: boolean;
  pathname?: string;
  robots?: { index?: boolean };
}

const themeConfig = (await loadConfig('src/config.yaml')) as {
  apps?: { blog?: Record<string, BlogSectionConfig> };
};

const noindexTaxonomyPaths = ['category', 'tag']
  .map((section) => themeConfig?.apps?.blog?.[section])
  .filter((section): section is BlogSectionConfig => Boolean(section?.isEnabled) && section?.robots?.index === false)
  .map((section) => `/${(section.pathname ?? '').replace(/^\/+|\/+$/g, '')}/`);

const hasExternalScripts = false;
const whenExternalScripts = (items: (() => AstroIntegration) | (() => AstroIntegration)[] = []) =>
  hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

export default defineConfig({
  output: 'static',

  build: {
    // The site ships a single shared stylesheet. Inlining it removes the
    // render-blocking CSS request on first load (measured ~300ms).
    inlineStylesheets: 'always',
  },

  // Prefetch on intent (hover/focus) only. Eagerly fetching every in-viewport
  // link after load competed with first paint and hydration; hover keeps
  // navigations feeling instant without the front-loaded network work.
  prefetch: {
    defaultStrategy: 'hover',
  },

  // Native Fonts API: self-hosts + subsets + preloads Inter and generates
  // metric-adjusted fallbacks. Injected via <Font /> in Layout.astro and
  // consumed through the `--font-inter` CSS variable in CustomStyles.astro.
  //
  // Only 400-800 are declared: the site uses regular (400), medium (500),
  // semibold (600), bold (700) and extrabold (800). Shipping the full
  // 100-900 axis costs ~73 kB; 400-800 is ~39 kB. The Google provider serves
  // the smaller upstream variable file, still self-hosted at build time.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: ['400 800'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
  ],

  integrations: [
    sitemap({
      filter: (page) => !noindexTaxonomyPaths.some((prefix) => new URL(page).pathname.startsWith(prefix)),
    }),
    mdx(),
    icon({
      include: {
        tabler: ['*'],
        'flat-color-icons': [
          'template',
          'gallery',
          'approval',
          'document',
          'advertising',
          'currency-exchange',
          'voice-presentation',
          'business-contact',
          'database',
        ],
      },
    }),

    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      })
    ),

    compress({
      // csso off on purpose: its parser doesn't understand the media range
      // syntax Tailwind v4 emits for breakpoints (`@media (width>=48rem)`) and
      // silently drops every one of those blocks — the site then renders as if
      // all `md:`/`lg:` classes were missing. lightningcss parses it correctly.
      CSS: { csso: false, lightningcss: { minify: true } },
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),

    astrowind({
      config: './src/config.yaml',
    }),
  ],

  image: {
    // Astro's default Sharp service handles local images.
    //
    // Most remote CDN images (Unsplash, Cloudinary, Imgix…) are routed by
    // src/components/common/Image.astro through `unpic`, which rewrites the
    // URL with CDN-side query parameters and serves it straight from the
    // provider — Astro never downloads it, so they don't need to be listed.
    //
    // `domains` only matters for remote URLs that fall through to Astro's
    // native <Image /> (i.e. providers Unpic can't detect, like Pixabay).
    // Listed entries are authorized to be processed by Sharp.
    domains: ['cdn.pixabay.com', 'ghchart.rshah.org'],

    // Emit responsive styles for the native <Image layout=…> used by
    // src/components/common/Image.astro (local images). Utility classes on
    // each usage still win, since these styles use low-specificity selectors.
    responsiveStyles: true,
  },

  markdown: {
    processor: unified({
      remarkPlugins: [readingTimeRemarkPlugin],
      rehypePlugins: [responsiveTablesRehypePlugin],
    }),
    // `github-dark` (Astro's default) colours comments #6a737d, which is only
    // ~3:1 on its #24292e code background. `github-dark-default` keeps the same
    // look with a lighter #8b949e comment colour that passes WCAG AA.
    shikiConfig: {
      theme: 'github-dark-default',
    },
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});
