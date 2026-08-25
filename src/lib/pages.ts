import { availableRegions } from '@/content/regions'
import type { PageHead } from '@/lib/seo'
import { head as homeHead } from '@/pages/HomePage'
import { head as regionsHead } from '@/pages/RegionsPage'
import { head as deliveryHead } from '@/pages/DeliveryPage'
import { head as faqHead } from '@/pages/FaqPage'
import { head as contactsHead } from '@/pages/ContactsPage'
import { head as regionHead } from '@/pages/RegionPage'
import { head as cardHead } from '@/pages/CardPage'

/**
 * Полный список адресов сайта — один источник правды для трёх потребителей:
 * пререндера (какие файлы создать), sitemap.xml и клиентской навигации
 * (какие теги подставить в <head> при переходе).
 *
 * Раньше это знание было размазано по файловой маршрутизации Next,
 * generateStaticParams и sitemap.ts. Здесь оно собрано в одном месте.
 */
export const pages: PageHead[] = [
  homeHead,
  regionsHead,
  deliveryHead,
  faqHead,
  contactsHead,
  // Только запущенные регионы: у остальных страниц нет — ни в пререндере,
  // ни в sitemap, ни в клиентской навигации.
  ...availableRegions.flatMap((region) => [
    regionHead(region),
    ...region.cards.map((card) => cardHead(region, card)),
  ]),
]

export const headByPath = new Map(pages.map((page) => [page.path, page]))
