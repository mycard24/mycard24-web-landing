import { legal, site } from '@/content/site'
import type { PageHead } from '@/lib/seo'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'

export const head: PageHead = {
  path: '/privacy',
  title: 'Политика обработки персональных данных',
  description: `Политика обработки персональных данных сервиса ${site.name}.`,
  index: false,
  priority: 0,
}

/**
 * Заглушка. Текст политики должен подготовить юрист под 152-ФЗ: сервис
 * собирает ФИО, телефон, e-mail и адрес доставки, то есть является оператором
 * персональных данных и обязан уведомить Роскомнадзор.
 */
export default function PrivacyPage() {
  return (
    <>
      <section className="bg-surface-soft py-8 sm:py-12">
        <Container>
          <Breadcrumbs
            items={[{ href: '/', label: 'Главная' }, { label: 'Политика конфиденциальности' }]}
          />
          <h1 className="mt-6 max-w-3xl text-[1.85rem] leading-tight font-bold tracking-tight text-balance sm:text-4xl">
            Политика обработки персональных данных
          </h1>
        </Container>
      </section>

      <Section>
        <div className="mx-auto max-w-3xl rounded-card bg-surface-soft p-6 ring-1 ring-line sm:p-8">
          <p className="font-semibold text-ink">Документ готовится</p>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-muted text-pretty">
            Сервис собирает ФИО, телефон, электронную почту и адрес доставки, то есть выступает
            оператором персональных данных по 152-ФЗ. Оператор — {legal.name} (ИНН {legal.inn}),
            запись в реестре Роскомнадзора{' '}
            <a
              href={legal.pdOperator.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-magenta hover:underline"
            >
              № {legal.pdOperator.number}
            </a>
            .
          </p>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-muted text-pretty">
            До запуска приёма заявок здесь должен появиться текст политики, подготовленный
            юристом: цели и правовые основания обработки, перечень данных, сроки хранения,
            порядок отзыва согласия и передача данных операторам карт и службам доставки.
          </p>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-muted text-pretty">
            По вопросам обработки данных пишите на{' '}
            <a href={`mailto:${site.email}`} className="font-medium text-brand-magenta hover:underline">
              {site.email}
            </a>
            .
          </p>
        </div>
      </Section>
    </>
  )
}
