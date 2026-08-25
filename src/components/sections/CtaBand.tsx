import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { ArrowRightIcon } from '@/components/ui/icons'

export function CtaBand({
  title,
  description,
  action,
  secondary,
}: {
  title: string
  description: string
  action: { href: string; label: string }
  secondary?: { href: string; label: string }
}) {
  return (
    <section className="py-10 sm:py-14">
      <Container>
        <div className="relative overflow-hidden rounded-tile bg-ink px-6 py-12 text-center sm:px-12 sm:py-16">
          <div className="brand-glow pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-balance text-white sm:text-3xl">
              {title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/70 text-pretty">
              {description}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href={action.href} size="lg">
                {action.label}
                <ArrowRightIcon className="size-5" />
              </Button>
              {secondary && (
                <Button href={secondary.href} size="lg" variant="secondary">
                  {secondary.label}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
