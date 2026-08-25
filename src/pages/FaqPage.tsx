import { generalFaq } from '@/content/faq'
import { regions } from '@/content/regions'
import type { PageHead } from '@/lib/seo'
import { CtaBand } from '@/components/sections/CtaBand'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Container } from '@/components/ui/Container'
import { FaqJsonLd, FaqList } from '@/components/ui/Faq'
import { Section } from '@/components/ui/Section'

export const head: PageHead = {
  title: 'Вопросы и ответы',
  description:
    'Как оформить региональную карту онлайн, сколько стоит доставка, что делать при утере карты и как отследить заказ.',
  path: '/faq',
}

export default function FaqPage() {
  // Три уровня: сервис → регион → конкретная карта
  const groups = regions.flatMap((region) => [
    ...(region.faq?.length
      ? [{ key: region.slug, title: `Транспортная карта — ${region.name}`, faq: region.faq }]
      : []),
    ...region.cards
      .filter((card) => card.faq?.length)
      .map((card) => ({
        key: `${region.slug}-${card.slug}`,
        title: `${card.name} — ${region.shortName}`,
        faq: card.faq ?? [],
      })),
  ])

  // Разметка FAQPage — одна на страницу, иначе поисковик видит несколько
  // конкурирующих блоков вместо одного списка вопросов
  const allFaq = [generalFaq, ...groups.map((group) => group.faq)].flat()

  return (
    <>
      <section className="bg-surface-soft py-8 sm:py-12">
        <Container>
          <Breadcrumbs items={[{ href: '/', label: 'Главная' }, { label: 'Вопросы' }]} />
          <h1 className="mt-6 text-[2rem] leading-tight font-bold tracking-tight text-balance sm:text-4xl">
            Вопросы и ответы
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-muted text-pretty">
            Всё о сервисе, оформлении и доставке. Не нашли ответ — напишите нам, добавим его
            сюда.
          </p>
        </Container>
      </section>

      <Section title="О сервисе">
        <FaqList items={generalFaq} className="mx-auto max-w-3xl" />
        <FaqJsonLd items={allFaq} />
      </Section>

      {groups.map(({ key, title, faq }, index) => (
        <Section key={key} muted={index % 2 === 0} title={title}>
          <FaqList items={faq} className="mx-auto max-w-3xl" />
        </Section>
      ))}

      <CtaBand
        title="Не нашли ответ?"
        description="Напишите нам — отвечаем в течение рабочего дня и помогаем на каждом этапе оформления."
        action={{ href: '/contacts', label: 'Задать вопрос' }}
      />
    </>
  )
}
