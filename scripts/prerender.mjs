import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

/**
 * Статическая генерация: прогоняет серверную сборку по всем адресам сайта и
 * раскладывает готовый HTML по файлам, как это делал `next build`.
 *
 * Запускается после двух сборок Vite — клиентской (dist) и серверной (.ssg).
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')

const { render, routes, sitemapXml, robotsTxt } = await import(
  pathToFileURL(join(root, '.ssg/entry-server.js')).href
)

// Шаблон читаем до записи файлов: страница '/' перезапишет dist/index.html
const template = await readFile(join(dist, 'index.html'), 'utf8')

async function emit(url, file) {
  const { html, headTags } = render(url)
  const page = template.replace('<!--app-head-->', headTags).replace('<!--app-html-->', html)
  const out = join(dist, file)
  await mkdir(dirname(out), { recursive: true })
  await writeFile(out, page)
}

for (const route of routes) {
  await emit(route, route === '/' ? 'index.html' : join(route.slice(1), 'index.html'))
}

// Адрес заведомо не совпадает ни с одним маршрутом — отрисуется страница 404
await emit('/__not-found__', '404.html')

await writeFile(join(dist, 'sitemap.xml'), sitemapXml)
await writeFile(join(dist, 'robots.txt'), robotsTxt)

console.log(
  `prerender: ${routes.length} страниц + 404.html, sitemap.xml, robots.txt\n` +
    routes.map((route) => `  ${route}`).join('\n'),
)
