import { howItWorks } from '@/content/site'
import { cn } from '@/lib/cn'

export function HowItWorks({ className }: { className?: string }) {
  return (
    <ol className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
      {howItWorks.map((step, index) => (
        <li
          key={step.title}
          className="relative rounded-card bg-white p-5 ring-1 ring-line"
        >
          <span className="grid size-9 place-items-center rounded-full gradient-cta text-sm font-bold text-white">
            {index + 1}
          </span>
          <h3 className="mt-4 font-semibold text-ink">{step.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-muted text-pretty">
            {step.description}
          </p>
        </li>
      ))}
    </ol>
  )
}
