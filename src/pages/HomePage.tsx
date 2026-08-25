import { generalFaq } from '@/content/faq'
import { regions } from '@/content/regions'
import { site } from '@/content/site'
import type { PageHead } from '@/lib/seo'
import { Hero } from '@/components/hero/Hero'
import { RegionCarousel } from '@/components/regions/RegionCarousel'
import { CtaBand } from '@/components/sections/CtaBand'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { WhyUs } from '@/components/sections/WhyUs'
import { FaqJsonLd, FaqList } from '@/components/ui/Faq'
import { Section } from '@/components/ui/Section'

export const head: PageHead = {
  path: '/',
  description: site.description,
  priority: 1,
}

export default function HomePage() {
  return (
    <>
      <Hero regions={regions} />

      <Section
        tight
        title="Доступные регионы"
        action={{ href: '/regions', label: 'Все регионы' }}
      >
        <RegionCarousel regions={regions} />
      </Section>

      <Section
        muted
        title="Как это работает"
        description="Четыре шага от заявки до первой поездки."
      >
        <HowItWorks />
      </Section>

      <Section
        title="Зачем заказывать через нас"
        description="Карту можно купить и в пункте продаж оператора — если он есть в вашем городе."
      >
        <WhyUs />
      </Section>

      <Section title="Частые вопросы" action={{ href: '/faq', label: 'Все вопросы' }}>
        <FaqList items={generalFaq.slice(0, 5)} className="mx-auto max-w-3xl" />
        <FaqJsonLd items={generalFaq} />
      </Section>

      <CtaBand
        title="Оформите карту, не выходя из дома"
        description="Выберите регион и посмотрите условия: карту выпускает официальный оператор, а мы доставляем её по всей России."
        action={{ href: '/regions', label: 'Выбрать регион' }}
        secondary={{ href: '/delivery', label: 'Как устроена доставка' }}
      />
    </>
  )
}
