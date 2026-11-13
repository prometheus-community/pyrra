import path from 'path'
import {defineConfig, type Plugin} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// The API the dev server proxies to. .agents/run points it at a local
// `pyrra api`; the default needs nothing running locally.
const apiURL = process.env.PYRRA_API_URL ?? 'https://demo.pyrra.dev'

// The Go server renders index.html as a template; the dev server serves it as
// is. Unrendered, those script tags are syntax errors, API_BASEPATH stays unset
// and the UI calls http://localhost:9099 directly instead of the proxy below.
const renderIndexTemplate = (): Plugin => ({
  name: 'render-index-template',
  apply: 'serve',
  transformIndexHtml: (html) => {
    const values: Record<string, string> = {
      PathPrefix: '/',
      APIBasepath: '/',
      ExternalURL: process.env.PROMETHEUS_EXTERNAL_URL ?? 'https://demo.pyrra.dev/prometheus',
      ExternalGrafanaDatasourceID: '',
      ExternalGrafanaOrgID: '',
      Version: 'dev',
    }
    return html.replace(/\{\{\.(\w+)\}\}/g, (_, name: string) => JSON.stringify(values[name] ?? ''))
  },
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), renderIndexTemplate()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/objectives.v1alpha1.ObjectiveService': {
        target: apiURL,
        changeOrigin: true,
        secure: true,
      },
      '/prometheus.v1.PrometheusService': {
        target: apiURL,
        changeOrigin: true,
        secure: true,
      },
    },
  },
  build: {
    outDir: 'build',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
})
