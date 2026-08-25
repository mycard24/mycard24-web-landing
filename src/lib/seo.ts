import { site } from '@/content/site'

/**
 * Описание <head> одной страницы.
 *
 * Next собирал теги сам из `export const metadata`. Здесь тот же контракт, но
 * явный: страница экспортирует `head`, сборка превращает его в теги (см.
 * renderHead), а клиентская навигация — в правки document (см. applyHead).
 */
export interface PageHead {
  /** Абсолютный путь: '/', '/regions', '/bashkortostan/transport' */
  path: string
  /** Заголовок без суффикса бренда. Пустой — только на главной. */
  title?: string
  description: string
  /** false → noindex. Для оферты и политики. */
  index?: boolean
  /** Приоритет в sitemap.xml. 0 — не включать страницу в карту сайта. */
  priority?: number
}

export function fullTitle(title?: string): string {
  return title ? `${title} — ${site.name}` : `${site.name} — ${site.tagline}`
}

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.name,
  url: site.url,
  description: site.description,
  email: site.email,
  // E.164, а не человекочитаемый формат: разметку читают роботы
  telephone: site.phoneHref,
  areaServed: { '@type': 'Country', name: 'Россия' },
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Теги <head> строкой — подставляются в шаблон на этапе пререндера. */
export function renderHead(head: PageHead): string {
  const title = fullTitle(head.title)
  const url = `${site.url}${head.path === '/' ? '' : head.path}`
  const tags: Array<[string, string]> = [
    ['description', head.description],
    ['robots', head.index === false ? 'noindex, follow' : 'index, follow'],
  ]
  const og: Array<[string, string]> = [
    ['og:type', 'website'],
    ['og:locale', 'ru_RU'],
    ['og:site_name', site.name],
    ['og:title', title],
    ['og:description', head.description],
    ['og:url', url],
  ]

  return [
    `<title>${escapeAttr(title)}</title>`,
    ...tags.map(([name, content]) => `<meta name="${name}" content="${escapeAttr(content)}" />`),
    `<link rel="canonical" href="${escapeAttr(url)}" />`,
    ...og.map(([property, content]) => `<meta property="${property}" content="${escapeAttr(content)}" />`),
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(head.description)}" />`,
    `<script type="application/ld+json">${JSON.stringify(organizationJsonLd)}</script>`,
  ].join('\n    ')
}

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.append(el)
  }
  el.content = content
}

/**
 * Правит <head> при клиентской навигации. Пререндер уже положил корректные
 * теги в HTML, поэтому здесь важен только переход между страницами.
 */
export function applyHead(head: PageHead): void {
  const title = fullTitle(head.title)
  const url = `${site.url}${head.path === '/' ? '' : head.path}`

  document.title = title
  setMeta('meta[name="description"]', 'name', 'description', head.description)
  setMeta(
    'meta[name="robots"]',
    'name',
    'robots',
    head.index === false ? 'noindex, follow' : 'index, follow',
  )
  setMeta('meta[property="og:title"]', 'property', 'og:title', title)
  setMeta('meta[property="og:description"]', 'property', 'og:description', head.description)
  setMeta('meta[property="og:url"]', 'property', 'og:url', url)

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.append(canonical)
  }
  canonical.href = url
}
