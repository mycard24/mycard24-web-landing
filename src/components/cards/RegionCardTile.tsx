import { AppLink } from '@/components/ui/AppLink'
import type { Region, RegionCard } from '@/content/types'
import { cn } from '@/lib/cn'
import { formatPrice } from '@/lib/format'
import { ArrowRightIcon } from '@/components/ui/icons'
import { CardArt } from './CardArt'

/** Плитка продукта на странице региона. */
export function RegionCardTile({
  region,
  card,
  className,
}: {
  region: Region
  card: RegionCard
  className?: string
}) {
  const isAvailable = card.status === 'available'
  const body = (
    <>
      {/* Карта чуть уже плитки: небольшой отступ от краёв, своё скругление,
          но без тени — плитка и так лежит на белом */}
      <div className="px-3 pt-3">
        <CardArt art={card.art} flat className="rounded-xl" />
      </div>

      <div className="flex-1 px-5 pt-5">
        {/* Плашки статуса нет: о доступности говорит нижняя строка —
            «Подробнее» с ценой или «Готовим запуск» */}
        <h3 className="text-lg leading-snug font-semibold text-balance text-ink">
          {card.shortName}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-muted text-pretty">
          {card.tagline}
        </p>
      </div>

      {isAvailable ? (
        <div className="mx-5 mt-5 mb-5 flex items-center justify-between gap-3 border-t border-line pt-4">
          <span className="inline-flex items-start gap-0.5">
            <span className="text-lg font-bold text-ink">
              {card.price !== undefined ? formatPrice(card.price) : '—'}
            </span>

            {/* Сноска вместо подписи под ценой. Не <button>: плитка целиком —
                ссылка, а интерактивный элемент внутри ссылки недопустим.
                Отсюда же подсказка только по наведению, а смысл продублирован
                скрытым текстом для скринридеров. */}
            <span
              className="group/hint relative cursor-help text-sm leading-none font-bold text-brand-magenta"
              aria-hidden="true"
            >
              *
              <span
                className={cn(
                  'pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 translate-y-1',
                  'rounded-lg bg-ink px-2.5 py-1.5 text-xs leading-none font-medium whitespace-nowrap text-white',
                  'opacity-0 shadow-[0_10px_24px_-12px_rgba(18,22,46,0.9)] transition duration-200',
                  'group-hover/hint:translate-y-0 group-hover/hint:opacity-100',
                )}
              >
                стоимость карты
                <span
                  className="absolute top-full left-1/2 size-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-ink"
                  aria-hidden="true"
                />
              </span>
            </span>

            <span className="sr-only">стоимость карты</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-magenta">
            Подробнее
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      ) : (
        <p className="mx-5 mt-5 mb-5 border-t border-line pt-4 text-sm text-ink-muted">
          Готовим запуск {region.locative}
        </p>
      )}
    </>
  )

  const shell = cn(
    'group flex flex-col overflow-hidden rounded-card bg-white ring-1 ring-line transition duration-300',
    // Ни подъёма, ни тени при наведении — только контур, чтобы плитка
    // всё-таки читалась как ссылка
    isAvailable ? 'hover:ring-line-strong' : 'opacity-90',
    className,
  )

  if (!isAvailable) {
    return <div className={shell}>{body}</div>
  }

  return (
    <AppLink href={`/${region.slug}/${card.slug}`} className={shell}>
      {body}
    </AppLink>
  )
}
