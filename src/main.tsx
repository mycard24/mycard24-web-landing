import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { App } from './App'
import './styles/globals.css'

const container = document.getElementById('root')
if (!container) throw new Error('Не найден контейнер #root')

const tree = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Собранный сайт отдаёт готовый HTML — его гидратируем. Дев-сервер отдаёт
// пустой контейнер, там обычный рендер.
if (container.hasChildNodes()) {
  hydrateRoot(container, tree)
} else {
  createRoot(container).render(tree)
}
