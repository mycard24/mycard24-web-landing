/**
 * Способы доставки. Цены и сроки — ориентировочные заготовки.
 * TODO: подставить реальные тарифы после подключения договоров со службами.
 */
export interface DeliveryOption {
  id: string
  name: string
  hint: string
  priceFrom: number
  days: string
  /** Показывать в форме заявки */
  enabled: boolean
}

export const deliveryOptions: DeliveryOption[] = [
  {
    id: 'post',
    name: 'Почта России',
    hint: 'Доставка до отделения по всей России',
    priceFrom: 100,
    days: '5–7 дней',
    enabled: true,
  },
  {
    id: '5post',
    name: '5Post (Пятёрочка)',
    hint: 'Постаматы и пункты выдачи в магазинах сети',
    priceFrom: 120,
    days: '2–5 дней',
    enabled: true,
  },
  {
    id: 'cdek',
    name: 'СДЭК',
    hint: 'Пункты выдачи и курьер до двери',
    priceFrom: 150,
    days: '2–4 дня',
    enabled: true,
  },
  {
    id: 'pickup',
    name: 'Пункт выдачи в вашем городе',
    hint: 'Boxberry, Ozon, Магнит — подключаем по мере запуска регионов',
    priceFrom: 150,
    days: '2–4 дня',
    enabled: false,
  },
]

export const enabledDeliveryOptions = deliveryOptions.filter((o) => o.enabled)
