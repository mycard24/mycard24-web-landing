import { useParams } from 'react-router'
import { generalFaq } from '@/content/faq'
import { getRegion } from '@/content/regions'
import type { Region } from '@/content/types'
import type { PageHead } from '@/lib/seo'
import { RegionCardTile } from '@/components/cards/RegionCardTile'
import { CoverageSection } from '@/components/sections/CoverageSection'
import { CtaBand } from '@/components/sections/CtaBand'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { OperatorCard } from '@/components/sections/OperatorCard'
import { OperatorServices } from '@/components/sections/OperatorServices'
import { Badge } from '@/components/ui/Badge'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Container } from '@/components/ui/Container'
import { FaqJsonLd, FaqList } from '@/components/ui/Faq'
import { LandmarkImage } from '@/components/ui/LandmarkImage'
import { Section } from '@/components/ui/Section'
import NotFoundPage from './NotFoundPage'

export function head(region: Region): PageHead {
  return {
    path: `/${region.slug}`,
    title: `Транспортная карта — ${region.name}`,
    description: `Оформите транспортную карту ${region.locative} онлайн. Заявка за 5 минут, доставка Почтой России, СДЭК или 5Post — без визита в офис.`,
    priority: 0.9,
  }
}

export default function RegionPage() {
  const { region: slug } = useParams<{ region: string }>()
  const region = slug ? getRegion(slug) : undefined
  // Страницы есть только у запущенных регионов: у остальных нечего показывать,
  // кроме статуса «скоро», и он уже виден в списке регионов на главной.
  if (!region || region.status !== 'available') return <NotFoundPage />

  const availableCard = region.cards.find((card) => card.status === 'available')
  const operator = availableCard?.operator
  // На странице региона — вопросы про регион; продуктовые живут на карточке
  const faq = region.faq ?? availableCard?.faq ?? generalFaq

  return (
    <>
      {/* Шапка региона с достопримечательностью */}
      <section className="relative isolate overflow-hidden">
        {region.landmark && (
          <div className="absolute inset-0 -z-10">
            <LandmarkImage
              landmark={region.landmark}
              sizes="100vw"
              priority
              className="size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/35" />
          </div>
        )}

        <Container>
          <div className="py-8 sm:py-10">
            <Breadcrumbs
              items={[{ href: '/', label: 'Главная' }, { label: region.name }]}
            />

            <div className="mt-6 max-w-2xl">
              <Badge tone={region.status === 'available' ? 'available' : 'soon'}>
                {region.status === 'available' ? 'Карта доступна' : 'Скоро'}
              </Badge>
              <h1 className="mt-4 text-[2rem] leading-tight font-bold tracking-tight text-balance sm:text-4xl">
                {region.name}
              </h1>
              <p className="mt-4 text-lg text-ink-muted text-pretty">
                {availableCard
                  ? `Транспортная карта «${availableCard.art.title}» — с доставкой по всей России.`
                  : `Сервис ещё не запущен ${region.locative}. Мы сообщим, как только оформление станет доступно.`}
              </p>
              {region.landmark && (
                <p className="mt-3 text-sm text-ink-muted">{region.landmark.caption}</p>
              )}
            </div>
          </div>
        </Container>
      </section>

      <Section title="Карты региона">
        {region.cards.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {region.cards.map((card) => (
              <RegionCardTile key={card.slug} region={region} card={card} />
            ))}
          </div>
        ) : (
          <div className="rounded-card bg-surface-soft p-8 text-center ring-1 ring-line">
            <h2 className="text-lg font-semibold text-ink">
              Готовим запуск {region.locative}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[0.95rem] leading-relaxed text-ink-muted text-pretty">
              Мы ведём переговоры с оператором транспортной карты. Напишите нам, если хотите
              узнать о запуске первыми — учитываем спрос при выборе следующих регионов.
            </p>
          </div>
        )}
      </Section>

      {availableCard?.coverage && (
        <Section
          muted
          title="Где действует карта"
          description={`Городские и пригородные маршруты ${region.locative}.`}
        >
          <CoverageSection card={availableCard} />
        </Section>
      )}

      {operator?.services && operator.services.length > 0 && (
        <Section
          title="Пополнение, баланс и обслуживание"
          description="Картой распоряжается её оператор — ниже прямые ссылки на его сервисы."
        >
          <OperatorServices operator={operator} />
        </Section>
      )}

      {operator && (
        <Section muted title="Оператор карты">
          <OperatorCard operator={operator} />
        </Section>
      )}

      <Section title="Как это работает">
        <HowItWorks />
      </Section>

      <Section muted title="Ответы на частые вопросы">
        <FaqList items={faq} className="mx-auto max-w-3xl" />
        <FaqJsonLd items={faq} />
      </Section>

      <CtaBand
        title={
          availableCard
            ? `Транспортная карта ${region.locative}`
            : 'Выберите другой регион'
        }
        description={
          availableCard
            ? 'Карту выпускает официальный оператор региона, а мы доставляем её по всей России.'
            : 'Пока сервис работает не во всех регионах. Посмотрите, где оформление уже доступно.'
        }
        action={
          availableCard
            ? { href: `/${region.slug}/${availableCard.slug}`, label: 'Смотреть карту' }
            : { href: '/regions', label: 'Все регионы' }
        }
        secondary={{ href: '/delivery', label: 'Способы доставки' }}
      />
    </>
  )
}
