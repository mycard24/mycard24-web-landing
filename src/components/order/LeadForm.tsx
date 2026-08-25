import { useMemo, useState } from 'react'
import { AppLink } from '@/components/ui/AppLink'
import { enabledDeliveryOptions } from '@/content/delivery'
import type { RegionCard } from '@/content/types'
import { cn } from '@/lib/cn'
import { formatPrice } from '@/lib/format'
import { Button } from '@/components/ui/Button'
import { CheckIcon } from '@/components/ui/icons'

type Status = 'idle' | 'sending' | 'sent' | 'error' | 'unconfigured'

const ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT

const field =
  'h-12 w-full rounded-xl bg-white px-4 text-[0.95rem] text-ink ring-1 ring-line-strong ' +
  'transition placeholder:text-ink-muted/70 focus:ring-2 focus:ring-brand-magenta focus:outline-none'

/**
 * Заявка на оформление карты.
 *
 * Онлайн-оплаты на этом этапе нет: форма собирает контакт и адрес, дальше
 * заказ ведётся вручную по агентскому договору. Куда отправлять заявку —
 * задаётся переменной VITE_LEAD_ENDPOINT (CRM, Telegram-бот, e-mail-релей).
 * Пока она не задана, форма честно сообщает, что не подключена, и не
 * показывает ложный экран «заявка принята».
 */
export function LeadForm({
  card,
  regionName,
  className,
}: {
  card: RegionCard
  regionName: string
  className?: string
}) {
  const [status, setStatus] = useState<Status>('idle')
  const [deliveryId, setDeliveryId] = useState(enabledDeliveryOptions[0]?.id ?? '')

  const delivery = enabledDeliveryOptions.find((option) => option.id === deliveryId)
  const total = useMemo(
    () => (card.price ?? 0) + (delivery?.priceFrom ?? 0),
    [card.price, delivery],
  )

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const payload = {
      region: regionName,
      card: card.name,
      delivery: delivery?.name,
      ...Object.fromEntries(new FormData(form).entries()),
    }

    if (!ENDPOINT) {
      console.info('[LeadForm] VITE_LEAD_ENDPOINT не задан. Заявка:', payload)
      setStatus('unconfigured')
      return
    }

    setStatus('sending')
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      setStatus(response.ok ? 'sent' : 'error')
      if (response.ok) form.reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div
        className={cn('rounded-card bg-white p-8 text-center ring-1 ring-line', className)}
        role="status"
      >
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-available-soft text-available">
          <CheckIcon className="size-7" />
        </span>
        <h3 className="mt-5 text-xl font-bold text-ink">Заявка принята</h3>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-muted text-pretty">
          Мы свяжемся с вами для подтверждения заказа и оплаты. Трек-номер придёт на указанную
          почту после передачи карты в доставку.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn('rounded-card bg-white p-6 ring-1 ring-line sm:p-8', className)}
      noValidate={false}
    >
      <h3 className="text-xl font-bold text-ink">Оформление карты</h3>
      <p className="mt-2 text-sm text-ink-muted">
        {card.name} · {regionName}
      </p>

      <fieldset className="mt-6">
        <legend className="text-sm font-semibold text-ink">Способ доставки</legend>
        <div className="mt-3 grid gap-2.5">
          {enabledDeliveryOptions.map((option) => (
            <label
              key={option.id}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 ring-1 transition',
                deliveryId === option.id
                  ? 'bg-surface-soft ring-2 ring-brand-magenta'
                  : 'ring-line-strong hover:bg-surface-soft',
              )}
            >
              <input
                type="radio"
                name="deliveryId"
                value={option.id}
                checked={deliveryId === option.id}
                onChange={() => setDeliveryId(option.id)}
                className="size-4 accent-[#ec1e79]"
              />
              <span className="flex-1">
                <span className="block text-[0.95rem] font-medium text-ink">{option.name}</span>
                <span className="block text-xs text-ink-muted">
                  {option.days}, от {option.priceFrom} ₽
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 grid gap-3">
        <label className="grid gap-1.5">
          <span className="text-sm font-medium text-ink-soft">ФИО получателя</span>
          <input name="fullName" required autoComplete="name" placeholder="Иванов Иван Иванович" className={field} />
        </label>
        <label className="grid gap-1.5">
          <span className="text-sm font-medium text-ink-soft">Телефон</span>
          <input
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="+7 (999) 123-45-67"
            className={field}
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-sm font-medium text-ink-soft">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="example@mail.ru"
            className={field}
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-sm font-medium text-ink-soft">Адрес доставки</span>
          <input
            name="address"
            required
            autoComplete="street-address"
            placeholder="450000, г. Уфа, ул. Ленина, д. 1, кв. 10"
            className={field}
          />
        </label>
      </div>

      <dl className="mt-6 space-y-2 rounded-xl bg-surface-soft p-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-ink-muted">Карта</dt>
          <dd className="font-medium text-ink">
            {card.price !== undefined ? formatPrice(card.price) : '—'}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-muted">Доставка</dt>
          <dd className="font-medium text-ink">
            от {delivery ? formatPrice(delivery.priceFrom) : '—'}
          </dd>
        </div>
        <div className="flex justify-between border-t border-line pt-2">
          <dt className="font-semibold text-ink">Итого</dt>
          <dd className="font-bold text-ink">от {formatPrice(total)}</dd>
        </div>
      </dl>

      <label className="mt-5 flex items-start gap-3 text-sm text-ink-muted">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 size-4 shrink-0 accent-[#ec1e79]"
        />
        <span className="text-pretty">
          Я согласен с{' '}
          <AppLink href="/privacy" className="font-medium text-brand-magenta hover:underline">
            политикой обработки персональных данных
          </AppLink>{' '}
          и{' '}
          <AppLink href="/offer" className="font-medium text-brand-magenta hover:underline">
            условиями оферты
          </AppLink>
        </span>
      </label>

      <Button size="lg" className="mt-6 w-full" disabled={status === 'sending'}>
        {status === 'sending' ? 'Отправляем…' : 'Отправить заявку'}
      </Button>

      {status === 'error' && (
        <p role="alert" className="mt-4 text-sm text-brand-magenta">
          Не удалось отправить заявку. Попробуйте ещё раз или напишите нам — контакты в подвале
          сайта.
        </p>
      )}

      {status === 'unconfigured' && (
        <p role="alert" className="mt-4 rounded-xl bg-surface-soft p-4 text-sm text-ink-muted">
          Форма пока не подключена к приёму заявок: задайте{' '}
          <code className="rounded bg-white px-1.5 py-0.5 text-xs ring-1 ring-line">
            VITE_LEAD_ENDPOINT
          </code>{' '}
          в окружении. Данные заявки выведены в консоль браузера.
        </p>
      )}
    </form>
  )
}
