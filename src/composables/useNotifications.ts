import { ref, reactive } from 'vue'
import { ApiError } from '@/services/api'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  persistent?: boolean
}

const notifications = ref<Notification[]>([])

export function useNotifications() {
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString()
    const newNotification: Notification = {
      id,
      duration: notification.type === 'error' ? 8000 : 5000,
      persistent: notification.type === 'error',
      ...notification
    }
    
    notifications.value.push(newNotification)
    
    // Auto-remove notification after duration (unless persistent)
    if (!newNotification.persistent) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }
    
    return id
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearAll = () => {
    notifications.value = []
  }

  // Helper methods for common notification types
  const success = (title: string, message?: string) => {
    return addNotification({ type: 'success', title, message })
  }

  const showError = (title: string, message?: string) => {
    return addNotification({ type: 'error', title, message })
  }

  const warning = (title: string, message?: string) => {
    return addNotification({ type: 'warning', title, message })
  }

  const info = (title: string, message?: string) => {
    return addNotification({ type: 'info', title, message })
  }

  // Handle API errors
  const handleApiError = (error: any) => {
    // Handle ApiError directly
    if (error instanceof ApiError) {
      showError(error.message)
      return
    }
    
    // Handle different error formats
    if (error?.detail?.message) {
      // Format: { detail: { message: "Cet email est déjà enregistré..." } }
      showError(error.detail.message, error.detail.status_code ? `Erreur ${error.detail.status_code}` : 'Erreur de traitement')
    } else if (error?.message) {
      // Format: { message: "Something went wrong" }
      showError(error.message)
    } else if (error?.response?.data?.message) {
      // Format: { response: { data: { message: "..." } } }
      showError(error.response.data.message)
    } else if (typeof error === 'string') {
      // Format: "Error message string"
      showError(error)
    } else {
      // Fallback
      showError('Une erreur est survenue', 'Veuillez réessayer plus tard')
    }
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error: showError,
    warning,
    info,
    handleApiError
  }
}
