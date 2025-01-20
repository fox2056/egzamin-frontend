/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly EGZAMINATOR_BASE_BACKEND_URL: string
  readonly EGZAMINATOR_BASE_PATH: string
  readonly PORT: string
  readonly NODE_ENV: 'development' | 'production'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 