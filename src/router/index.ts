import { createRouter, createWebHistory } from 'vue-router'
import Home from "@/views/Home.vue";
import Chat from '@/views/Chat.vue'
import Contact from '@/views/Contact.vue'
import Login from '@/views/Login.vue'

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
