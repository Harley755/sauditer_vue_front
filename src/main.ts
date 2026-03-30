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
      path: '/my-audits',
      name: 'MyAudits',
      component: () => import('./pages/MyAudits.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/test-signup',
      name: 'TestSignup',
      component: () => import('./pages/TestSignup.vue')
    }
  ]
})

// Route guard avec initialisation et rafraîchissement automatique
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Si on va vers la page d'accueil, toujours autoriser
  if (to.path === '/') {
    next()
    return
  }
  
  // Pour les routes protégées, vérifier l'authentification
  if (to.meta.requiresAuth) {
    // Si pas authentifié, tenter de restaurer la session
    if (!authStore.isAuthenticated) {
      console.log('Utilisateur non authentifié, tentative de restauration...')
      
      // D'abord essayer de récupérer les infos utilisateur
      const initialized = await authStore.initAuth()
      
      if (!initialized) {
        console.log('initAuth échoué, essai de refresh...')
        // Si initAuth échoue, essayer refresh
        const refreshed = await authStore.refreshAuth()
        
        if (!refreshed) {
          console.log('refresh échoué, redirection vers login')
          next('/')
          return
        }
        
        console.log('refresh réussi')
      } else {
        console.log('initAuth réussi')
      }
    }
  }
  
  next()
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Initialiser l'authentification avant de monter l'app
const authStore = useAuthStore()
authStore.initAuth().then(() => {
  app.mount('#app')
})