import type { PageHead } from '@/lib/seo'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'

/** Не попадает в pages.ts: пререндер кладёт её отдельно в 404.html. */
export const head: PageHead = {
  path: '/404',
  title: 'Страница не найдена',
  description: 'Такой страницы нет. Начните с выбора региона.',
  index: false,
  priority: 0,
}

export default function NotFoundPage() {
  return (
    <Container>
      <div className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <p className="text-6xl font-black text-gradient-brand">404</p>
        <h1 className="mt-6 text-2xl font-bold text-balance text-ink sm:text-3xl">
          Такой страницы нет
        </h1>
        <p className="mt-4 max-w-md text-ink-muted text-pretty">
          Возможно, регион ещё не подключён или ссылка устарела. Начните с выбора региона.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/regions" size="lg">
            Выбрать регион
          </Button>
          <Button href="/" size="lg" variant="secondary">
            На главную
          </Button>
        </div>
      </div>
    </Container>
  )
}
