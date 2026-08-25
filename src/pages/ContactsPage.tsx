import { legal, site } from '@/content/site'
import type { PageHead } from '@/lib/seo'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'

export const head: PageHead = {
  title: 'Контакты',
  description: `Связаться с сервисом ${site.name}: почта, телефон и реквизиты.`,
  path: '/contacts',
}

export default function ContactsPage() {
  return (
    <>
      <section className="bg-surface-soft py-8 sm:py-12">
        <Container>
          <Breadcrumbs items={[{ href: '/', label: 'Главная' }, { label: 'Контакты' }]} />
          <h1 className="mt-6 text-[2rem] leading-tight font-bold tracking-tight text-balance sm:text-4xl">
            Контакты
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-muted text-pretty">
            Поможем с оформлением, доставкой и статусом заказа. Отвечаем в течение рабочего дня.
          </p>
        </Container>
      </section>

      <Section>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-card bg-white p-6 ring-1 ring-line">
            <h2 className="font-semibold text-ink">Почта</h2>
            <a
              href={`mailto:${site.email}`}
              className="mt-2 block text-lg font-medium text-brand-magenta hover:underline"
            >
              {site.email}
            </a>
            <p className="mt-3 text-sm text-ink-muted">
              Заявки, вопросы по заказу, сотрудничество.
            </p>
          </div>

          <div className="rounded-card bg-white p-6 ring-1 ring-line">
            <h2 className="font-semibold text-ink">Телефон</h2>
            <a
              href={`tel:${site.phoneHref}`}
              className="mt-2 block text-lg font-medium text-brand-magenta hover:underline"
            >
              {site.phone}
            </a>
            <p className="mt-3 text-sm text-ink-muted">Ежедневно, с 9:00 до 21:00 (МСК).</p>
          </div>
        </div>

        <div className="mt-4 rounded-card bg-surface-soft p-6 ring-1 ring-line">
          <h2 className="font-semibold text-ink">Реквизиты</h2>
          <dl className="mt-4 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-[max-content_minmax(0,1fr)]">
            <dt className="text-ink-muted">Исполнитель</dt>
            <dd className="font-medium text-ink">
              <a
                href={legal.site}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-magenta hover:underline"
              >
                {legal.name}
              </a>
            </dd>

            <dt className="text-ink-muted">ИНН</dt>
            <dd className="font-medium text-ink tabular-nums">{legal.inn}</dd>

            <dt className="text-ink-muted">ОГРНИП</dt>
            <dd className="font-medium text-ink tabular-nums">{legal.ogrnip}</dd>

            <dt className="text-ink-muted">ОКВЭД</dt>
            <dd className="text-ink text-pretty">
              <span className="font-medium tabular-nums">{legal.okved.code}</span>{' '}
              {legal.okved.title}
            </dd>

            <dt className="text-ink-muted">Оператор ПД</dt>
            <dd className="text-ink text-pretty">
              <a
                href={legal.pdOperator.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand-magenta hover:underline"
              >
                № {legal.pdOperator.number}
              </a>{' '}
              в реестре Роскомнадзора
            </dd>
          </dl>
        </div>
      </Section>
    </>
  )
}
