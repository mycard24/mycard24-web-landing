import type { CSSProperties } from 'react'
import { AppLink } from '@/components/ui/AppLink'
import { LandmarkImage } from '@/components/ui/LandmarkImage'
import type { Region } from '@/content/types'
import { cn } from '@/lib/cn'
import { ArrowRightIcon, PinIcon } from '@/components/ui/icons'

/**
 * Карточка региона: снимок занимает всю плитку, текст лежит поверх него справа.
 *
 * Кадр приближен и смещён вправо через transform-origin, поэтому сама
 * достопримечательность оказывается в левой трети карточки, а под текстом
 * остаётся спокойный фон (небо, зелень). Небольшой сдвиг вниз оставляет над
 * объектом воздух. Степень приближения задаётся у региона (landmark.zoom):
 * стилизованным иллюстрациям нужно больше, чем почти квадратным фотографиям.
 *
 * Подложек и вуалей под текстом нет — белый текст лежит прямо на снимке,
 * читаемость держится только на тени. Значит, кадр обязан оставлять справа
 * спокойное и достаточно тёмное место. При наведении — очень медленный и
 * едва заметный зум.
 */
export function RegionCard({ region, className }: { region: Region; className?: string }) {
  const isAvailable = region.status === 'available'

  const shell = cn(
    'group relative block aspect-[6/5] overflow-hidden rounded-2xl',
    isAvailable ? 'bg-white' : 'bg-surface-soft ring-1 ring-line',
    className,
  )

  const body = (
    <>
      {region.landmark && (
        <LandmarkImage
          landmark={region.landmark}
          sizes="(max-width: 640px) 86vw, 320px"
          style={{ '--zoom': region.landmark.zoom ?? 1.4 } as CSSProperties}
          className={
            'absolute inset-0 size-full translate-y-[4%] scale-[var(--zoom)] origin-[88%_60%] object-cover ' +
            'transition-transform duration-[1200ms] ease-out group-hover:scale-[calc(var(--zoom)*1.035)]'
          }
        />
      )}

      <div
        className={cn(
          'absolute inset-0 flex flex-col justify-center gap-1.5',
          // Отступ слева освобождает место под снимок; без снимка он не нужен
          region.landmark ? 'pr-5 pl-[52%]' : 'px-6',
        )}
      >
        <h3
          className={cn(
            'text-[1.05rem] leading-tight font-semibold text-balance',
            region.landmark
              ? 'text-white drop-shadow-[0_2px_10px_rgba(6,9,24,0.7)]'
              : 'text-ink',
          )}
        >
          {region.name}
        </h3>
        <p
          className={cn(
            'text-[0.8rem] leading-snug text-pretty',
            region.landmark
              ? 'font-medium text-white drop-shadow-[0_2px_8px_rgba(6,9,24,0.7)]'
              : 'text-ink-muted',
          )}
        >
          {isAvailable ? region.summary : 'Скоро'}
        </p>
        {isAvailable && (
          <ArrowRightIcon
            className="mt-1 size-5 text-white drop-shadow-[0_2px_8px_rgba(6,9,24,0.7)] transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        )}
      </div>
    </>
  )

  // У региона со статусом «скоро» своей страницы нет — карточка не кликается
  if (!isAvailable) {
    return <div className={shell}>{body}</div>
  }

  return (
    <AppLink href={`/${region.slug}`} className={shell}>
      {body}
    </AppLink>
  )
}

/** Замыкающая плитка ленты — приглашение следить за новыми регионами. */
export function RegionSoonCard({ className }: { className?: string }) {
  return (
    <AppLink
      href="/contacts"
      className={cn(
        'group relative block aspect-[6/5] overflow-hidden rounded-2xl bg-surface-soft',
        className,
      )}
    >
      <div className="absolute inset-0 flex flex-col justify-center gap-1.5 px-6">
        <PinIcon className="size-5 text-ink-muted" aria-hidden="true" />
        <h3 className="text-[1.05rem] leading-tight font-semibold text-balance text-ink">
          Скоро в вашем регионе
        </h3>
        <p className="text-[0.8rem] leading-snug text-ink-muted">Следите за новостями</p>
      </div>
    </AppLink>
  )
}
