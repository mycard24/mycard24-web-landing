import type { CSSProperties } from 'react'
import type { Region } from '@/content/types'

/**
 * Фотография достопримечательности региона.
 *
 * Заменяет next/image: тот подбирал формат и размер на лету, здесь варианты
 * подготовлены заранее и лежат в /public. Если у снимка есть `srcSet` (webp),
 * отдаём <picture> с ним, а `src` остаётся фолбэком; у векторных заглушек
 * вариантов нет — для них это обычный <img>.
 */
export function LandmarkImage({
  landmark,
  sizes,
  className,
  style,
  priority = false,
}: {
  landmark: NonNullable<Region['landmark']>
  /** Ширина картинки в вёрстке — по правилам sizes */
  sizes: string
  className?: string
  style?: CSSProperties
  /** Снимок в первом экране: грузим сразу, а не лениво */
  priority?: boolean
}) {
  const img = (
    <img
      src={landmark.src}
      alt={landmark.alt}
      className={className}
      style={style}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
    />
  )

  if (!landmark.srcSet) return img

  return (
    <picture>
      <source type="image/webp" srcSet={landmark.srcSet} sizes={sizes} />
      {img}
    </picture>
  )
}
