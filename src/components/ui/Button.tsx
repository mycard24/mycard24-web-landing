import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { AppLink } from './AppLink'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition ' +
  'disabled:pointer-events-none disabled:opacity-50'

const variants: Record<Variant, string> = {
  primary:
    'gradient-cta text-white shadow-[0_10px_24px_-12px_rgba(236,30,121,0.75)] ' +
    'hover:brightness-[1.06] active:brightness-95',
  secondary:
    'bg-white text-ink ring-1 ring-line-strong hover:bg-surface-soft hover:ring-ink-muted/40',
  ghost: 'text-ink-soft hover:bg-surface-soft hover:text-ink',
}

const sizes: Record<Size, string> = {
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-base',
}

interface CommonProps {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>

type LinkProps = CommonProps & {
  href: string
  /** Внешняя ссылка — откроется в новой вкладке */
  external?: boolean
}

/** Кнопка или ссылка с одинаковым видом: `href` переключает элемент на <a>. */
export function Button(props: ButtonProps | LinkProps) {
  const { variant = 'primary', size = 'md', className, children, ...rest } = props
  const classes = cn(base, variants[variant], sizes[size], className)

  if ('href' in rest && typeof rest.href === 'string') {
    const { href, external } = rest as Pick<LinkProps, 'href' | 'external'>

    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      )
    }
    return (
      <AppLink href={href} className={classes}>
        {children}
      </AppLink>
    )
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}
