import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve:{
    alias:{
        "@":path.resolve(__dirname,"./src"),//配置src路径为@
        "@assets":path.resolve(__dirname,"./src/assets")//配置assets路径为@assets
    }
},
})
