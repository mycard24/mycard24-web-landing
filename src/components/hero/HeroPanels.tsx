import type { Region } from '@/content/types'
import { cn } from '@/lib/cn'
import { CardArt } from '@/components/cards/CardArt'
import { AppLink } from '@/components/ui/AppLink'
import { ArrowRightIcon, CheckIcon } from '@/components/ui/icons'

const panel =
  'rounded-2xl bg-white/80 ring-1 ring-line shadow-[0_28px_56px_-30px_rgba(18,22,46,0.5)] backdrop-blur-md'

/**
 * Единственная панель поверх карты: что за регион, что за карта и можно ли её
 * оформить. Ведёт сразу на страницу продукта — это главный путь героя, кнопка
 * слева дублирует его на уровне региона.
 *
 * У региона со статусом «скоро» продукта нет, поэтому панель ничего не обещает
 * и никуда не ведёт.
 */
export function HeroPanels({
  selected,
  className,
}: {
  selected: Region | null
  className?: string
}) {
  if (!selected) return null

  const card = selected.cards.find((c) => c.status === 'available')

  const shell = cn(
    panel,
    'w-full max-w-sm p-3',
    'lg:absolute lg:right-0 lg:bottom-0 lg:w-[92%] lg:max-w-none',
  )

  return (
    // На широких экранах панель прижата к нижнему правому углу сцены;
    // на узких — обычный блок под текстом.
    <div className={cn('relative lg:block lg:h-full', className)}>
      {card ? (
        <AppLink
          href={`/${selected.slug}/${card.slug}`}
          className={cn(shell, 'group flex items-center gap-4 transition hover:ring-line-strong')}
        >
          <span className="w-[38%] shrink-0">
            <CardArt art={card.art} priority />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[0.95rem] leading-tight font-semibold text-ink text-pretty">
              {card.name}
            </span>
            <span className="mt-0.5 block truncate text-xs text-ink-muted">{selected.name}</span>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-available-soft px-2.5 py-1 text-[0.68rem] font-semibold text-available">
              <CheckIcon className="size-3" />
              Карта доступна
            </span>
          </span>
          <ArrowRightIcon className="size-4 shrink-0 text-ink-soft transition-transform group-hover:translate-x-0.5" />
        </AppLink>
      ) : (
        <div className={cn(shell, 'px-4 py-4')}>
          <p className="text-[0.95rem] leading-tight font-semibold text-ink">
            {selected.name} — скоро
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-muted text-pretty">
            Ведём переговоры с оператором {selected.locative}. Напишите нам, если хотите узнать
            о запуске первыми.
          </p>
        </div>
      )}
    </div>
  )
}
