import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@types': path.resolve(__dirname, './src/types'),
        '@stores': path.resolve(__dirname, './src/stores'),
        '@services': path.resolve(__dirname, './src/services'),
        '@i18n': path.resolve(__dirname, './src/i18n'),
      },
    },
    server: {
      port: 10000,
      host: '0.0.0.0',
      open: false,
    },
    build: {
      // Production optimizations
      target: 'es2020',
      minify: 'terser',
      sourcemap: mode === 'production' ? false : true,
      rollupOptions: {
        output: {
          manualChunks: {
            // Separate vendor chunks for better caching
            vendor: ['react', 'react-dom'],
            mantine: ['@mantine/core', '@mantine/hooks', '@mantine/notifications'],
            icons: ['@tabler/icons-react'],
            charts: ['@mantine/charts', 'echarts', 'echarts-for-react'],
            router: ['react-router-dom'],
            forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
            i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
            state: ['zustand'],
            query: ['@tanstack/react-query'],
          },
        },
      },
    },
    define: {
      // Global constants
      __APP_VERSION__: JSON.stringify(env.npm_package_version || '1.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __BUILD_HASH__: JSON.stringify(env.VITE_BUILD_HASH || Date.now().toString()),
    },
    preview: {
      port: 4173,
      host: '0.0.0.0',
    },
  }
})
