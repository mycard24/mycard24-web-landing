import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function Svg({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

/* --- Транспорт ----------------------------------------------------------- */

export const BusIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v9H4z" />
    <path d="M4 10h16" />
    <path d="M7 20v-1M17 20v-1" />
    <circle cx="8" cy="16" r="1" />
    <circle cx="16" cy="16" r="1" />
  </Svg>
)

export const TrolleybusIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 9a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v9H5z" />
    <path d="M5 12h14" />
    <path d="M10 6 6 2M14 6l4-4" />
    <circle cx="9" cy="18" r="1" />
    <circle cx="15" cy="18" r="1" />
  </Svg>
)

export const TramIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="5" y="4" width="14" height="13" rx="3" />
    <path d="M5 10h14M12 4V2" />
    <path d="M8 20l2-3M16 20l-2-3M4 20h16" />
  </Svg>
)

export const MinibusIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 15V9a2 2 0 0 1 2-2h9l4 4h1a2 2 0 0 1 2 2v2z" />
    <circle cx="8" cy="16" r="1.8" />
    <circle cx="17" cy="16" r="1.8" />
    <path d="M9.8 16h5.4" />
  </Svg>
)

export const MetroIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 18 6 6l6 8 6-8 3 12" />
    <path d="M2 18h6M16 18h6" />
  </Svg>
)

export const TrainIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="5" y="3" width="14" height="14" rx="3" />
    <path d="M5 10h14" />
    <path d="M8 21l2-4M16 21l-2-4" />
    <circle cx="9" cy="13.5" r="0.8" />
    <circle cx="15" cy="13.5" r="0.8" />
  </Svg>
)

/* --- Преимущества и сервис ----------------------------------------------- */

export const WalletIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <path d="M3 8V6.5A1.5 1.5 0 0 1 4.5 5H15" />
    <path d="M16 12h5v4h-5a2 2 0 0 1 0-4z" />
  </Svg>
)

export const ShieldIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3 5 6v5.5c0 4.2 2.9 7.6 7 9.5 4.1-1.9 7-5.3 7-9.5V6z" />
    <path d="m9 12 2 2 4-4" />
  </Svg>
)

export const ClockIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 1.8" />
  </Svg>
)

export const UsersIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
    <path d="M16 5.5a3 3 0 0 1 0 5.6M17 14.4a5.2 5.2 0 0 1 3.5 4.6" />
  </Svg>
)

export const CardIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="2.5" y="5" width="19" height="14" rx="3" />
    <path d="M2.5 10h19" />
    <path d="M6 15h4" />
  </Svg>
)

export const TruckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2.5 16V7a1 1 0 0 1 1-1h9.5v10z" />
    <path d="M13 9h3.8l3.7 3.6V16H13z" />
    <circle cx="7" cy="17.5" r="1.8" />
    <circle cx="17" cy="17.5" r="1.8" />
  </Svg>
)

/* --- Интерфейс ------------------------------------------------------------ */

export const CheckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </Svg>
)

export const ArrowRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </Svg>
)

export const ChevronDownIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m6 9.5 6 6 6-6" />
  </Svg>
)

export const PinIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.6" />
  </Svg>
)

export const MenuIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
)

export const CloseIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
)

export const ExternalIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14 4h6v6M20 4l-8.5 8.5" />
    <path d="M19 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" />
  </Svg>
)

/* --- Соцсети -------------------------------------------------------------- */

// Фирменные знаки: у каждого своя система координат, общий <Svg> тут не подходит

export const TelegramIcon = (p: IconProps) => (
  <svg viewBox="28 44 420 420" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.7 10.1l7.4-104.9 190.9-172.5c8.3-7.4-1.8-11.5-12.9-4.1L142.8 271.4 42.2 240c-21.9-6.9-22.3-21.9 4.6-32.4L418.4 66.4c18.2-6.9 34.2 4.1 28.3 32.2z" />
  </svg>
)

export const VkIcon = (p: IconProps) => (
  <svg viewBox="0 0 48 48" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M25.54 34.5801C14.6 34.5801 8.3601 27.0801 8.1001 14.6001H13.5801C13.7601 23.7601 17.8 27.6401 21 28.4401V14.6001H26.1602V22.5001C29.3202 22.1601 32.6398 18.5601 33.7598 14.6001H38.9199C38.0599 19.4801 34.4599 23.0801 31.8999 24.5601C34.4599 25.7601 38.5601 28.9001 40.1201 34.5801H34.4399C33.2199 30.7801 30.1802 27.8401 26.1602 27.4401V34.5801H25.54Z" />
  </svg>
)

/* --- Реестры -------------------------------------------------------------- */

export const transportIcons = {
  bus: BusIcon,
  trolleybus: TrolleybusIcon,
  tram: TramIcon,
  minibus: MinibusIcon,
  metro: MetroIcon,
  train: TrainIcon,
} as const

export const featureIcons = {
  wallet: WalletIcon,
  shield: ShieldIcon,
  clock: ClockIcon,
  users: UsersIcon,
  card: CardIcon,
  truck: TruckIcon,
} as const
