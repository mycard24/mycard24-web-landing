import { extname } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Превью статической сборки — как на боевом хостинге.
 *
 * Пререндер кладёт страницы в `<путь>/index.html`. Nginx (`try_files`), Netlify
 * и Cloudflare Pages сами достраивают этот индекс, а sirv внутри `vite preview`
 * требует слеш на конце и иначе отдаёт 404. Достраиваем путь сами, чтобы
 * превью не расходилось с продакшеном.
 */
function prerenderedPreview(): Plugin {
  return {
    name: 'prerendered-preview',
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        const [path = '/', query] = (req.url ?? '/').split('?')
        if (path !== '/' && !path.endsWith('/') && !extname(path)) {
          req.url = `${path}/index.html${query ? `?${query}` : ''}`
        }
        next()
      })
    },
  }
}

export default defineConfig(({ isPreview }) => ({
  plugins: [react(), tailwindcss(), prerenderedPreview()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Дев-сервер отдаёт index.html на любой адрес, чтобы работали прямые ссылки
  // на маршруты. Превью, наоборот, должно вести себя как боевой хостинг: у
  // каждой страницы свой файл, и подменять его на index.html нельзя — иначе
  // сервер и клиент отрисуют разные страницы (ошибка гидратации).
  appType: isPreview ? 'mpa' : 'spa',
  build: {
    target: 'es2022',
    sourcemap: true,
  },
}))
