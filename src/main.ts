import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import 'vfonts/Lato.css' // 通用字体
import 'vfonts/FiraCode.css' // 等宽字体
import { setupRouterListener } from '@/utils/require.ts'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 初始化路由监听器
setupRouterListener()

app.mount('#app')
