import { createRouter, createWebHistory } from 'vue-router'
import Home from "@/views/HomeView.vue";
import Chat from '@/views/ChatView.vue'
import Contact from '@/views/ContactView.vue'
import Login from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: 'login',
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      redirect: '/chat',
      children: [
        {
          path: '/chat',
          name: 'chat',
          component: Chat
        },
        {
          path: '/contact',
          name: 'contact',
          component: Contact
        }
      ]
    }
  ],
})

export default router
