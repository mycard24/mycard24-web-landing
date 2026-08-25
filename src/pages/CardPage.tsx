import { useParams } from 'react-router'
import { getRegionCard } from '@/content/regions'
import { site } from '@/content/site'
import type { Region, RegionCard } from '@/content/types'
import { formatPrice } from '@/lib/format'
import type { PageHead } from '@/lib/seo'
import { CardArt } from '@/components/cards/CardArt'
import { CoverageSection } from '@/components/sections/CoverageSection'
import { CtaBand } from '@/components/sections/CtaBand'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { OperatorCard } from '@/components/sections/OperatorCard'
import { TransportModes } from '@/components/sections/TransportModes'
import { Badge } from '@/components/ui/Badge'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { FaqJsonLd, FaqList } from '@/components/ui/Faq'
import { Section } from '@/components/ui/Section'
import { ArrowRightIcon, CheckIcon, featureIcons } from '@/components/ui/icons'
import NotFoundPage from './NotFoundPage'

export function head(region: Region, card: RegionCard): PageHead {
  return {
    path: `/${region.slug}/${card.slug}`,
    title: `${card.name} — ${region.name}`,
    description:
      card.status === 'available'
        ? `${card.description} Стоимость карты ${card.price} ₽, доставка от ${card.deliveryFrom} ₽.`
        : `${card.name} ${region.locative} — готовим запуск.`,
    priority: card.status === 'available' ? 0.9 : 0.3,
  }
}

export default function CardPage() {
  const { region: regionSlug, card: cardSlug } = useParams<{ region: string; card: string }>()
  const found = regionSlug && cardSlug ? getRegionCard(regionSlug, cardSlug) : undefined
  if (!found) return <NotFoundPage />

  const { region, card } = found
  const isAvailable = card.status === 'available'

  const productJsonLd = isAvailable
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: card.name,
        description: card.description,
        brand: { '@type': 'Brand', name: card.art.title },
        offers: {
          '@type': 'Offer',
          price: card.price,
          priceCurrency: 'RUB',
          availability: 'https://schema.org/InStock',
          url: `${site.url}/${region.slug}/${card.slug}`,
          seller: { '@type': 'Organization', name: site.name },
        },
      }
    : null

  return (
    <>
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}

      <section className="bg-surface-soft py-8 sm:py-10">
        <Container>
          <Breadcrumbs
            items={[
              { href: '/', label: 'Главная' },
              { href: `/${region.slug}`, label: region.name },
              { label: card.shortName },
            ]}
          />

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
            <div>
              <Badge tone={isAvailable ? 'available' : 'soon'}>
                {isAvailable ? 'Карта доступна' : 'Скоро'}
              </Badge>
              <h1 className="mt-4 text-[2rem] leading-tight font-bold tracking-tight text-balance sm:text-4xl">
                {card.name}
              </h1>
              <p className="mt-3 text-lg font-medium text-gradient-brand">{card.tagline}</p>

              {card.highlights.length > 0 && (
                <ul className="mt-6 grid gap-2.5">
                  {card.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[0.975rem] text-ink-soft">
                      <CheckIcon className="mt-0.5 size-5 shrink-0 text-available" />
                      <span className="text-pretty">{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {isAvailable && (
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <div>
                    <p className="text-3xl font-bold text-ink">
                      {card.price !== undefined ? formatPrice(card.price) : '—'}
                    </p>
                    <p className="mt-1 text-sm text-ink-muted">
                      стоимость карты, доставка от {card.deliveryFrom} ₽
                    </p>
                  </div>
                  <Button href="/contacts" size="lg">
                    Написать нам
                    <ArrowRightIcon className="size-5" />
                  </Button>
                </div>
              )}
            </div>

            <div className="mx-auto w-full max-w-[400px]">
              <CardArt art={card.art} priority />
            </div>
          </div>
        </Container>
      </section>

      {card.benefits && card.benefits.length > 0 && (
        <Section title={`Почему выбирают карту ${card.art.title}`}>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {card.benefits.map((benefit) => {
              const Icon = featureIcons[benefit.icon]
              return (
                <li key={benefit.title} className="rounded-card bg-white p-5 ring-1 ring-line">
                  <span className="grid size-11 place-items-center rounded-xl bg-surface-soft text-brand-magenta">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-semibold text-ink">{benefit.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-muted text-pretty">
                    {benefit.description}
                  </p>
                </li>
              )
            })}
          </ul>
        </Section>
      )}

      {card.coverage && (
        <Section
          title="Где действует карта"
          description={`Городские и пригородные маршруты ${region.locative}.`}
        >
          <CoverageSection card={card} />
        </Section>
      )}

      {card.transportModes && card.transportModes.length > 0 && (
        <Section
          muted
          title="Карта работает в"
          description="Перечень видов транспорта определяет оператор карты."
        >
          <TransportModes modes={card.transportModes} />
        </Section>
      )}

      <Section title="Как это работает">
        <HowItWorks />
      </Section>

      {card.operator && (
        <Section muted title="Оператор карты">
          <OperatorCard operator={card.operator} />
        </Section>
      )}

      {card.faq && card.faq.length > 0 && (
        <Section muted title="Ответы на частые вопросы">
          <FaqList items={card.faq} className="mx-auto max-w-3xl" />
          <FaqJsonLd items={card.faq} />
        </Section>
      )}

      <CtaBand
        title="Остались вопросы?"
        description="Напишите нам — поможем выбрать способ доставки, подскажем по тарифам и статусу заказа."
        action={{ href: '/contacts', label: 'Написать в поддержку' }}
        secondary={{ href: `/${region.slug}`, label: `Все карты — ${region.shortName}` }}
      />
    </>
  )
}
