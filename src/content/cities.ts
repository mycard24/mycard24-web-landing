/**
 * Города, которые герой показывает вокруг выбранного региона.
 *
 * Координаты реальные — от них считаются и расстояния (src/lib/geo.ts), и
 * положение подписи на карте. Проекция в координаты карты делается заранее,
 * скриптом `npm run build:map`: он читает этот файл и кладёт готовые x/y в
 * `src/components/hero/russia-map-data.ts`. Добавили город — перегенерируйте.
 */
export const cities = {
  ufa: { name: 'Уфа', lat: 54.7348, lon: 55.9578 },
  kazan: { name: 'Казань', lat: 55.7963, lon: 49.1088 },
  izhevsk: { name: 'Ижевск', lat: 56.8527, lon: 53.2115 },
  perm: { name: 'Пермь', lat: 58.0105, lon: 56.2502 },
  yekaterinburg: { name: 'Екатеринбург', lat: 56.8389, lon: 60.6057 },
  chelyabinsk: { name: 'Челябинск', lat: 55.1644, lon: 61.4368 },
  orenburg: { name: 'Оренбург', lat: 51.7727, lon: 55.0988 },
} as const

export type CityKey = keyof typeof cities
