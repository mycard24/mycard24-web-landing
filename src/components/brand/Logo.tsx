import type { SVGProps } from 'react'
import { cn } from '@/lib/cn'

/**
 * Знак МояКарта24 — векторные контуры из docs/prototypes/logo.svg.
 *
 * Исходник монохромный: три контура (верхний «парус», карта с вырезанной
 * галочкой, нижний «парус»). Здесь контур карты разделён на внешнюю форму и
 * саму галочку, чтобы галочка всегда была белой, а не «дыркой» в пластике —
 * иначе на цветном фоне сквозь неё просвечивала бы подложка.
 *
 * Градиенты объявлены с фолбэком (`url(#id) #hex`), поэтому знак корректно
 * отрисуется даже если <defs> по какой-то причине не попали в документ.
 */

const CARD_OUTLINE =
  'M 1041.505 6479.043 C 834.281 6479.043 622.422 6267.184 622.257 6059.795 ' +
  'C 622.185 5969.335 622.33 3328.968 622.302 3202.595 C 622.257 2995.206 834.281 2783.347 1041.55 2783.347 ' +
  'C 1160.795 2783.347 5515.877 2783.347 5691.391 2783.347 C 5898.78 2783.347 6110.639 2995.206 6110.639 3202.595 ' +
  'C 6110.639 3336.595 6110.639 5931.255 6110.639 6056.551 C 6110.639 6267.388 5898.78 6479.043 5691.391 6479.043 ' +
  'C 5601.922 6479.043 1283.505 6479.043 1041.505 6479.043 Z'

const CARD_CHECK =
  'M 4703.102 5725.331 C 4982.943 6003.254 5103.498 6097.835 4783.656 5635.063 ' +
  'C 4508.9 5237.525 3158 3270 3158 3270 C 3158 3270 1734.99 4706.088 1711 4732 ' +
  'C 1632.341 4822.904 1638.242 4831.217 1739 4787 C 1754.24 4780.312 2793 4296 2917 4239 ' +
  'C 3071 4168 3049 4158 3324 4410 C 3454 4530 4631.225 5653.946 4703.102 5725.331 Z'

const WING_TOP =
  'M 1710 8081 C 1476.608 8041.554 1357 7894 1219 7568 C 969 6974 879 6764 844 6694 ' +
  'C 796 6597 817.05 6567.294 893 6627 C 926.826 6653.592 1002.776 6681.002 1033.96 6681.002 ' +
  'C 1090.348 6681.001 5335.368 6681.002 5335.368 6681.002 C 5335.368 6681.002 2171.145 8158.939 1710 8081 Z'

const WING_BOTTOM =
  'M 2287.35 2662.81 C 2053.95 2623.37 1934.34 2475.81 1796.34 2149.81 ' +
  'C 1546.34 1555.81 1456.34 1345.81 1421.34 1275.81 C 1373.34 1178.81 1394.39 1149.11 1470.34 1208.81 ' +
  'C 1504.16 1235.4 1580.11 1262.81 1611.31 1262.81 C 1667.68 1262.81 5912.71 1262.81 5912.71 1262.81 ' +
  'C 5912.71 1262.81 2748.49 2740.75 2287.35 2662.81 Z'

export function LogoMark({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="-0.0124 39.5412 365.8954 460.4588"
      className={cn('block', className)}
      role="img"
      aria-label="МояКарта24"
      {...props}
    >
      <defs>
        <linearGradient id="mc24-wing-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fdc23c" />
          <stop offset="100%" stopColor="#f79420" />
        </linearGradient>
        <linearGradient id="mc24-card" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#f0247a" />
          <stop offset="55%" stopColor="#ee2270" />
          <stop offset="100%" stopColor="#ff4d5f" />
        </linearGradient>
        <linearGradient id="mc24-wing-bottom" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2ad0ee" />
          <stop offset="100%" stopColor="#0fa8d6" />
        </linearGradient>
      </defs>

      <g
        transform="matrix(0.06666700541973114, 0, 0, -0.06666700541973114, -41.49505233764651, 578.4757690429688)"
        stroke="none"
      >
        <path d={WING_TOP} fill="url(#mc24-wing-top) #f9a825" />
        <path
          d={WING_BOTTOM}
          fill="url(#mc24-wing-bottom) #22c3e6"
          style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
          transform="matrix(-1, 0.000399, -0.000399, -1, 0, 0)"
        />
        <path d={CARD_OUTLINE} fill="url(#mc24-card) #ec1e79" />
        <path d={CARD_CHECK} fill="#ffffff" />
      </g>
    </svg>
  )
}

interface LogoProps {
  className?: string
  /** Только знак, без словесной части */
  markOnly?: boolean
  /** Инвертированный вордмарк для тёмных подложек */
  inverted?: boolean
}

export function Logo({ className, markOnly = false, inverted = false }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark className="h-7 w-auto" />
      {!markOnly && (
        <span
          className={cn(
            'text-[1.15rem] leading-none font-bold tracking-tight',
            inverted ? 'text-white' : 'text-ink',
          )}
        >
          МояКарта
          <span className="text-gradient-brand">24</span>
        </span>
      )}
    </span>
  )
}
