import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './index.css'

// Routes will be defined later
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('./pages/LandingPage.vue')
    },
    {
      path: '/dashboard',
      component: () => import('./pages/Dashboard.vue')
    },
    {
      path: '/audit-selection',
      component: () => import('./pages/AuditSelection.vue')
    },
    {
      path: '/questionnaire',
      component: () => import('./pages/Questionnaire.vue')
    },
    {
      path: '/results',
      component: () => import('./pages/Results.vue')
    }
  ]
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
