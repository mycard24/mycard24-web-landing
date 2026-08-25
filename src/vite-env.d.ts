/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Куда отправлять заявки с формы оформления карты. Не задана — форма пишет в консоль. */
  readonly VITE_LEAD_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
