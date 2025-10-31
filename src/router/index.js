// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'

// Lazy loading para optimizar
const Register = () => import('@/views/Register.vue')
const Admin = () => import('@/views/Admin.vue')
const EditCourse = () => import('@/views/EditCourse.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/login',    name: 'login',    component: Login,    meta: { public: true } },
    { path: '/register', name: 'register', component: Register, meta: { public: true } },
    { path: '/home',     name: 'home',     component: Home },
    { path: '/admin',    name: 'admin',    component: Admin },
    { path: '/edit-course/:id', name: 'edit-course', component: EditCourse },
    { path: '/:pathMatch(.*)*', redirect: '/login' },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  await authStore.waitForAuthInit()
  const isPublic = !!to.meta.public

  if (!authStore.user && !isPublic) return { name: 'login', query: { redirect: to.fullPath } }
  if (authStore.user && (to.name === 'login' || to.name === 'register')) return { name: 'home' }
  return true
})

export default router
