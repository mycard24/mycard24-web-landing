/**
 * Контентная модель платформы.
 *
 * Правило: страницы ничего не знают про конкретные регионы и карты — они
 * рендерят то, что описано здесь. Запуск нового субъекта РФ = новая запись
 * в `regions.ts` (+ картинка в /public/regions). Кода трогать не нужно.
 */

import type { CityKey } from './cities'

export type Availability = 'available' | 'soon'

/** Типы карт платформы. Слаг попадает в URL: /bashkortostan/transport */
export type CardTypeSlug = 'transport'

export interface FaqItem {
  question: string
  answer: string
}

export interface Operator {
  /** Юридическое наименование оператора карты */
  name: string
  /** Короткое имя для подписей */
  shortName: string
  description: string
  website: string
  websiteLabel: string
  /**
   * Знак оператора для блока атрибуции. Чужой товарный знак: показываем только
   * в блоке «Оператор карты», без изменений пропорций и цвета.
   */
  logo?: { src: string; alt: string; aspect: number }
  /** Служба поддержки оператора — по вопросам тарифов, баланса и блокировки */
  support?: { phone: string; phoneHref: string; email: string }
  /** Разделы сайта оператора, куда мы отправляем за первоисточником */
  services?: { label: string; note: string; href: string }[]
}

/**
 * Описание лицевой стороны карты для компонента <CardArt />.
 *
 * Это стилизованная реконструкция, а не официальный макет оператора.
 * Когда получите от оператора разрешение и исходники — добавьте `image`,
 * и CardArt отрисует настоящий рендер вместо векторной стилизации.
 */
export interface CardArt {
  /** 'brand' — обезличенная карта МояКарта24, 'regional' — карта региона */
  variant: 'brand' | 'regional'
  title: string
  subtitle?: string
  caption?: string
  /** Основной цвет пластика */
  base: string
  /** Цвет нижней плашки / акцента */
  accent: string
  /** Цвет текста на пластике */
  ink: string
  /** Официальный рендер карты, если он согласован с оператором */
  image?: { src: string; alt: string }
}

export interface TransportMode {
  label: string
  icon: 'bus' | 'trolleybus' | 'tram' | 'minibus' | 'metro' | 'train'
}

export interface Benefit {
  title: string
  description: string
  icon: 'wallet' | 'shield' | 'clock' | 'users' | 'card' | 'truck'
}

/** Конкретный продукт (карта) внутри региона */
export interface RegionCard {
  slug: CardTypeSlug
  /** Полное имя: «Транспортная карта АЛГА» */
  name: string
  /** Короткое имя для плиток: «Транспортная карта» */
  shortName: string
  tagline: string
  description: string
  status: Availability
  /** Стоимость самой карты, ₽ */
  price?: number
  /** Минимальная стоимость доставки, ₽ */
  deliveryFrom?: number
  highlights: string[]
  art: CardArt
  benefits?: Benefit[]
  transportModes?: TransportMode[]
  operator?: Operator
  faq?: FaqItem[]
  /**
   * География карты. Данные оператора и потому строго покарточные: у каждого
   * региона свой оператор и свой перечень маршрутов — переносить этот список
   * на другие карты нельзя.
   */
  coverage?: {
    /** Города с городскими маршрутами */
    city: string[]
    /** Города, из которых идут пригородные маршруты */
    suburban: string[]
    /** Страница оператора с полным перечнем маршрутов и перевозчиков */
    source: string
  }
}

export interface Region {
  /** Слаг латиницей: /bashkortostan */
  slug: string
  /** «Республика Башкортостан» */
  name: string
  /** «Башкортостан» — для компактных мест */
  shortName: string
  /** «в Республике Башкортостан» */
  locative: string
  status: Availability
  summary: string
  /**
   * Вопросы про транспортную систему региона в целом: какая карта действует,
   * в каких городах, куда идти за тарифами. Продуктовые вопросы — у карты
   * (RegionCard.faq), вопросы про сам сервис — в generalFaq.
   */
  faq?: FaqItem[]
  /**
   * Достопримечательность для карточки региона. Необязательна: у регионов со
   * статусом «скоро» карточка рисуется нейтральной, без снимка.
   */
  landmark?: {
    /** Фолбэк-изображение: показывается, если срабатывает не srcSet */
    src: string
    /**
     * Заранее подготовленные варианты в webp: '/path-640.webp 640w, ...'.
     * У векторных заглушек их нет — там достаточно одного src.
     */
    srcSet?: string
    alt: string
    /** Подпись, если захотите показывать её на карточке */
    caption: string
    /**
     * Приближение кадра в карточке региона. По умолчанию 1.4 — столько нужно
     * стилизованным иллюстрациям 4:3. Для широких или вертикальных фотографий
     * значение уменьшают, иначе объект не помещается в кадр.
     */
    zoom?: number
  }
  /**
   * Привязка к карте героя. Геометрия не хранится в контенте: контур, центр и
   * габариты субъекта берутся из сгенерированного
   * `src/components/hero/russia-map-data.ts` по `subjectId`.
   */
  map: {
    /** Латинское имя субъекта в Natural Earth: 'Bashkortostan', 'Moskva', … */
    subjectId: string
    /** Административный центр — отмечается точкой на карте */
    capital?: CityKey
    /**
     * Флаг субъекта — подложка под заливку выделенного региона на карте.
     * `aspect` (ширина / высота) нужен, чтобы вписать флаг «по обрезке»:
     * вложенный SVG масштабирует свой viewBox сам и внешний
     * preserveAspectRatio="slice" на него не действует.
     */
    flag?: { src: string; aspect: number }
  }
  cards: RegionCard[]
}
