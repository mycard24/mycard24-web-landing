import type { TransportMode } from '@/content/types'
import { cn } from '@/lib/cn'
import { transportIcons } from '@/components/ui/icons'

export function TransportModes({
  modes,
  className,
}: {
  modes: TransportMode[]
  className?: string
}) {
  return (
    <ul className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6', className)}>
      {modes.map((mode) => {
        const Icon = transportIcons[mode.icon]
        return (
          <li
            key={mode.label}
            className="flex flex-col items-center gap-2.5 rounded-card bg-white px-3 py-5 text-center ring-1 ring-line"
          >
            <span className="grid size-11 place-items-center rounded-xl bg-surface-soft text-brand-magenta">
              <Icon className="size-6" />
            </span>
            <span className="text-sm font-medium text-ink-soft">{mode.label}</span>
          </li>
        )
      })}
    </ul>
  )
}
