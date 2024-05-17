import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

//unplugin-vue-components的使用（自动注册组件）
//导入主文件以及解析器
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    //注册
    Components({
      //自动生成类型文件，这里多余了，所以选择不生成
      dts: false,
      //配置解析器，使用vant解析器，选择不导入样式，因为在main.ts中导入了全局样式，与这里产生重复
      resolvers: [VantResolver({ importStyle: false })]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
