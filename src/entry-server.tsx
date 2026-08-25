import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { site } from '@/content/site'
import { pages } from '@/lib/pages'
import { renderHead } from '@/lib/seo'
import { head as notFoundHead } from '@/pages/NotFoundPage'
import { App } from './App'

/**
 * Точка входа для статической сборки. `scripts/prerender.mjs` вызывает render()
 * для каждого адреса из `routes` и раскладывает результат по файлам.
 */
export function render(url: string): { html: string; headTags: string } {
  const head = pages.find((page) => page.path === url) ?? notFoundHead

  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )

  return { html, headTags: renderHead(head) }
}

/** Адреса, для которых нужно создать HTML-файлы. */
export const routes: string[] = pages.map((page) => page.path)

function absolute(path: string): string {
  return `${site.url}${path === '/' ? '' : path}`
}

export const sitemapXml: string = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...pages
    .filter((page) => page.priority !== 0)
    .map((page) =>
      [
        '  <url>',
        `    <loc>${absolute(page.path)}</loc>`,
        '    <changefreq>weekly</changefreq>',
        `    <priority>${page.priority ?? 0.7}</priority>`,
        '  </url>',
      ].join('\n'),
    ),
  '</urlset>',
  '',
].join('\n')

export const robotsTxt: string = [
  'User-agent: *',
  'Allow: /',
  ...pages.filter((page) => page.index === false).map((page) => `Disallow: ${page.path}`),
  '',
  `Host: ${site.url}`,
  `Sitemap: ${site.url}/sitemap.xml`,
  '',
].join('\n')
