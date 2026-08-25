import { regions } from '@/content/regions'
import type { PageHead } from '@/lib/seo'
import { RegionList } from '@/components/regions/RegionList'
import { CtaBand } from '@/components/sections/CtaBand'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'

export const head: PageHead = {
  path: '/regions',
  title: 'Регионы',
  description:
    'Регионы, в которых можно оформить региональную карту онлайн. Сейчас доступна Республика Башкортостан, остальные субъекты подключаем по мере запуска.',
}

export default function RegionsPage() {
  const available = regions.filter((region) => region.status === 'available')
  const soon = regions.filter((region) => region.status !== 'available')

  return (
    <>
      <section className="bg-surface-soft py-8 sm:py-12">
        <Container>
          <Breadcrumbs items={[{ href: '/', label: 'Главная' }, { label: 'Регионы' }]} />
          <h1 className="mt-6 text-[2rem] leading-tight font-bold tracking-tight text-balance sm:text-4xl">
            Регионы
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-muted text-pretty">
            Платформа развивается по субъектам РФ: в каждом регионе — свои карты и свой
            оператор. Открывайте регион, чтобы увидеть, что уже доступно.
          </p>
        </Container>
      </section>

      <Section title="Карта уже доступна">
        <RegionList regions={available} />
      </Section>

      {soon.length > 0 && (
        <Section
          muted
          title="Готовим запуск"
          description="Ведём переговоры с операторами. Страницы регионов уже открыты — там можно оставить обращение."
        >
          <RegionList regions={soon} showSoonTile />
        </Section>
      )}

      <CtaBand
        title="Вашего региона ещё нет?"
        description="Напишите нам — мы учитываем спрос при выборе следующих субъектов для запуска."
        action={{ href: '/contacts', label: 'Написать нам' }}
      />
    </>
  )
}
