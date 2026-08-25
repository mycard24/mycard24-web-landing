export const site = {
  name: 'МояКарта24',
  /** Боевой домен. Он же в public/CNAME — GitHub Pages читает привязку оттуда. */
  url: 'https://mycard24.ru',
  tagline: 'Единая платформа региональных карт России',
  description:
    'Оформляйте транспортные карты регионов онлайн. ' +
    'Выберите регион, подайте заявку и получите карту удобным способом доставки — без очередей и визитов в офис.',
  /**
   * Один публичный адрес на всё: заказы, вопросы, юридические запросы. Отдельные
   * support@ и pd@ заводить рано — обещать «поддержку» без тикет-системы и SLA
   * хуже, чем нейтральный info@. Когда появятся — это будут алиасы на тот же
   * ящик, а не замена: info@ уже уйдёт в оферту, политику и реестр РКН.
   */
  email: 'info@mycard24.ru',
  phone: '+7 927 938-35-62',
  phoneHref: '+79279383562',
} as const

/**
 * Реквизиты исполнителя. По 2300-1 «О защите прав потребителей» и правилам
 * дистанционной торговли их нужно показывать до оформления заказа, поэтому они
 * стоят в подвале на каждой странице и полностью — на /contacts.
 */
export const legal = {
  name: 'ИП Айгиз Искужин',
  site: 'https://ai-iskuzhin.is-a.dev',
  siteLabel: 'ai-iskuzhin.is-a.dev',
  inn: '024803896842',
  ogrnip: '326028000044859',
  okved: {
    code: '62.01',
    title: 'Разработка компьютерного программного обеспечения',
  },
  /** Запись в реестре операторов персональных данных Роскомнадзора (152-ФЗ) */
  pdOperator: {
    number: '2-26-056967',
    url: 'https://pd.rkn.gov.ru/operators-registry/operators-list/?id=2-26-056967',
  },
} as const

/**
 * Юридические документы. Живут на отдельном поддомене docs.mycard24.ru —
 * их правит юрист, и лендинг не должен требовать пересборки из-за правки
 * в оферте. Отсюда абсолютные ссылки, а не свои страницы.
 *
 * TODO: вернуть https, когда GitHub выпустит сертификат для поддомена. Сейчас
 * его нет (Pages ещё провижинит), и по https поддомен не отвечает вовсе —
 * недоступная оферта хуже, чем оферта по http. Проверить:
 *   gh api repos/mycard24/mycard24-docs-site/pages --jq .https_certificate.state
 */
const DOCS_ORIGIN = 'http://docs.mycard24.ru'

export const legalDocs = [
  { id: 'offer', label: 'Публичная оферта', href: `${DOCS_ORIGIN}/legal/offer/` },
  { id: 'terms', label: 'Пользовательское соглашение', href: `${DOCS_ORIGIN}/legal/terms/` },
  {
    id: 'consent',
    label: 'Согласие на обработку данных',
    href: `${DOCS_ORIGIN}/legal/consent/`,
  },
  {
    id: 'privacy',
    label: 'Политика обработки персональных данных',
    href: `${DOCS_ORIGIN}/legal/privacy_policy/`,
  },
  { id: 'cookies', label: 'Политика в отношении cookie', href: `${DOCS_ORIGIN}/legal/cookies/` },
] as const

/**
 * Соцсети компании в подвале.
 *
 * TODO: подставить адреса каналов. Пока href пустой, кнопка рисуется, но не
 * кликается — чтобы в вёрстке не было ссылок в никуда.
 */
export const socials = [
  { id: 'telegram', label: 'Telegram', href: '', color: '#229ed9' },
  { id: 'vk', label: 'ВКонтакте', href: '', color: '#0077ff' },
  { id: 'max', label: 'MAX', href: '', color: '#12162e' },
] as const

export const nav = [
  { href: '/regions', label: 'Регионы' },
  { href: '/delivery', label: 'Доставка' },
  { href: '/faq', label: 'Вопросы' },
  { href: '/contacts', label: 'Контакты' },
] as const

export const howItWorks = [
  {
    title: 'Выберите карту',
    description: 'Найдите свой регион и посмотрите условия по карте',
  },
  {
    title: 'Соберём заказ',
    description: 'Карта выпущена оператором — мы готовим отправление',
  },
  {
    title: 'Доставим вам',
    description: 'Почта России, СДЭК, 5Post или пункт выдачи — на выбор',
  },
  {
    title: 'Пользуйтесь',
    description: 'Пополняйте баланс и ездите по тарифам транспортной карты',
  },
]
