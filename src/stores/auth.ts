import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService, type RegisterData, type RegisterResponse, type LoginData, type LoginResponse, type RefreshResponse, type UserResponse } from '@/services/auth'
import { apiService } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<any>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => {
    console.log('🔍 isAuthenticated check:', !!user.value, user.value)
    return !!user.value
  })
  const hasError = computed(() => !!error.value)
  const errorMessage = computed(() => error.value)
  
  // Getter pour le rôle utilisateur (premier rôle de la liste)
  const userRole = computed(() => {
    if (!user.value?.roles || user.value.roles.length === 0) {
      return null
    }
    return user.value.roles[0].title.toLowerCase()
  })
  
  // Getter pour le nom complet
  const userFullName = computed(() => {
    if (!user.value) return null
    return user.value.full_name || `${user.value.first_name} ${user.value.first_name}`
  })

  // Actions
  const register = async (data: RegisterData) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await authService.register(data)
      
      if (response.data) {
        user.value = response.data
      }

      return response
    } catch (err: any) {
      // Si erreur 401, déconnecter
      if (err?.status === 401) {
        await handleAuthError()
      }
      
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'inscription'
      error.value = errorMessage
      
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const login = async (credentials: LoginData) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await authService.login(credentials)
      
      user.value = response.data
      
      // Réinitialiser l'état de logout dans l'API service
      apiService.resetAuthState()
      console.log('✅ Login réussi, état API réinitialisé')
      
      return response
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la connexion'
      error.value = errorMessage
      
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    console.log('🚪 Déconnexion appelée')
    try {
      await authService.logout()
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err)
    } finally {
      // Marquer l'utilisateur comme déconnecté dans l'API service
      apiService.markAsLoggedOut()
      user.value = null
      console.log('✅ Utilisateur déconnecté, état API marqué')
    }
  }

  const clearError = () => {
    error.value = null
  }

  // Gérer les erreurs d'authentification globales
  const handleAuthError = async () => {
    user.value = null
    // Optionnel : rediriger vers la page de login
    // window.location.href = '/'
  }

  // Vérifier l'authentification au démarrage
  const initAuth = async () => {
    console.log('🚀 initAuth appelé')
    try {
      // Tenter de récupérer les infos utilisateur avec les cookies existants
      const response = await authService.getCurrentUser()
      console.log('📥 getCurrentUser response:', response)
      
      if (response && response.data) {
        user.value = response.data
        console.log('✅ initAuth réussi, utilisateur:', response.data)
        return true
      }
      
      console.log('❌ initAuth échoué: pas de data dans response')
      return false
    } catch (err: any) {
      console.log('❌ initAuth erreur:', err?.status, err?.message)
      // Si erreur 401, essayer de refresh
      if (err?.status === 401) {
        console.log('🔄 401 détecté, essai de refresh...')
        const refreshed = await refreshAuth()
        if (refreshed) {
          // Réessayer de récupérer les infos après refresh
          try {
            const response = await authService.getCurrentUser()
            if (response && response.data) {
              user.value = response.data
              console.log('✅ Récupération après refresh réussie:', response.data)
              return true
            }
          } catch (retryErr) {
            console.error('Échec de la récupération après refresh:', retryErr)
          }
        }
      }
      
      user.value = null
      return false
    }
  }

  // Rafraîchir le token automatiquement
  const refreshAuth = async () => {
    console.log('🔄 refreshAuth appelé')
    try {
      const response = await authService.refreshToken()
      console.log('✅ refreshToken response:', response)
      
      // Si le refresh réussit, récupérer les infos utilisateur
      try {
        const userResponse = await authService.getCurrentUser()
        console.log('📥 getCurrentUser après refresh:', userResponse)
        
        if (userResponse && userResponse.data) {
          user.value = userResponse.data
          console.log('✅ Utilisateur restauré après refresh:', userResponse.data)
        } else {
          console.log('⚠️ Refresh réussi mais pas de données utilisateur')
        }
      } catch (userErr) {
        console.warn('⚠️ Impossible de récupérer les infos utilisateur après refresh:', userErr)
        // Le refresh a réussi mais on ne peut pas récupérer les infos
        // On considère quand même que l'authentification est valide
      }
      return true
    } catch (err: any) {
      console.log('❌ refreshAuth erreur:', err?.status, err?.message)
      user.value = null
      return false
    }
  }

  // Debug: vérifier les cookies (à supprimer en production)
  const debugCookies = async () => {
    try {
      const tokens = await authService.debugTokens()
      console.log('Cookies debug:', tokens)
      return tokens
    } catch (err) {
      console.error('Erreur debug cookies:', err)
      return null
    }
  }

  return {
    // State
    user,
    isLoading,
    error,
    
    // Getters
    isAuthenticated,
    hasError,
    errorMessage,
    userRole,
    userFullName,
    
    // Actions
    register,
    login,
    logout,
    clearError,
    initAuth,
    refreshAuth,
    handleAuthError,
    debugCookies
  }
})
