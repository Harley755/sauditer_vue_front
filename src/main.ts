import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './index.css'
import 'vue-sonner/style.css'
import { useAuthStore } from './stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: () => import('./pages/LandingPage.vue')
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('./pages/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/audit-selection',
      name: 'AuditSelection',
      component: () => import('./pages/AuditSelection.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/questionnaire',
      name: 'Questionnaire',
      component: () => import('./pages/Questionnaire.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/results',
      name: 'Results',
      component: () => import('./pages/Results.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/test-signup',
      name: 'TestSignup',
      component: () => import('./pages/TestSignup.vue')
    }
  ]
})

// Route guard pour protéger les routes nécessitant une authentification
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Initialiser l'authentification avant de monter l'app
const authStore = useAuthStore()
authStore.initAuth()

app.mount('#app')