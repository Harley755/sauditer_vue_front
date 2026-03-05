import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './index.css'
import 'vue-sonner/style.css'

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
      component: () => import('./pages/Dashboard.vue')
    },
    {
      path: '/audit-selection',
      name: 'AuditSelection',
      component: () => import('./pages/AuditSelection.vue')
    },
    {
      path: '/questionnaire',
      name: 'Questionnaire',
      component: () => import('./pages/Questionnaire.vue')
    },
    {
      path: '/results',
      name: 'Results',
      component: () => import('./pages/Results.vue')
    },
    {
      path: '/test-signup',
      name: 'TestSignup',
      component: () => import('./pages/TestSignup.vue')
    }
  ]
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')