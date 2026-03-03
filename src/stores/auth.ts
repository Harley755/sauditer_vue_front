import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService, type RegisterData, type RegisterResponse, type LoginData, type LoginResponse } from '@/services/auth'
import { notificationService } from '@/services/notification'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<any>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const hasError = computed(() => !!error.value)
  const errorMessage = computed(() => error.value)

  // Actions
  const register = async (data: RegisterData) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await authService.register(data)
      
      // Stocker le token et l'utilisateur si présents
      if (response.token) {
        token.value = response.token
        localStorage.setItem('auth_token', response.token)
      }
      
      if (response.user) {
        user.value = response.user
      }

      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'inscription'
      error.value = errorMessage
      
      // Afficher la notification d'erreur
      notificationService.error(errorMessage)
      
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
      
      // Stocker le token et l'utilisateur
      token.value = response.token
      user.value = response.user
      localStorage.setItem('auth_token', response.token)
      
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la connexion'
      error.value = errorMessage
      
      // Afficher la notification d'erreur
      notificationService.error(errorMessage)
      
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
  }

  const clearError = () => {
    error.value = null
  }

  // Initialiser le token depuis localStorage au démarrage
  const initAuth = () => {
    const savedToken = localStorage.getItem('auth_token')
    if (savedToken) {
      token.value = savedToken
    }
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,
    
    // Getters
    isAuthenticated,
    hasError,
    errorMessage,
    
    // Actions
    register,
    login,
    logout,
    clearError,
    initAuth
  }
})
