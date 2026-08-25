import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import type { Region } from '@/content/types'
import { MAP_VIEWBOX, SUBJECT_BY_ID } from './russia-map-data'

/** Прямоугольник в координатах карты — он же viewBox для <svg> */
export interface Frame {
  x: number
  y: number
  width: number
  height: number
}

/** Пропорция до первого замера: и на сервере, и в первом рендере клиента */
export const DEFAULT_ASPECT = 16 / 7

/**
 * Кадр вокруг региона: в него попадают и сам субъект, и все города-соседи,
 * иначе подписи уезжают за край.
 *
 * Слева поле больше, чем справа: текст героя лежит на левой половине, и регион
 * должен оказаться правее центра — как в макете.
 */
/**
 * Куда в кадре ставим центр региона.
 *
 * Правее текста, но левее правого края: по углам висят панели, и субъект должен
 * оказаться в просвете между ними, а не под ними.
 */
const TARGET_X = 0.54
const TARGET_Y = 0.52

/**
 * Кадр вокруг региона.
 *
 * Считаем от центра субъекта: он должен встать в заданную точку кадра (правее
 * текста и выше полосы преимуществ). Вокруг оставляем много воздуха — соседние
 * субъекты дают контекст «где это в стране», а сам регион не должен упираться
 * в края.
 */
export function frameFor(region: Region | null, aspect: number): Frame {
  const subject = region ? SUBJECT_BY_ID.get(region.map.subjectId) : undefined

  if (!subject) {
    const height = MAP_VIEWBOX.width / aspect
    return {
      x: MAP_VIEWBOX.x,
      y: MAP_VIEWBOX.y + (MAP_VIEWBOX.height - height) / 2,
      width: MAP_VIEWBOX.width,
      height,
    }
  }

  const { centroid, bbox } = subject

  // Субъект занимает примерно эту долю высоты кадра — от Москвы до Якутии
  // масштаб получается сопоставимым, а не «точка» и «во весь экран».
  const SUBJECT_SHARE = 0.42
  const span = Math.max(bbox.width / aspect, bbox.height) / SUBJECT_SHARE

  const height = span
  const width = span * aspect

  return {
    x: centroid.x - width * TARGET_X,
    y: centroid.y - height * TARGET_Y,
    width,
    height,
  }
}

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

/**
 * Плавный переход между кадрами.
 *
 * viewBox не анимируется средствами CSS, а CSS-трансформ не подходит: вместе с
 * картой поехали бы и HTML-подписи городов — они позиционируются в процентах от
 * того же кадра. Поэтому интерполируем сам кадр: SVG и подписи читают одно
 * значение и не расходятся ни на одном кадре анимации.
 */
export function useMapFrame(region: Region | null, aspect: number, duration = 1100): Frame {
  const [frame, setFrame] = useState(() => frameFor(region, aspect))
  const fromRef = useRef(frame)
  const rafRef = useRef(0)
  const key = `${region?.slug ?? '—'}:${aspect.toFixed(3)}`

  useEffect(() => {
    const to = frameFor(region, aspect)
    const from = fromRef.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      fromRef.current = to
      rafRef.current = requestAnimationFrame(() => setFrame(to))
      return () => cancelAnimationFrame(rafRef.current)
    }

    const start = performance.now()
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const k = easeOutCubic(t)
      const next: Frame = {
        x: from.x + (to.x - from.x) * k,
        y: from.y + (to.y - from.y) * k,
        width: from.width + (to.width - from.width) * k,
        height: from.height + (to.height - from.height) * k,
      }
      fromRef.current = next
      setFrame(next)
      if (t < 1) rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
    // Кадр зависит только от выбранного региона и пропорций контейнера
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, duration])

  return frame
}

/**
 * Пропорция контейнера.
 *
 * Нужна, чтобы кадр карты совпадал с боксом один в один: тогда
 * preserveAspectRatio не обрезает и не подставляет поля, а проценты подписей
 * ложатся ровно на координаты SVG.
 */
export function useContainerAspect(ref: RefObject<HTMLElement | null>): number {
  const [aspect, setAspect] = useState(DEFAULT_ASPECT)

  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return
      const { width, height } = entry.contentRect
      if (width > 0 && height > 0) setAspect(width / height)
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [ref])

  return aspect
}

/** Точка карты → проценты внутри кадра, для позиционирования HTML-подписей */
export function toPercent(point: { x: number; y: number }, frame: Frame) {
  return {
    left: ((point.x - frame.x) / frame.width) * 100,
    top: ((point.y - frame.y) / frame.height) * 100,
  }
}
