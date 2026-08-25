import type { Operator } from '@/content/types'
import { ExternalIcon, ShieldIcon } from '@/components/ui/icons'

/**
 * Блок оператора карты.
 *
 * Обязателен на каждой странице регионального продукта: сервис принимает
 * заявки и доставляет карту, но эмитентом остаётся оператор. Явная атрибуция
 * снимает у пользователя ложное впечатление, что карту выпускает МояКарта24.
 */
export function OperatorCard({ operator }: { operator: Operator }) {
  return (
    <div className="rounded-card bg-surface-soft p-6 ring-1 ring-line sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-ink-muted">Оператор карты</p>
          <h3 className="mt-1.5 text-lg font-bold text-balance text-ink">{operator.name}</h3>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-muted text-pretty">
            {operator.description}
          </p>
          <a
            href={operator.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-magenta transition-colors hover:text-brand-orange"
          >
            Подробнее на сайте {operator.websiteLabel}
            <ExternalIcon className="size-4" />
          </a>
        </div>

        {operator.logo ? (
          <div className="grid h-20 shrink-0 place-items-center rounded-2xl bg-white px-5 ring-1 ring-line">
            <img
              src={operator.logo.src}
              alt={operator.logo.alt}
              width={Math.round(56 * operator.logo.aspect)}
              height={56}
              loading="lazy"
              decoding="async"
              className="h-14 w-auto"
            />
          </div>
        ) : (
          <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-white text-ink-muted ring-1 ring-line">
            <ShieldIcon className="size-7" />
          </div>
        )}
      </div>
    </div>
  )
}
