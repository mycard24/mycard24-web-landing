import type { AnchorHTMLAttributes } from 'react'
import { Link } from 'react-router'

/** Внутренний маршрут приложения, а не якорь, mailto:, tel: или другой сайт. */
function isRoute(href: string): boolean {
  return href.startsWith('/') && !href.startsWith('//')
}

type AppLinkProps = { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>

/**
 * Ссылка, которая сама выбирает механику перехода: внутренние адреса идут
 * через роутер (без перезагрузки), всё остальное — обычным <a>.
 *
 * Заменяет next/link: тот делал этот выбор неявно, здесь он в одном месте.
 */
export function AppLink({ href, children, ...rest }: AppLinkProps) {
  if (isRoute(href)) {
    return (
      <Link to={href} {...rest}>
        {children}
      </Link>
    )
  }
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  )
}
