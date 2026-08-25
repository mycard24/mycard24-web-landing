import { useRef, useState } from 'react'
import { availableRegions } from '@/content/regions'
import type { Region } from '@/content/types'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { ArrowRightIcon, CheckIcon } from '@/components/ui/icons'
import { HeroMap } from './HeroMap'
import { HeroPanels } from './HeroPanels'
import { RegionSelect } from './RegionSelect'
import { useContainerAspect, useMapFrame } from './useMapFrame'

const promises = [
  'Без очередей и визитов в офис',
  'Доставка Почтой, СДЭК и 5Post',
  'Официальные операторы регионов',
]

/**
 * Герой главной страницы.
 *
 * Единственное состояние — выбранный регион: им управляются и карта, и панели.
 * По умолчанию выбран первый запущенный регион, чтобы первый экран сразу
 * показывал живой продукт, а не пустую заготовку.
 *
 * Карта лежит подложкой во всю секцию (см. HeroMap), поверх неё — текст слева и
 * панели справа. overflow-x-clip держит свечение карты внутри страницы, но не
 * режет по вертикали: иначе секция срезала бы выпадающий список регионов.
 */
export function Hero({ regions }: { regions: Region[] }) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    availableRegions[0]?.slug ?? null,
  )
  const selected = regions.find((region) => region.slug === selectedSlug) ?? null
  const launched = selected?.status === 'available' ? selected : null

  const mapRef = useRef<HTMLDivElement>(null)
  const aspect = useContainerAspect(mapRef)
  const frame = useMapFrame(selected, aspect)

  return (
    // Отрицательный отступ заводит секцию под липкую шапку: карта продолжается
    // за ней, а внутренний padding возвращает содержимому исходное положение.
    // Высоты обязаны совпадать с h-12/sm:h-14 в SiteHeader.
    //
    // isolate держит карту с -z-10 внутри секции, но он же запирает в ней
    // выпадающий список регионов — и следующая секция, которая идёт ниже по
    // DOM, накрывала его. Поэтому у секции есть z-10: она встаёт над соседями,
    // оставаясь под шапкой (z-50).
    <section className="relative isolate z-10 -mt-12 overflow-x-clip pt-18 pb-8 sm:-mt-14 sm:pt-22 sm:pb-10">
      <HeroMap
        containerRef={mapRef}
        regions={regions}
        selected={selected}
        frame={frame}
        aspect={aspect}
      />

      <Container>
        <div className="grid items-center gap-10 lg:min-h-[30rem] lg:grid-cols-[minmax(0,32rem)_minmax(0,1fr)] lg:gap-14">
          <div className="max-w-xl">
            <h1 className="text-[2.1rem] leading-[1.08] font-bold tracking-tight text-balance sm:text-5xl">
              Единая платформа{' '}
              <span className="text-gradient-brand">региональных карт</span> России
            </h1>

            <p className="mt-4 text-lg leading-relaxed text-ink-muted text-pretty">
              Оформляйте транспортные карты регионов онлайн — без очередей и лишних визитов.
            </p>

            <div className="mt-7 flex max-w-md flex-col gap-3">
              <RegionSelect regions={regions} value={selectedSlug} onChange={setSelectedSlug} />
              {/* У региона «скоро» страницы нет — ведём туда, где можно оставить
                  обращение, а не на 404 */}
              <Button href={launched ? `/${launched.slug}` : '/contacts'} size="lg">
                {launched ? `Найти карты — ${launched.shortName}` : 'Сообщить о запуске'}
                <ArrowRightIcon className="size-5" />
              </Button>
            </div>

            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {promises.map((promise) => (
                <li key={promise} className="flex items-center gap-2 text-sm text-ink-soft">
                  <CheckIcon className="size-4 text-available" />
                  {promise}
                </li>
              ))}
            </ul>
          </div>

          <HeroPanels selected={selected} />
        </div>
      </Container>
    </section>
  )
}
