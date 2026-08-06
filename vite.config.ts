import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'; // Import the plugin
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  resolve: {
    alias: {
      '@common': path.resolve(__dirname, './src/common'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@features': path.resolve(__dirname, './src/features'),
      '@models': path.resolve(__dirname, './src/models'),
      "@typings": path.resolve(__dirname, 'typings.d.ts'),
      'typings.d': path.resolve(__dirname, 'typings.d.ts'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@stores': path.resolve(__dirname, './src/stores')
    },
  },
  build: {
    rollupOptions: {
      output: {
        // The route chunks are already small; the weight is in shared vendor code
        // that every route depends on. Splitting it by library turns one large
        // blocking download into parallel requests, and lets a library that
        // rarely changes stay cached across app deploys.
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          const pkgPath = id.split('node_modules/').pop()!.replace(/\\/g, '/');

          if (/^(react|react-dom|scheduler|react-is)\//.test(pkgPath)) return 'react';
          if (/^react-router(-dom)?\//.test(pkgPath)) return 'router';
          if (pkgPath.startsWith('@supabase/')) return 'supabase';
          if (/^(framer-motion|motion-dom|motion-utils)\//.test(pkgPath)) return 'motion';
          if (pkgPath.startsWith('leaflet/')) return 'leaflet';
          if (/^(@emoji-mart\/|emoji-mart\/)/.test(pkgPath)) return 'emoji';
          if (/^(mobx|mobx-react-lite)\//.test(pkgPath)) return 'mobx';
          // react-to-pdf's transitive stack: jsPDF and its rasterizers.
          if (/^(react-to-pdf|jspdf|html2canvas|canvg|svg-pathdata|rgbcolor|stackblur-canvas)\//.test(pkgPath))
            return 'pdf';
        },
      },
    },
  },
  server: {
    cors: true,
    proxy: {
       '/api': {
        changeOrigin: true,
        target: 'https://api.alsaqr.app/',
        secure: false
       },
   },
  }
})
