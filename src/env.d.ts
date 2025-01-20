/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EGZAMINATOR_BASE_BACKEND_URL: string
  readonly VITE_EGZAMINATOR_BASE_PATH: string
  readonly PORT: string
  readonly NODE_ENV: 'development' | 'production'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}