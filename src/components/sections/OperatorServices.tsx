import type { Operator } from '@/content/types'
import { cn } from '@/lib/cn'
import { ExternalIcon } from '@/components/ui/icons'

/**
 * Пополнение, баланс и всё остальное «после покупки».
 *
 * Ничего из этого мы не делаем сами: карту обслуживает оператор, поэтому
 * ведём прямо к нему. Цифры и адреса намеренно не копируем — они меняются на
 * стороне оператора, и копия быстро станет враньём.
 */
export function OperatorServices({
  operator,
  className,
}: {
  operator: Operator
  className?: string
}) {
  const services = operator.services ?? []
  if (services.length === 0) return null

  return (
    <div className={cn('grid gap-4', className)}>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <li key={service.href}>
            <a
              href={service.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col rounded-card bg-white p-5 ring-1 ring-line transition hover:ring-line-strong"
            >
              <span className="flex items-start justify-between gap-3">
                <span className="font-semibold text-ink">{service.label}</span>
                <ExternalIcon className="mt-0.5 size-4 shrink-0 text-ink-muted transition-colors group-hover:text-brand-magenta" />
              </span>
              <span className="mt-1.5 text-sm leading-relaxed text-ink-muted text-pretty">
                {service.note}
              </span>
            </a>
          </li>
        ))}
      </ul>

      {operator.support && (
        <p className="text-sm text-ink-muted text-pretty">
          Вопросы по тарифам, балансу и блокировке — в поддержку оператора:{' '}
          <a
            href={`tel:${operator.support.phoneHref}`}
            className="font-semibold text-brand-magenta transition-colors hover:text-brand-orange"
          >
            {operator.support.phone}
          </a>{' '}
          ·{' '}
          <a
            href={`mailto:${operator.support.email}`}
            className="font-semibold text-brand-magenta transition-colors hover:text-brand-orange"
          >
            {operator.support.email}
          </a>
        </p>
      )}
    </div>
  )
}
