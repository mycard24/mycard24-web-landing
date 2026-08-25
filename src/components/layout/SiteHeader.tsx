import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { nav } from '@/content/site'
import { primaryCta } from '@/content/regions'
import { cn } from '@/lib/cn'
import { Logo } from '@/components/brand/Logo'
import { AppLink } from '@/components/ui/AppLink'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { CloseIcon, MenuIcon } from '@/components/ui/icons'

export function SiteHeader() {
  const { pathname } = useLocation()

  // Шапка лежит поверх карты героя и своего фона не имеет. Подложку получает
  // только когда страницу прокрутили: над обычным контентом прозрачная липкая
  // шапка нечитаема. Стартовое значение одинаково на сервере и клиенте.
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Меню «привязано» к странице, на которой его открыли: при переходе
  // pathname меняется и меню закрывается само — без синхронизации в эффекте.
  const [openedOn, setOpenedOn] = useState<string | null>(null)
  const open = openedOn === pathname
  const setOpen = (next: boolean) => setOpenedOn(next ? pathname : null)

  // Блокируем прокрутку страницы, пока открыто мобильное меню
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-colors duration-300',
        scrolled || open
          ? 'border-b border-line/80 bg-white/85 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <Container>
        <div className="flex h-12 items-center justify-between gap-4 sm:h-14">
          <AppLink href="/" aria-label="МояКарта24 — на главную" className="shrink-0">
            <Logo />
          </AppLink>

          <nav aria-label="Основная навигация" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <AppLink
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        isActive ? 'text-ink' : 'text-ink-muted hover:text-ink',
                      )}
                    >
                      {item.label}
                    </AppLink>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {/* Прятать обёрткой, а не классом: cn() просто склеивает строки и не
                разрешает конфликт `hidden` с `inline-flex` из базы кнопки */}
            <span className="hidden sm:block">
              <Button href={primaryCta.href} className="h-10 px-4">
                {primaryCta.label}
              </Button>
            </span>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
              className="grid size-10 place-items-center rounded-xl text-ink-soft ring-1 ring-line transition hover:bg-surface-soft lg:hidden"
            >
              {open ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
            </button>
          </div>
        </div>
      </Container>

      {open && (
        <div id="mobile-nav" className="border-t border-line bg-white lg:hidden">
          <Container>
            <nav aria-label="Мобильная навигация" className="py-4">
              <ul className="grid gap-1">
                {nav.map((item) => (
                  <li key={item.href}>
                    <AppLink
                      href={item.href}
                      className="block rounded-xl px-3 py-3 text-base font-medium text-ink-soft transition hover:bg-surface-soft"
                    >
                      {item.label}
                    </AppLink>
                  </li>
                ))}
              </ul>
              <Button href={primaryCta.href} size="lg" className="mt-3 w-full">
                {primaryCta.label}
              </Button>
            </nav>
          </Container>
        </div>
      )}
    </header>
  )
}
