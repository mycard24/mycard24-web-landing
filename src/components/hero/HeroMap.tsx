import type { RefObject } from 'react'
import { cities } from '@/content/cities'
import type { Region } from '@/content/types'
import { cn } from '@/lib/cn'
import { CITY_POINTS, SUBJECT_BY_ID, SUBJECTS } from './russia-map-data'
import { toPercent, type Frame } from './useMapFrame'

/**
 * Карта России во всю ширину героя.
 *
 * Границы всех 85 субъектов — реальные (Natural Earth 50m, спроецированы
 * скриптом `npm run build:map`). Подсвечен только тот субъект, где карта
 * действительно работает: связей с соседними регионами не рисуем, чтобы не
 * обещать покрытие, которого нет.
 *
 * viewBox совпадает по пропорции с контейнером (см. useContainerAspect), поэтому
 * HTML-подписи городов можно позиционировать процентами от того же кадра —
 * линия всегда упирается ровно в подпись.
 *
 * Слой декоративный: смысл продублирован текстом героя и списком регионов ниже.
 */
/** Небольшой запас, чтобы флаг гарантированно перекрывал контур по краям */
const FLAG_OVERSCALE = 1.04

export function HeroMap({
  containerRef,
  regions,
  selected,
  frame,
  aspect,
  className,
}: {
  containerRef: RefObject<HTMLDivElement | null>
  regions: Region[]
  selected: Region | null
  frame: Frame
  /** Пропорция контейнера — по ней клетка сетки остаётся квадратной */
  aspect: number
  className?: string
}) {
  const subject = selected ? SUBJECT_BY_ID.get(selected.map.subjectId) : undefined
  const flag = selected?.map.flag

  // Прямоугольник флага строим сами: он повторяет пропорцию картинки и
  // перекрывает габариты субъекта, поэтому внутри контура не остаётся пустот
  // сверху и снизу. Лишнее срезает clipPath по самому контуру.
  const flagRect = (() => {
    if (!flag || !subject) return null
    const { bbox } = subject
    const height = Math.max(bbox.height, bbox.width / flag.aspect) * FLAG_OVERSCALE
    const width = height * flag.aspect
    return {
      x: bbox.x + (bbox.width - width) / 2,
      y: bbox.y + (bbox.height - height) / 2,
      width,
      height,
    }
  })()
  const capitalKey = selected?.map.capital
  const capital = capitalKey ? cities[capitalKey] : undefined
  const centre = capitalKey ? CITY_POINTS[capitalKey] : subject?.centroid

  // Субъекты остальных регионов платформы — чуть заметнее фона
  const platformIds = new Set(regions.map((r) => r.map.subjectId))

  // Штрихи заданы в единицах кадра: при наезде их надо ужимать, иначе границы
  // на близком плане превращаются в толстые полосы.
  const k = frame.width / 1600

  return (
    <div
      ref={containerRef}
      className={cn(
        'pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-45 lg:opacity-100',
        className,
      )}
      aria-hidden="true"
    >
      <svg
        viewBox={`${frame.x} ${frame.y} ${frame.width} ${frame.height}`}
        preserveAspectRatio="xMidYMid meet"
        className="size-full"
      >
        <defs>
          <linearGradient id="mc24-region" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fb6d3a" />
            <stop offset="52%" stopColor="#ec1e79" />
            <stop offset="100%" stopColor="#22c3e6" />
          </linearGradient>


          <radialGradient id="mc24-halo">
            <stop offset="0%" stopColor="#ec1e79" stopOpacity="0.3" />
            <stop offset="45%" stopColor="#fb6d3a" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ec1e79" stopOpacity="0" />
          </radialGradient>

          <filter id="mc24-glow" x="-90%" y="-90%" width="280%" height="280%">
            <feGaussianBlur stdDeviation={7 * k} />
          </filter>

          {/* Сетка в клетку. Тайл задан в долях кадра (objectBoundingBox), а не
              в его координатах: при переходе к другому региону кадр меняется, а
              доля — нет, поэтому клетка не едет и не меняет шаг. viewBox внутри
              задаёт саму линию: каждый тайл рисует верхнюю и левую грань, и
              штрихи стыкуются в сплошные линии. */}
          <pattern
            id="mc24-grid"
            patternUnits="objectBoundingBox"
            width={1 / 85}
            height={aspect / 85}
            viewBox="0 0 24 24"
          >
            <path d="M24 0 L0 0 L0 24" fill="none" stroke="#ffffff" strokeWidth={1.4} />
          </pattern>

          {/* Из-под сетки вырезаем выбранный регион — по нему она идти не должна */}
          <mask id="mc24-grid-mask">
            <rect
              x={frame.x}
              y={frame.y}
              width={frame.width}
              height={frame.height}
              fill="#ffffff"
            />
            {subject && <path d={subject.d} fill="#000000" />}
          </mask>

          {/* Широкое размытие для свечения по границе субъекта */}
          <filter id="mc24-edge-glow" x="-140%" y="-140%" width="380%" height="380%">
            <feGaussianBlur stdDeviation={5 * k} />
          </filter>
        </defs>

        {/* Все субъекты РФ: заливка и границы */}
        <g>
          {SUBJECTS.map((s) => (
            <path
              key={s.id}
              d={s.d}
              fill={platformIds.has(s.id) ? '#d3ddf3' : '#e3e9f7'}
              stroke="#a9b8db"
              strokeWidth={1.3 * k}
              strokeLinejoin="round"
            />
          ))}
        </g>

        <rect
          x={frame.x}
          y={frame.y}
          width={frame.width}
          height={frame.height}
          fill="url(#mc24-grid)"
          mask="url(#mc24-grid-mask)"
          opacity={0.7}
        />

        {centre && (
          <circle cx={centre.x} cy={centre.y} r={frame.width * 0.19} fill="url(#mc24-halo)" />
        )}

        {/* Подсвеченный субъект: свечение за контуром, флаг внутри */}
        {subject && (
          <g>
            {/* Мягкая подсветка вокруг всей фигуры */}
            <path d={subject.d} fill="url(#mc24-region)" opacity={0.42} filter="url(#mc24-glow)" />

            {/* Само свечение границы: широкий градиентный штрих с размытием.
                Лежит под заливкой, поэтому наружу уходит ореол, а внутрь —
                нет: там флаг. */}
            <path
              d={subject.d}
              fill="none"
              stroke="url(#mc24-region)"
              strokeWidth={9 * k}
              strokeLinejoin="round"
              filter="url(#mc24-edge-glow)"
            />

            {flag && flagRect ? (
              <>
                <clipPath id="mc24-region-clip">
                  <path d={subject.d} />
                </clipPath>
                <g clipPath="url(#mc24-region-clip)">
                  <image
                    href={flag.src}
                    x={flagRect.x}
                    y={flagRect.y}
                    width={flagRect.width}
                    height={flagRect.height}
                    preserveAspectRatio="xMidYMid slice"
                  />
                  <rect
                    x={flagRect.x}
                    y={flagRect.y}
                    width={flagRect.width}
                    height={flagRect.height}
                    fill="url(#mc24-region)"
                    opacity={0.2}
                    style={{ mixBlendMode: 'overlay' }}
                  />
                </g>
              </>
            ) : (
              <path d={subject.d} fill="url(#mc24-region)" opacity={0.92} />
            )}

            {/* Граница — только фирменный градиент: белый кант между ним и
                свечением читался как грязная кайма */}
            <path
              d={subject.d}
              fill="none"
              stroke="url(#mc24-region)"
              strokeWidth={2.4 * k}
              strokeLinejoin="round"
            />
          </g>
        )}

        {/* Пульс в административном центре */}
        {centre && (
          <g>
            <circle
              cx={centre.x}
              cy={centre.y}
              r={7 * k}
              fill="none"
              stroke="#ec1e79"
              strokeWidth={1.8 * k}
            >
              <animate
                attributeName="r"
                values={`${6 * k};${20 * k};${6 * k}`}
                dur="3.2s"
                repeatCount="indefinite"
              />
              <animate attributeName="opacity" values="0.55;0;0.55" dur="3.2s" repeatCount="indefinite" />
            </circle>
            <circle cx={centre.x} cy={centre.y} r={5.5 * k} fill="#ec1e79" />
            <circle cx={centre.x} cy={centre.y} r={2.2 * k} fill="#ffffff" />
          </g>
        )}
      </svg>

      {/* Административный центр */}
      {capital && centre && (
        <div
          className="absolute hidden -translate-y-1/2 translate-x-4 text-[0.85rem] font-bold text-ink drop-shadow-[0_1px_5px_rgba(255,255,255,0.98)] lg:block"
          style={{
            left: `${toPercent(centre, frame).left}%`,
            top: `${toPercent(centre, frame).top}%`,
          }}
        >
          {capital.name}
        </div>
      )}

      {/* Ширмы: слева под текст, по краям — чтобы карта растворялась в фоне */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#fff_0%,rgba(255,255,255,0.9)_26%,rgba(255,255,255,0.55)_44%,rgba(255,255,255,0.12)_62%,transparent_78%)]"
      />
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/75 to-transparent" />
    </div>
  )
}
