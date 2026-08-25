import { AppLink } from './AppLink'
import { site } from '@/content/site'

export interface Crumb {
  href?: string
  label: string
}

/** Хлебные крошки + разметка BreadcrumbList для поисковиков. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${site.url}${item.href}` } : {}),
    })),
  }

  return (
    <nav aria-label="Хлебные крошки" className="text-sm text-ink-muted">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {index > 0 && (
              <span aria-hidden="true" className="text-line-strong">
                /
              </span>
            )}
            {item.href ? (
              <AppLink href={item.href} className="transition-colors hover:text-ink">
                {item.label}
              </AppLink>
            ) : (
              <span className="text-ink-soft">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
