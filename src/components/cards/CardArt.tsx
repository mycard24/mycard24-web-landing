import type { CSSProperties } from 'react'
import type { CardArt as CardArtSpec } from '@/content/types'
import { cn } from '@/lib/cn'
import { LogoMark } from '@/components/brand/Logo'

/**
 * Лицевая сторона карты.
 *
 * Размеры внутри карты заданы в `cqw` (container query width), поэтому карта
 * масштабируется целиком — от миниатюры в списке заказов до крупного рендера
 * в герое — без отдельных брейкпоинтов.
 *
 * ВАЖНО: для региональных карт это стилизованная реконструкция, а не
 * официальный макет оператора. Как только оператор согласует использование
 * своего дизайна — положите рендер в /public и заполните `art.image`:
 * компонент отрисует настоящее изображение вместо векторной стилизации.
 */

function NfcIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M7 7.5a7 7 0 0 1 0 9M11 5a11 11 0 0 1 0 14M3 10a3 3 0 0 1 0 4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Chip({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 34 26" fill="none" className={className} style={style} aria-hidden="true">
      <rect x="0.6" y="0.6" width="32.8" height="24.8" rx="4.4" fill="currentColor" opacity="0.9" />
      <path
        d="M0.6 9h9M0.6 17h9M33.4 9h-9M33.4 17h-9M12 0.6v24.8M22 0.6v24.8"
        stroke="#ffffff"
        strokeOpacity="0.5"
        strokeWidth="1.1"
      />
    </svg>
  )
}

interface CardArtProps {
  art: CardArtSpec
  /** Плашка поверх карты, например «Скоро» */
  badge?: string
  className?: string
  priority?: boolean
  /** Без тени и скругления: карта ложится в плитку встык, её обрезает контейнер */
  flat?: boolean
}

const shellBase = '@container relative aspect-[1.586] w-full overflow-hidden'

// Белый кант отделяет карты друг от друга, когда они лежат веером внахлёст
const shellRaised =
  'rounded-2xl shadow-[0_20px_44px_-22px_rgba(18,22,46,0.5),0_0_0_3px_rgba(255,255,255,0.9)]'

export function CardArt({
  art,
  badge,
  className,
  priority = false,
  flat = false,
}: CardArtProps) {
  const shell = cn(shellBase, !flat && shellRaised, className)

  if (art.image) {
    return (
      <div className={shell}>
        <img
          src={art.image.src}
          alt={art.image.alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          className="absolute inset-0 size-full object-cover"
        />
      </div>
    )
  }

  const isBrand = art.variant === 'brand'

  return (
    <div className={shell} style={{ backgroundColor: art.base, color: art.ink }}>
      {/* Мягкий блик по диагонали */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            'linear-gradient(125deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 42%, rgba(255,255,255,0.1) 100%)',
        }}
      />

      {isBrand ? (
        <>
          <div
            className="pointer-events-none absolute -top-[35%] -right-[22%] size-[85%] rounded-full opacity-45 blur-2xl"
            style={{ background: 'radial-gradient(circle, #ec1e79 0%, rgba(236,30,121,0) 70%)' }}
          />
          <div
            className="pointer-events-none absolute -bottom-[38%] -left-[18%] size-[80%] rounded-full opacity-40 blur-2xl"
            style={{ background: 'radial-gradient(circle, #EF5A2A 0%, rgba(239,90,42,0) 70%)' }}
          />
          <div className="absolute inset-0 flex flex-col justify-between p-[6.5cqw]">
            <div className="flex items-start justify-between">
              <span className="inline-flex items-center gap-[0.4em] text-[6cqw] leading-none font-bold tracking-tight">
                <LogoMark className="h-[1.8em] w-auto" />
                <span>
                  МояКарта<span className="opacity-80">24</span>
                </span>
              </span>
              <NfcIcon className="w-[8cqw]" />
            </div>
            <div className="flex items-end justify-between gap-[3cqw]">
              <div>
                <p className="text-[6.5cqw] leading-tight font-semibold">{art.title}</p>
                {art.subtitle && (
                  <p className="mt-[1cqw] text-[4.6cqw] leading-tight opacity-70">{art.subtitle}</p>
                )}
              </div>
              <Chip className="w-[16cqw]" style={{ color: art.accent }} />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Нижняя акцентная плашка */}
          <div className="absolute inset-x-0 bottom-0 h-[27%]" style={{ background: art.accent }} />
          <div className="absolute inset-0 flex flex-col p-[6.5cqw]">
            <div className="flex items-start justify-between">
              <Chip className="w-[15cqw]" style={{ color: art.accent }} />
              <NfcIcon className="w-[8cqw] opacity-85" />
            </div>
            <div className="mt-[2cqw] flex-1">
              <p className="text-[17cqw] leading-none font-black tracking-[0.02em]">{art.title}</p>
              {art.caption && (
                <p className="mt-[2.5cqw] max-w-[72%] text-[3.9cqw] leading-snug opacity-80">
                  {art.caption}
                </p>
              )}
            </div>
            {art.subtitle && (
              <p className="pb-[1cqw] text-[8.5cqw] leading-none font-bold text-ink">
                {art.subtitle}
              </p>
            )}
          </div>
        </>
      )}

      {badge && (
        <span className="absolute top-[6cqw] right-[6cqw] rounded-full bg-white/90 px-[3.5cqw] py-[1.4cqw] text-[4.2cqw] font-semibold text-ink-muted">
          {badge}
        </span>
      )}
    </div>
  )
}
