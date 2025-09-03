import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5173,
    open: true,
    host: true,
    allowedHosts: [
      'proyecto-integrador-riwi-web-prod.onrender.com'
    ]
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: './index.html',
        login: './src/pages/login.html',
        register: './src/pages/register.html',
        search: './src/pages/search.html',
        admin: './src/pages/Admin.html',
        'form-info-store': './src/pages/formInfoStore.html',
        'store-detail': './src/pages/StoreDetail.html'
      }
    }
  },
  publicDir: 'public',
  root: '.',
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  // Configuración para manejar rutas en producción
  preview: {
    port: 4173,
    host: true
  }
})
