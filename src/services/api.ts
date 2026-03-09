const API_BASE_URL = 'http://localhost:8000/api'

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Response
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

class ApiService {
  private isRefreshing = false
  private refreshQueue: Array<() => void> = []
  private isLoggedOut = false  // ← AJOUT CRUCIAL

  // Méthode pour marquer l'utilisateur comme déconnecté
  markAsLoggedOut() {
    this.isLoggedOut = true
    this.isRefreshing = false
    this.refreshQueue = []
  }

  // Méthode pour réinitialiser l'état de connexion
  resetAuthState() {
    this.isLoggedOut = false
  }

  private async refreshToken(): Promise<void> {
    // Si l'utilisateur est déconnecté, ne pas essayer de refresh
    if (this.isLoggedOut) {
      throw new Error('User is logged out')
    }

    if (this.isRefreshing) {
      return new Promise((resolve) => {
        this.refreshQueue.push(resolve)
      })
    }

    this.isRefreshing = true
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Refresh failed')
      }

      // Notifier toutes les requêtes en attente
      this.refreshQueue.forEach(resolve => resolve())
      this.refreshQueue = []
    } catch (error) {
      // En cas d'échec du refresh, vider la queue
      this.refreshQueue.forEach(resolve => resolve())
      this.refreshQueue = []
      throw error
    } finally {
      this.isRefreshing = false
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Force l'envoi des cookies pour toutes les requêtes
      ...options,
    }

    const makeRequest = async (): Promise<T> => {
      try {
        const response = await fetch(url, config)

        // Lire le body même en cas d'erreur
        let responseData: any
        try {
          responseData = await response.json()
        } catch (jsonError) {
          // Si la réponse n'est pas JSON, utiliser le texte
          responseData = await response.text()
        }

        // Si token expiré (401), essayer de refresh
        if (response.status === 401 && !url.includes('/auth/refresh')) {
          // Si l'utilisateur est déconnecté, ne pas essayer de refresh
          if (this.isLoggedOut) {
            console.log('🚫 Utilisateur déconnecté, pas de refresh')
            const errorMessage = this.extractErrorMessage(responseData, response.status)
            throw new ApiError(errorMessage, response.status, response)
          }

          try {
            await this.refreshToken()
            // Refaire la requête originale après le refresh
            const retryResponse = await fetch(url, config)
            
            if (!retryResponse.ok) {
              const retryData = await retryResponse.json()
              const errorMessage = this.extractErrorMessage(retryData, retryResponse.status)
              throw new ApiError(errorMessage, retryResponse.status, retryResponse)
            }
            
            return retryResponse.json()
          } catch (refreshError) {
            // Si le refresh échoue, déconnecter l'utilisateur
            console.log('🔄 Refresh échoué, marquer comme déconnecté')
            this.markAsLoggedOut()
            const errorMessage = this.extractErrorMessage(responseData, response.status)
            throw new ApiError(errorMessage, response.status, response)
          }
        }

        // Si la réponse n'est pas OK, créer une ApiError
        if (!response.ok) {
          const errorMessage = this.extractErrorMessage(responseData, response.status)
          throw new ApiError(errorMessage, response.status, response)
        } 

        return responseData
      } catch (error) {
        if (error instanceof ApiError) {
          throw error
        }
        
        if (error instanceof TypeError) {
          throw new ApiError('Network error occurred', 0)
        }
        
        throw error
      }
    }

    return makeRequest()
  }

  // Extraire le message d'erreur depuis la réponse du backend
  private extractErrorMessage(responseData: any, status: number): string {
  
    
    // 1 Réponse API standard avec message
    if (responseData && typeof responseData === 'object' && 'message' in responseData) {
      return responseData.message
    }

    // 2: Réponse avec detail (objet imbriqué)
    if (responseData && typeof responseData === 'object' && 'detail' in responseData) {
      const detail = responseData.detail
      if (detail && typeof detail === 'object' && 'message' in detail) {
        return detail.message
      }
      // Si detail est directement une string
      if (typeof detail === 'string') {
        return detail
      }
    }

    // 3: Réponse avec errors (validation)
    if (responseData && typeof responseData === 'object' && 'errors' in responseData) {
      const errors = responseData.errors
      if (typeof errors === 'object' && errors !== null) {
        const firstField = Object.keys(errors)[0]
        const firstError = errors[firstField]
        if (Array.isArray(firstError) && firstError.length > 0) {
          return firstError[0]
        }
      }
    }

    // 4: Réponse avec status_code et message (format spécifique)
    if (responseData && typeof responseData === 'object' && 'status_code' in responseData && 'message' in responseData) {
      return responseData.message
    }

    // 5: Réponse texte simple
    if (typeof responseData === 'string' && responseData.trim()) {
      return responseData.trim()
    }

    // 6: Si c'est un objet avec une propriété message directe
    if (responseData && typeof responseData === 'object') {
      const possibleMessageKeys = ['message', 'error', 'msg', 'description']
      for (const key of possibleMessageKeys) {
        if (key in responseData && typeof responseData[key] === 'string') {
          return responseData[key]
        }
      }
    }

    // 7: Fallback basé sur le status HTTP
    switch (status) {
      case 400:
        return 'Bad request'
      case 401:
        return 'Unauthorized'
      case 403:
        return 'Forbidden'
      case 404:
        return 'Not found'
      case 422:
        return 'Validation error'
      case 500:
        return 'Internal server error'
      default:
        return `HTTP error! status: ${status}`
    }
  }

  async get<T>(endpoint: string, options?: { withCredentials?: boolean }): Promise<T> {
    return this.request<T>(endpoint, { 
      method: 'GET'
    })
  }

  async post<T>(endpoint: string, data?: unknown, options?: { withCredentials?: boolean }): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async put<T>(endpoint: string, data?: unknown, options?: { withCredentials?: boolean }): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async delete<T>(endpoint: string, options?: { withCredentials?: boolean }): Promise<T> {
    return this.request<T>(endpoint, { 
      method: 'DELETE'
    })
  }
}

export const apiService = new ApiService()
export { ApiError }
