import { createRouter, createWebHistory } from 'vue-router'
import HomeComponent from "@/views/HomeComponent.vue";
import ChatComponent from '@/views/ChatComponent.vue'
import ContactComponent from '@/views/ContactComponent.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: 'home',
    },
    {
      path: '/home',
      name: 'home',
      component: HomeComponent,
      children: [
        {
          path: '/chat',
          name: 'chat',
          component: ChatComponent
        },
        {
          path: '/contact',
          name: 'contact',
          component: ContactComponent
        }
      ]
    }
  ],
})

export default router
