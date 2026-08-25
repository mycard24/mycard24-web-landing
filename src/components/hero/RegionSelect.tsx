import { useEffect, useId, useRef, useState } from 'react'
import type { Region } from '@/content/types'
import { cn } from '@/lib/cn'
import { Badge } from '@/components/ui/Badge'
import { ChevronDownIcon, PinIcon } from '@/components/ui/icons'

interface RegionSelectProps {
  regions: Region[]
  value: string | null
  onChange: (slug: string) => void
  placeholder?: string
  className?: string
}

/**
 * Выбор региона — паттерн combobox + listbox по WAI-ARIA:
 * стрелки двигают активную опцию, Enter выбирает, Escape закрывает,
 * связь «кнопка ↔ активная опция» держится через aria-activedescendant.
 */
export function RegionSelect({
  regions,
  value,
  onChange,
  placeholder = 'Выберите регион',
  className,
}: RegionSelectProps) {
  const listboxId = useId()
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const optionRefs = useRef<(HTMLLIElement | null)[]>([])

  const selectedIndex = regions.findIndex((r) => r.slug === value)
  const selected = selectedIndex >= 0 ? regions[selectedIndex] : undefined

  // Закрытие по клику вне и по потере фокуса
  useEffect(() => {
    if (!open) return
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  // Держим активную опцию в зоне видимости
  useEffect(() => {
    if (!open) return
    optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' })
  }, [open, activeIndex])

  function openList(startIndex = selectedIndex >= 0 ? selectedIndex : 0) {
    setActiveIndex(startIndex)
    setOpen(true)
  }

  function commit(index: number) {
    const region = regions[index]
    if (!region) return
    onChange(region.slug)
    setOpen(false)
  }

  function onKeyDown(event: React.KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (!open) openList()
        else setActiveIndex((i) => Math.min(i + 1, regions.length - 1))
        break
      case 'ArrowUp':
        event.preventDefault()
        if (!open) openList()
        else setActiveIndex((i) => Math.max(i - 1, 0))
        break
      case 'Home':
        if (open) {
          event.preventDefault()
          setActiveIndex(0)
        }
        break
      case 'End':
        if (open) {
          event.preventDefault()
          setActiveIndex(regions.length - 1)
        }
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (open) commit(activeIndex)
        else openList()
        break
      case 'Escape':
        if (open) {
          event.preventDefault()
          setOpen(false)
        }
        break
      case 'Tab':
        setOpen(false)
        break
    }
  }

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-activedescendant={open ? `${listboxId}-opt-${activeIndex}` : undefined}
        aria-label="Регион"
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={cn(
          'flex h-14 w-full items-center gap-3 rounded-xl bg-white px-4 text-left',
          'ring-1 ring-line-strong transition hover:ring-ink-muted/40',
          open && 'ring-2 ring-brand-magenta',
        )}
      >
        <PinIcon className="size-5 shrink-0 text-brand-magenta" />
        <span
          className={cn(
            'flex-1 truncate text-[0.975rem] font-medium',
            selected ? 'text-ink' : 'text-ink-muted',
          )}
        >
          {selected ? selected.name : placeholder}
        </span>
        <ChevronDownIcon
          className={cn(
            'size-5 shrink-0 text-ink-muted transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Регионы"
          className={cn(
            'absolute top-[calc(100%+0.5rem)] right-0 left-0 z-50 max-h-72 overflow-y-auto',
            'rounded-xl bg-white p-1.5 shadow-[0_24px_48px_-20px_rgba(18,22,46,0.35)] ring-1 ring-line',
          )}
        >
          {regions.map((region, index) => {
            const isActive = index === activeIndex
            const isSelected = region.slug === value
            return (
              <li
                key={region.slug}
                id={`${listboxId}-opt-${index}`}
                ref={(node) => {
                  optionRefs.current[index] = node
                }}
                role="option"
                aria-selected={isSelected}
                onPointerEnter={() => setActiveIndex(index)}
                onClick={() => commit(index)}
                className={cn(
                  'flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5',
                  isActive && 'bg-surface-soft',
                )}
              >
                <span className="flex flex-col">
                  <span className="text-[0.95rem] font-medium text-ink">{region.name}</span>
                  <span className="text-xs text-ink-muted">{region.summary}</span>
                </span>
                <Badge tone={region.status === 'available' ? 'available' : 'soon'}>
                  {region.status === 'available' ? 'Доступна' : 'Скоро'}
                </Badge>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
