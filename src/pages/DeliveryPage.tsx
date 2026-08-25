import { deliveryOptions } from '@/content/delivery'
import type { PageHead } from '@/lib/seo'
import { CtaBand } from '@/components/sections/CtaBand'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { Badge } from '@/components/ui/Badge'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'

export const head: PageHead = {
  title: 'Доставка',
  description:
    'Способы доставки региональных карт: Почта России, 5Post, СДЭК и пункты выдачи. Сроки и стоимость доставки по России.',
  path: '/delivery',
}

export default function DeliveryPage() {
  return (
    <>
      <section className="bg-surface-soft py-8 sm:py-12">
        <Container>
          <Breadcrumbs items={[{ href: '/', label: 'Главная' }, { label: 'Доставка' }]} />
          <h1 className="mt-6 text-[2rem] leading-tight font-bold tracking-tight text-balance sm:text-4xl">
            Доставка
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-muted text-pretty">
            Карту привозим в любой город России. Способ доставки вы выбираете при оформлении
            заявки — стоимость и срок видны сразу.
          </p>
        </Container>
      </section>

      <Section title="Способы доставки">
        <ul className="grid gap-4 sm:grid-cols-2">
          {deliveryOptions.map((option) => (
            <li
              key={option.id}
              className="flex flex-col rounded-card bg-white p-6 ring-1 ring-line"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-lg font-semibold text-ink">{option.name}</h2>
                <Badge tone={option.enabled ? 'available' : 'soon'}>
                  {option.enabled ? 'Доступна' : 'Скоро'}
                </Badge>
              </div>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted text-pretty">
                {option.hint}
              </p>
              <div className="mt-5 flex items-baseline gap-2 border-t border-line pt-4">
                <span className="text-xl font-bold text-ink">от {option.priceFrom} ₽</span>
                <span className="text-sm text-ink-muted">· {option.days}</span>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-ink-muted">
          Стоимость и сроки указаны ориентировочно и зависят от адреса получателя. Точную сумму
          вы увидите при оформлении заявки.
        </p>
      </Section>

      <Section muted title="Как проходит заказ">
        <HowItWorks />
      </Section>

      <CtaBand
        title="Готовы оформить карту?"
        description="Выберите регион и способ доставки — остальное сделаем мы."
        action={{ href: '/regions', label: 'Выбрать регион' }}
      />
    </>
  )
}
