import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type BadgeTone = 'available' | 'soon' | 'brand' | 'neutral'

const tones: Record<BadgeTone, string> = {
  available: 'bg-available-soft text-available',
  soon: 'bg-surface-sunk text-ink-muted',
  brand: 'gradient-cta text-white',
  neutral: 'bg-white/80 text-ink-soft ring-1 ring-line',
}

export function Badge({
  tone = 'neutral',
  children,
  className,
}: {
  tone?: BadgeTone
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
