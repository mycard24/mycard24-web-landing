import type { Region } from '@/content/types'
import { cn } from '@/lib/cn'
import { RegionCard, RegionSoonCard } from './RegionCard'

/** Сетка регионов — для страницы /regions, где важен полный обзор, а не лента. */
export function RegionList({
  regions,
  showSoonTile = false,
  className,
}: {
  regions: Region[]
  /** Добавить замыкающую плитку «Скоро в вашем регионе» */
  showSoonTile?: boolean
  className?: string
}) {
  return (
    <div className={cn('grid gap-5 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {regions.map((region) => (
        <RegionCard key={region.slug} region={region} />
      ))}
      {showSoonTile && <RegionSoonCard />}
    </div>
  )
}
