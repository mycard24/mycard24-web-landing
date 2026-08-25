import { AppLink } from '@/components/ui/AppLink'
import { regions } from '@/content/regions'
import { legal, nav, site, socials } from '@/content/site'
import { cn } from '@/lib/cn'
import { Logo } from '@/components/brand/Logo'
import { Container } from '@/components/ui/Container'
import { TelegramIcon, VkIcon } from '@/components/ui/icons'

/** Кнопка соцсети: пока адрес не задан, рисуется, но не кликается */
function SocialButton({ social }: { social: (typeof socials)[number] }) {
  const shell = cn(
    'inline-flex size-9 items-center justify-center rounded-xl text-white transition',
    social.href ? 'hover:brightness-110' : 'cursor-default opacity-45',
  )
  const inner =
    social.id === 'telegram' ? (
      <TelegramIcon className="size-5" />
    ) : social.id === 'vk' ? (
      <VkIcon className="size-6" />
    ) : (
      <span className="text-[0.6rem] font-bold tracking-wide">MAX</span>
    )

  if (!social.href) {
    return (
      <span className={shell} style={{ backgroundColor: social.color }} title={social.label}>
        {inner}
        <span className="sr-only">{social.label}</span>
      </span>
    )
  }

  return (
    <a
      href={social.href}
      target="_blank"
      rel="noreferrer"
      aria-label={social.label}
      title={social.label}
      className={shell}
      style={{ backgroundColor: social.color }}
    >
      {inner}
    </a>
  )
}

const legalLinks = [
  { href: '/privacy', label: 'Политика конфиденциальности' },
  { href: '/offer', label: 'Оферта' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface-soft py-10">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-muted text-pretty">
              {site.tagline}. Принимаем заявки и доставляем карты; эмитентом карты остаётся её
              официальный оператор в регионе.
            </p>
            <p className="mt-4 text-xs text-ink-muted tabular-nums">
              © {new Date().getFullYear()} {site.name}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {socials.map((social) => (
                <li key={social.id}>
                  <SocialButton social={social} />
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Разделы">
            <h2 className="text-sm font-semibold text-ink">Сервис</h2>
            <ul className="mt-4 grid gap-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <AppLink
                    href={item.href}
                    className="text-sm text-ink-muted transition-colors hover:text-ink"
                  >
                    {item.label}
                  </AppLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Регионы">
            <h2 className="text-sm font-semibold text-ink">Регионы</h2>
            <ul className="mt-4 grid gap-2.5">
              {regions.map((region) =>
                region.status === 'available' ? (
                  <li key={region.slug}>
                    <AppLink
                      href={`/${region.slug}`}
                      className="text-sm text-ink-muted transition-colors hover:text-ink"
                    >
                      {region.shortName}
                    </AppLink>
                  </li>
                ) : (
                  // Страницы ещё нет — просто строка со статусом
                  <li key={region.slug} className="text-sm text-ink-muted">
                    {region.shortName}
                    <span className="ml-1.5 text-xs text-line-strong">скоро</span>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold text-ink">Контакты</h2>
            <ul className="mt-4 grid gap-2.5 text-sm text-ink-muted">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="transition-colors hover:text-ink"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.phoneHref}`}
                  className="transition-colors hover:text-ink"
                >
                  {site.phone}
                </a>
              </li>
            </ul>
            <ul className="mt-5 grid gap-2.5">
              {legalLinks.map((item) => (
                <li key={item.href}>
                  <AppLink
                    href={item.href}
                    className="text-sm text-ink-muted transition-colors hover:text-ink"
                  >
                    {item.label}
                  </AppLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-line pt-6 text-xs leading-relaxed text-ink-muted">
          <p>
            © {new Date().getFullYear()} {site.name}.{' '}
            <a
              href={legal.site}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-ink"
            >
              {legal.name}
            </a>
            . ИНН {legal.inn} · ОГРНИП {legal.ogrnip}.
          </p>
          <p className="mt-1.5">
            ОКВЭД {legal.okved.code} {legal.okved.title} · Оператор ПД в реестре РКН{' '}
            <a
              href={legal.pdOperator.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-ink"
            >
              №&nbsp;{legal.pdOperator.number}
            </a>
          </p>
          <p className="mt-3 max-w-4xl text-pretty">
            Названия и изображения региональных карт принадлежат их операторам. МояКарта24 не
            является эмитентом карт и оказывает услуги по приёму заявок и доставке.
          </p>
          <p className="mt-4 max-w-4xl text-[0.6875rem] leading-relaxed text-line-strong text-pretty">
            Продолжая использовать наш сайт, вы даёте согласие на обработку файлов cookies и
            других пользовательских данных, в соответствии с{' '}
            <AppLink href="/privacy" className="underline underline-offset-2 transition-colors hover:text-ink-muted">
              Политикой конфиденциальности
            </AppLink>
            .
          </p>
        </div>
      </Container>
    </footer>
  )
}
