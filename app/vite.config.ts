import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import unocss from 'unocss/vite'
// import AutoImport from 'unplugin-auto-import/vite'

// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    unocss(),
    // AutoImport({
    //   resolvers: [ElementPlusResolver()],
    // }),
    // Components({
    //   resolvers: [ElementPlusResolver()],
    // }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
