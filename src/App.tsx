import { useEffect, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import { headByPath } from '@/lib/pages'
import { applyHead } from '@/lib/seo'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import CardPage from '@/pages/CardPage'
import ContactsPage from '@/pages/ContactsPage'
import DeliveryPage from '@/pages/DeliveryPage'
import FaqPage from '@/pages/FaqPage'
import HomePage from '@/pages/HomePage'
import NotFoundPage, { head as notFoundHead } from '@/pages/NotFoundPage'
import OfferPage from '@/pages/OfferPage'
import PrivacyPage from '@/pages/PrivacyPage'
import RegionPage from '@/pages/RegionPage'
import RegionsPage from '@/pages/RegionsPage'

/**
 * То, что Next делал за кадром при переходе между страницами: обновить <head>
 * и увести скролл наверх. При первой загрузке ничего не трогаем — теги уже
 * лежат в пререндеренном HTML, а позицию (в том числе якорь) выставил браузер.
 */
function RouteEffects() {
  const { pathname, hash } = useLocation()
  const firstRender = useRef(true)

  useEffect(() => {
    applyHead(headByPath.get(pathname) ?? notFoundHead)
  }, [pathname])

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (hash) {
      document.querySelector(hash)?.scrollIntoView()
      return
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

export function App() {
  return (
    <>
      <RouteEffects />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Перейти к содержимому
      </a>

      <SiteHeader />

      <main id="main" className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/regions" element={<RegionsPage />} />
          <Route path="/delivery" element={<DeliveryPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/offer" element={<OfferPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          {/* Динамические маршруты идут последними: статические сегменты
              выигрывают у параметров по рангу, но так читается яснее. */}
          <Route path="/:region" element={<RegionPage />} />
          <Route path="/:region/:card" element={<CardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <SiteFooter />
    </>
  )
}
