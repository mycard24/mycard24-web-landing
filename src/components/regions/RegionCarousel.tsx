import { useCallback, useEffect, useRef, useState } from 'react'
import type { Region } from '@/content/types'
import { cn } from '@/lib/cn'
import { ArrowRightIcon } from '@/components/ui/icons'
import { RegionCard, RegionSoonCard } from './RegionCard'

/**
 * Лента регионов.
 *
 * Основа — нативная горизонтальная прокрутка со scroll-snap: работает свайпом
 * на тач-устройствах, колесом на трекпаде и стрелками с клавиатуры, а также
 * без JavaScript. Кнопки — надстройка для мыши, они лишь прокручивают ленту.
 */
export function RegionCarousel({
  regions,
  className,
}: {
  regions: Region[]
  className?: string
}) {
  const trackRef = useRef<HTMLUListElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(true)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const update = () => {
      const max = track.scrollWidth - track.clientWidth
      setAtStart(track.scrollLeft <= 1)
      setAtEnd(track.scrollLeft >= max - 1)
    }

    // ResizeObserver вызывает update сразу после observe — это же и есть
    // первичный замер, поэтому setState не дёргается синхронно в эффекте.
    const observer = new ResizeObserver(update)
    observer.observe(track)
    track.addEventListener('scroll', update, { passive: true })

    return () => {
      observer.disconnect()
      track.removeEventListener('scroll', update)
    }
  }, [])

  const scrollByCard = useCallback((direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const card = track.firstElementChild as HTMLElement | null
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0
    const step = card ? card.offsetWidth + gap : track.clientWidth * 0.8
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollBy({ left: step * direction, behavior: reduced ? 'auto' : 'smooth' })
  }, [])

  const item = 'w-[86vw] max-w-[320px] shrink-0 snap-start sm:w-[276px]'

  const arrow =
    'grid size-11 place-items-center rounded-full bg-white text-ink-soft shadow-[0_12px_28px_-14px_rgba(18,22,46,0.5)] ' +
    'ring-1 ring-line transition hover:text-ink hover:ring-line-strong disabled:pointer-events-none disabled:opacity-0'

  return (
    <div className={cn('relative', className)}>
      <ul
        ref={trackRef}
        tabIndex={0}
        role="group"
        aria-label="Регионы платформы"
        className="no-scrollbar flex snap-x snap-mandatory items-stretch gap-5 overflow-x-auto scroll-smooth pb-1"
      >
        {regions.map((region) => (
          <li key={region.slug} className={item}>
            <RegionCard region={region} />
          </li>
        ))}
        <li className={item}>
          <RegionSoonCard />
        </li>
      </ul>

      {/* Кнопки прокрутки — вспомогательные, на узких экранах не нужны */}
      <div className="pointer-events-none absolute inset-y-0 -left-3 hidden items-center md:flex">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          disabled={atStart}
          aria-label="Предыдущие регионы"
          className={cn(arrow, 'pointer-events-auto')}
        >
          <ArrowRightIcon className="size-5 rotate-180" />
        </button>
      </div>
      <div className="pointer-events-none absolute inset-y-0 -right-3 hidden items-center md:flex">
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          disabled={atEnd}
          aria-label="Следующие регионы"
          className={cn(arrow, 'pointer-events-auto')}
        >
          <ArrowRightIcon className="size-5" />
        </button>
      </div>
    </div>
  )
}
