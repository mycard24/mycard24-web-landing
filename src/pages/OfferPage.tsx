import { legal, site } from '@/content/site'
import type { PageHead } from '@/lib/seo'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'

export const head: PageHead = {
  path: '/offer',
  title: 'Публичная оферта',
  description: `Условия оказания услуг сервиса ${site.name}.`,
  index: false,
  priority: 0,
}

/**
 * Заглушка. В оферте нужно зафиксировать: предмет (агентские услуги по приёму
 * заявок и доставке, а не выпуск карт), стоимость карты и доставки, сроки,
 * порядок возврата и то, что эмитентом карты остаётся оператор региона.
 */
export default function OfferPage() {
  return (
    <>
      <section className="bg-surface-soft py-8 sm:py-12">
        <Container>
          <Breadcrumbs items={[{ href: '/', label: 'Главная' }, { label: 'Оферта' }]} />
          <h1 className="mt-6 text-[1.85rem] leading-tight font-bold tracking-tight text-balance sm:text-4xl">
            Публичная оферта
          </h1>
        </Container>
      </section>

      <Section>
        <div className="mx-auto max-w-3xl rounded-card bg-surface-soft p-6 ring-1 ring-line sm:p-8">
          <p className="font-semibold text-ink">Документ готовится</p>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-muted text-pretty">
            До запуска приёма заявок здесь должен появиться текст оферты. В нём необходимо
            зафиксировать предмет договора (приём заявок и доставка, а не выпуск карт),
            стоимость карты и доставки, сроки, порядок возврата и то, что эмитентом карты
            остаётся её оператор в регионе.
          </p>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-muted text-pretty">
            Оферту публикует {legal.name}, ИНН {legal.inn}, ОГРНИП {legal.ogrnip}.
          </p>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-muted text-pretty">
            Вопросы по условиям —{' '}
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
