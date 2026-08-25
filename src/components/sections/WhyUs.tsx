import { cn } from '@/lib/cn'
import { CheckIcon, CloseIcon } from '@/components/ui/icons'

/**
 * Ответ на главный незаданный вопрос: зачем заказывать через нас, если карту
 * продают в пунктах оператора.
 *
 * Сравнение честное: там, где у пункта продаж есть преимущество (получить
 * сегодня же), мы так и пишем. Иначе таблица читается как реклама и не
 * работает.
 */
const rows = [
  {
    title: 'Где оформить',
    us: 'Из любого города России',
    them: 'Только в пункте продаж внутри региона',
    usWins: true,
  },
  {
    title: 'Очередь и визит',
    us: 'Не нужны',
    them: 'Личный визит в часы работы пункта',
    usWins: true,
  },
  {
    title: 'Как получить',
    us: 'Доставка Почтой, СДЭК или 5Post',
    them: 'На руки сразу при покупке',
    usWins: false,
  },
  {
    title: 'Кто выпускает карту',
    us: 'Официальный оператор региона',
    them: 'Официальный оператор региона',
    usWins: false,
  },
]

export function WhyUs({ className }: { className?: string }) {
  return (
    <div className={cn('overflow-hidden rounded-card bg-white ring-1 ring-line', className)}>
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">
          Сравнение оформления через МояКарта24 и в пункте продаж оператора
        </caption>
        <thead>
          <tr className="border-b border-line bg-surface-soft">
            <th scope="col" className="px-5 py-3.5 font-semibold text-ink-muted">
              &nbsp;
            </th>
            <th scope="col" className="px-5 py-3.5 font-semibold text-ink">
              Через МояКарта24
            </th>
            <th scope="col" className="px-5 py-3.5 font-semibold text-ink-muted">
              В пункте продаж
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.title} className="border-b border-line last:border-0">
              <th scope="row" className="px-5 py-4 align-top font-medium text-ink">
                {row.title}
              </th>
              <td className="px-5 py-4 align-top">
                <span className="flex items-start gap-2 text-ink-soft">
                  {row.usWins && (
                    <CheckIcon
                      className="mt-0.5 size-4 shrink-0 text-available"
                      aria-hidden="true"
                    />
                  )}
                  <span className="text-pretty">{row.us}</span>
                </span>
              </td>
              <td className="px-5 py-4 align-top">
                <span className="flex items-start gap-2 text-ink-muted">
                  {row.usWins && (
                    <CloseIcon
                      className="mt-0.5 size-4 shrink-0 text-line-strong"
                      aria-hidden="true"
                    />
                  )}
                  <span className="text-pretty">{row.them}</span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
