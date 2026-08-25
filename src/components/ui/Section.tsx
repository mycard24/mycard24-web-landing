import type { ReactNode } from 'react'
import { AppLink } from './AppLink'
import { cn } from '@/lib/cn'
import { Container } from './Container'
import { ArrowRightIcon } from './icons'

interface SectionProps {
  id?: string
  title?: string
  description?: string
  /** Ссылка «смотреть все» справа от заголовка */
  action?: { href: string; label: string }
  children: ReactNode
  className?: string
  /** Мягкая подложка вместо белого фона */
  muted?: boolean
  /** Прижать секцию к предыдущей — например, чтобы она попадала в первый экран */
  tight?: boolean
}

export function Section({
  id,
  title,
  description,
  action,
  children,
  className,
  muted = false,
  tight = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        tight ? 'pt-2 pb-10 sm:pt-4 sm:pb-14' : 'py-10 sm:py-14',
        muted && 'bg-surface-soft',
        className,
      )}
    >
      <Container>
        {(title || action) && (
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
            <div className="max-w-2xl">
              {title && (
                <h2 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-3 text-base text-ink-muted text-pretty">{description}</p>
              )}
            </div>
            {action && (
              <AppLink
                href={action.href}
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-magenta transition-colors hover:text-brand-orange"
              >
                {action.label}
                <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
              </AppLink>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  )
}
