import type { RegionCard } from '@/content/types'
import { cn } from '@/lib/cn'
import { ExternalIcon } from '@/components/ui/icons'

/**
 * География карты: города, где она работает.
 *
 * Данные — покарточные (см. RegionCard.coverage): перечень маршрутов ведёт
 * оператор региона, и у другой карты он будет свой. Полный список маршрутов и
 * перевозчиков не дублируем — он меняется без нас, поэтому ведём к оператору.
 */
export function CoverageSection({ card, className }: { card: RegionCard; className?: string }) {
  const coverage = card.coverage
  if (!coverage) return null

  const groups = [
    { title: 'Городские маршруты', cities: coverage.city },
    { title: 'Пригородные маршруты', cities: coverage.suburban },
  ].filter((group) => group.cities.length > 0)

  return (
    <div className={cn('grid gap-6 sm:grid-cols-2', className)}>
      {groups.map((group) => (
        <div key={group.title} className="rounded-card bg-white p-5 ring-1 ring-line sm:p-6">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-semibold text-ink">{group.title}</h3>
            <span className="text-sm text-ink-muted tabular-nums">{group.cities.length}</span>
          </div>
          <ul className="mt-4 flex flex-wrap gap-2">
            {group.cities.map((city) => (
              <li
                key={city}
                className="rounded-lg bg-surface-soft px-2.5 py-1.5 text-[0.85rem] text-ink-soft ring-1 ring-line/70"
              >
                {city}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <p className="text-sm text-ink-muted text-pretty sm:col-span-2">
        Перечень маршрутов и перевозчиков ведёт оператор карты и обновляет его сам.{' '}
        <a
          href={coverage.source}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-semibold text-brand-magenta transition-colors hover:text-brand-orange"
        >
          Проверить свой маршрут
          <ExternalIcon className="size-4" />
        </a>
      </p>
    </div>
  )
}
