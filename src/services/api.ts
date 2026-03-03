const API_BASE_URL = 'http://127.0.0.1:8000/api'

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
      ...options,
    }

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

      // Si la réponse n'est pas OK, créer une ApiError avec les données du backend
      if (!response.ok) {
        const errorMessage = this.extractErrorMessage(responseData, response.status)
        
        throw new ApiError(
          errorMessage,
          response.status,
          response
        )
      } 

      return responseData
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      if (error instanceof TypeError) {
        throw new ApiError('Network error occurred', 0)
      }
      
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        0
      )
    }
  }

  // Extraire le message d'erreur depuis la réponse du backend
  private extractErrorMessage(responseData: any, status: number): string {
  
    
    // Cas 1: Réponse API standard avec message
    if (responseData && typeof responseData === 'object' && 'message' in responseData) {
      return responseData.message
    }

    // Cas 2: Réponse avec detail (objet imbriqué)
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

    // Cas 3: Réponse avec errors (validation)
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

    // Cas 4: Réponse avec status_code et message (format spécifique)
    if (responseData && typeof responseData === 'object' && 'status_code' in responseData && 'message' in responseData) {
      return responseData.message
    }

    // Cas 5: Réponse texte simple
    if (typeof responseData === 'string' && responseData.trim()) {
      return responseData.trim()
    }

    // Cas 6: Si c'est un objet avec une propriété message directe
    if (responseData && typeof responseData === 'object') {
      const possibleMessageKeys = ['message', 'error', 'msg', 'description']
      for (const key of possibleMessageKeys) {
        if (key in responseData && typeof responseData[key] === 'string') {
          return responseData[key]
        }
      }
    }

    // Cas 7: Fallback basé sur le status HTTP
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

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export const apiService = new ApiService()
export { ApiError }
