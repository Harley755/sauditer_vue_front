import { apiService, ApiError } from './api'

export interface RegisterData {
  first_name: string
  last_name: string
  organisation: string
  email: string
  password: string
  role_id: string
}

export interface RegisterResponse {
  message: string
  data?: {
    id: string
    email: string
    first_name: string
    last_name: string
    role: string
  }
}

export interface LoginData {
  email: string
  password: string
}

export interface LoginResponse {
  message: string
  data: {
    id: string
    email: string
    first_name: string
    last_name: string
    role: string
  }
}

export interface RefreshResponse {
  message: string
}

// Interface pour la réponse de /users/me (backend FastAPI)
export interface UserResponse {
  id: string
  first_name: string
  last_name: string
  email: string
  roles: Array<{
    name: string
    permissions?: Array<{
      code: string
      title: string
    }>
  }>
  created_at: string
  updated_at: string
  fullname?: string  // Champ calculé par le backend
}

export class AuthService {
  private readonly endpoint = '/auth'
  
  async register(data: RegisterData): Promise<RegisterResponse> {
    const response = await apiService.post<RegisterResponse>(`${this.endpoint}/register`, data)
    return response
  }

  async login(data: LoginData): Promise<LoginResponse> {
    const response = await apiService.post<LoginResponse>(`${this.endpoint}/login`, data, {
      withCredentials: true // Important pour les cookies HttpOnly
    })
    return response
  }

  async logout(): Promise<void> {
    await apiService.post(`${this.endpoint}/logout`, {}, {
      withCredentials: true
    })
  }

  async refreshToken(): Promise<RefreshResponse> {
    const response = await apiService.post<RefreshResponse>(`${this.endpoint}/refresh`, {}, {
      withCredentials: true
    })
    return response
  }

  // Endpoint pour récupérer les infos utilisateur depuis /api/users/me
  async getCurrentUser(): Promise<{ data: UserResponse }> {
    const response = await apiService.get<{ data: UserResponse }>('/users/me', {
      withCredentials: true
    })
    return response
  }

  // Endpoint de debug pour vérifier les cookies
  async debugTokens(): Promise<{ access_token?: string; refresh_token?: string }> {
    const response = await apiService.get<{ access_token?: string; refresh_token?: string }>(`${this.endpoint}/debug/tokens`, {
      withCredentials: true
    })
    return response
  }
}

export const authService = new AuthService()
