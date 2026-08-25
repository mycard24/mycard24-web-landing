import type { FaqItem } from '@/content/types'
import { cn } from '@/lib/cn'
import { ChevronDownIcon } from './icons'

/**
 * Аккордеон на нативных <details>/<summary>: доступен с клавиатуры и работает
 * без JavaScript, поэтому содержимое ответов индексируется поисковиками.
 */
export function FaqList({ items, className }: { items: FaqItem[]; className?: string }) {
  return (
    <div className={cn('divide-y divide-line rounded-card bg-white ring-1 ring-line', className)}>
      {items.map((item) => (
        <details key={item.question} className="faq-item group px-5 sm:px-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left font-semibold text-ink">
            <span className="text-pretty">{item.question}</span>
            <ChevronDownIcon className="faq-chevron size-5 shrink-0 text-ink-muted transition-transform duration-200" />
          </summary>
          <div className="pb-5 text-[0.95rem] leading-relaxed text-ink-muted text-pretty">
            {item.answer}
          </div>
        </details>
      ))}
    </div>
  )
}

/** Разметка FAQPage — даёт расширенный сниппет в выдаче. */
export function FaqJsonLd({ items }: { items: FaqItem[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
