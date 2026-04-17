import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// oxlint-disable-next-line no-control-regex
const INVALID_CHAR_REGEX = /[\x00-\x1F\x7F<>*#"{}|^[\]`;?:&=+$,]/g;
const DRIVE_LETTER_REGEX = /^[a-z]:/i;

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base: process.env.NODE_ENV === 'production' ? '/flevo/' : '',
  build: {
    target: 'es2022',
    // 解決部屬後找不到 _plugin-vue_export-helper 問題
    // 來源： https://israynotarray.com/other/20220928/1377668819/
    rollupOptions: {
      output: {
        // https://github.com/rollup/rollup/blob/master/src/utils/sanitizeFileName.ts
        sanitizeFileName(name) {
          const match = DRIVE_LETTER_REGEX.exec(name);
          const driveLetter = match ? match[0] : '';
          // substr 是被淘汰語法，因此要改 slice
          return driveLetter + name.slice(driveLetter.length).replace(INVALID_CHAR_REGEX, '');
        },
        // 將第三方套件獨立打包，提升瀏覽器快取效率
        manualChunks(id) {
          if (id.includes('apexcharts') || id.includes('vue3-apexcharts')) {
            return 'vendor-charts';
          }
          if (id.includes('swiper')) {
            return 'vendor-swiper';
          }
          if (id.includes('gsap')) {
            return 'vendor-gsap';
          }
          if (id.includes('bootstrap')) {
            return 'vendor-bootstrap';
          }
          if (id.includes('vee-validate') || id.includes('@vee-validate')) {
            return 'vendor-form';
          }
          if (
            id.includes('node_modules/vue') ||
            id.includes('node_modules/pinia') ||
            id.includes('node_modules/vue-router')
          ) {
            return 'vendor-vue';
          }
        },
      },
    },
  },
  // 解決使用 bootstrap 造成的 dart-sass 相關警告
  // https://github.com/twbs/bootstrap/issues/40962
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        silenceDeprecations: ['import', 'legacy-js-api'],
      },
    },
  },
});
