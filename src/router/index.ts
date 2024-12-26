import { createRouter, createWebHistory } from 'vue-router'
import HomeComponent from "@/views/HomeComponent.vue";

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
      component: HomeComponent
    },
  ],
})

export default router
