import { writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { geoConicEqualArea, geoPath } from 'd3-geo'
import { cities } from '../src/content/cities.ts'
import { regions } from '../src/content/regions.ts'

/**
 * Генератор карты России для героя.
 *
 * Берёт границы субъектов из Natural Earth (50m, admin-1), проецирует конической
 * равновеликой проекцией, упрощает контуры и кладёт готовые SVG-пути в
 * `src/components/hero/russia-map-data.ts`.
 *
 * Запускается руками (`npm run build:map`), результат коммитится: обычная сборка
 * остаётся офлайновой и не зависит от доступности GitHub.
 */

const SOURCE =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_1_states_provinces.geojson'

const WIDTH = 1600

/**
 * Упрощение зависит от расстояния до регионов платформы.
 *
 * Камера героя ходит только вокруг них, поэтому рядом контуры нужны детальные,
 * а Чукотка с Якутией видны разве что общим планом — их изрезанное побережье
 * весит больше всей остальной карты. Порог — в единицах карты (ширина 1600).
 */
const DETAIL_NEAR = { tolerance: 0.4, minRingArea: 5 }
const DETAIL_FAR = { tolerance: 6, minRingArea: 600 }
/** На каком удалении контур доходит до самого грубого упрощения */
const DETAIL_FALLOFF = 620

/** Плавный переход от детального контура к грубому по мере удаления */
function detailAt(distance) {
  const t = Math.min(1, distance / DETAIL_FALLOFF)
  const ease = t * t
  return {
    tolerance: DETAIL_NEAR.tolerance + (DETAIL_FAR.tolerance - DETAIL_NEAR.tolerance) * ease,
    minRingArea:
      DETAIL_NEAR.minRingArea + (DETAIL_FAR.minRingArea - DETAIL_NEAR.minRingArea) * ease,
  }
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

/** Рамер-Дуглас-Пекер: выкидывает точки, которые почти лежат на хорде */
function simplify(points, tolerance) {
  if (points.length < 3) return points
  const sqTol = tolerance * tolerance
  const keep = new Uint8Array(points.length)
  keep[0] = keep[points.length - 1] = 1
  const stack = [[0, points.length - 1]]

  while (stack.length) {
    const [first, last] = stack.pop()
    let maxSq = 0
    let index = 0
    const [ax, ay] = points[first]
    const [bx, by] = points[last]
    const dx = bx - ax
    const dy = by - ay
    const len = dx * dx + dy * dy

    for (let i = first + 1; i < last; i++) {
      const [px, py] = points[i]
      let t = len ? ((px - ax) * dx + (py - ay) * dy) / len : 0
      t = t < 0 ? 0 : t > 1 ? 1 : t
      const qx = ax + t * dx
      const qy = ay + t * dy
      const sq = (px - qx) ** 2 + (py - qy) ** 2
      if (sq > maxSq) {
        maxSq = sq
        index = i
      }
    }

    if (maxSq > sqTol) {
      keep[index] = 1
      stack.push([first, index], [index, last])
    }
  }

  return points.filter((_, i) => keep[i])
}

/** Площадь кольца по формуле шнурков — чтобы отбросить мелочь */
function ringArea(points) {
  let sum = 0
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    sum += (points[j][0] - points[i][0]) * (points[j][1] + points[i][1])
  }
  return Math.abs(sum / 2)
}

const round = (n) => Math.round(n * 10) / 10

function ringToPath(points) {
  let d = `M${round(points[0][0])} ${round(points[0][1])}`
  for (let i = 1; i < points.length; i++) {
    d += `L${round(points[i][0])} ${round(points[i][1])}`
  }
  return `${d}Z`
}

console.log('Скачиваем Natural Earth admin-1…')
const response = await fetch(SOURCE)
if (!response.ok) throw new Error(`Natural Earth ответил ${response.status}`)
const collection = await response.json()

const features = collection.features.filter((f) => f.properties.adm0_a3 === 'RUS')
console.log(`Субъектов РФ: ${features.length}`)

// Коническая равновеликая: для широтно вытянутой России форма честнее
// меркаторовской, а поворот на 100° в.д. уводит стык антимеридиана от Чукотки.
const projection = geoConicEqualArea().parallels([52, 64]).rotate([-100, 0])
const fc = { type: 'FeatureCollection', features }
projection.fitWidth(WIDTH, fc)

const measure = geoPath(projection)
const [[minX, minY], [maxX, maxY]] = measure.bounds(fc)
const viewBox = {
  x: round(minX),
  y: round(minY),
  width: round(maxX - minX),
  height: round(maxY - minY),
}
console.log(`viewBox: ${viewBox.width}×${viewBox.height}`)

// Центры субъектов, на которых работает платформа
const platformIds = new Set(regions.map((r) => r.map.subjectId))
const platformCentres = features
  .filter((f) => platformIds.has(f.properties.name))
  .map((f) => measure.centroid(f))

if (platformCentres.length !== platformIds.size) {
  throw new Error('Не все subjectId из regions.ts нашлись в Natural Earth')
}

function detailFor(centroid) {
  let nearest = Infinity
  for (const [px, py] of platformCentres) {
    nearest = Math.min(nearest, Math.hypot(centroid[0] - px, centroid[1] - py))
  }
  return detailAt(nearest)
}

const subjects = []
for (const feature of features) {
  const { type, coordinates } = feature.geometry
  const polygons = type === 'Polygon' ? [coordinates] : coordinates
  const centroid = measure.centroid(feature)
  const detail = platformIds.has(feature.properties.name) ? DETAIL_NEAR : detailFor(centroid)

  // Считаем все кольца, отбор — потом: даже у мелкого субъекта должна остаться
  // хотя бы главная часть, иначе на карте появится дыра без границ.
  const rings = []
  for (const polygon of polygons) {
    for (const ring of polygon) {
      const projected = []
      for (const [lon, lat] of ring) {
        const point = projection([lon, lat])
        if (point && Number.isFinite(point[0]) && Number.isFinite(point[1])) projected.push(point)
      }
      if (projected.length < 4) continue
      // Главное кольцо упрощаем бережнее, чем острова вокруг него
      const simplified = simplify(projected, detail.tolerance)
      if (simplified.length < 4) continue
      rings.push({ points: simplified, area: ringArea(simplified) })
    }
  }
  if (!rings.length) continue

  rings.sort((a, b) => b.area - a.area)
  const kept = rings.filter((r) => r.area >= detail.minRingArea)
  const parts = (kept.length ? kept : rings.slice(0, 1)).map((r) => ringToPath(r.points))

  const [[bx0, by0], [bx1, by1]] = measure.bounds(feature)

  subjects.push({
    id: feature.properties.name,
    name: feature.properties.name_ru || feature.properties.name,
    d: parts.join(''),
    centroid: { x: round(centroid[0]), y: round(centroid[1]) },
    bbox: {
      x: round(bx0),
      y: round(by0),
      width: round(bx1 - bx0),
      height: round(by1 - by0),
    },
  })
}

subjects.sort((a, b) => a.id.localeCompare(b.id))
console.log(`Готово контуров: ${subjects.length}`)

const cityPoints = {}
for (const [key, city] of Object.entries(cities)) {
  const point = projection([city.lon, city.lat])
  if (!point) throw new Error(`Город ${key} не проецируется`)
  cityPoints[key] = { x: round(point[0]), y: round(point[1]) }
}

const out = `// СГЕНЕРИРОВАНО. Не редактируйте руками — запустите \`npm run build:map\`.
//
// Источник: Natural Earth 50m admin-1 (public domain).
// Проекция: coniceEqualArea, parallels [52, 64], rotate [-100, 0].
// Упрощение: Рамер-Дуглас-Пекер, допуск зависит от расстояния до регионов
// платформы (рядом детальнее, вдали грубее) — см. DETAIL_TIERS в скрипте.

export interface MapSubject {
  /** Латинское имя из Natural Earth — им регион связан с контентом */
  id: string
  /** Русское название субъекта */
  name: string
  /** SVG-путь в координатах MAP_VIEWBOX */
  d: string
  /** Геометрический центр — точка, вокруг которой строится кадр */
  centroid: { x: number; y: number }
  /** Габариты субъекта — по ним подбирается масштаб кадра */
  bbox: { x: number; y: number; width: number; height: number }
}

export const MAP_VIEWBOX = ${JSON.stringify(viewBox)} as const

export const SUBJECTS: MapSubject[] = ${JSON.stringify(subjects)}

export const SUBJECT_BY_ID = new Map(SUBJECTS.map((s) => [s.id, s]))

/** Города из src/content/cities.ts, спроецированные в координаты карты */
export const CITY_POINTS: Record<string, { x: number; y: number }> = ${JSON.stringify(cityPoints)}
`

const target = join(root, 'src/components/hero/russia-map-data.ts')
await writeFile(target, out)
console.log(`Записано: ${(out.length / 1024).toFixed(0)} КБ → ${target}`)
