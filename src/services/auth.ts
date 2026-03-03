import { apiService, ApiError } from './api'

export interface RegisterData {
  firstname: string
  lastname: string
  email: string
  password: string
  role_id: string
}

export interface RegisterResponse {
  message: string
  user?: {
    id: string
    email: string
    firstname: string
    lastname: string
    role: string
  }
  token?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface LoginResponse {
  message: string
  user: {
    id: string
    email: string
    firstname: string
    lastname: string
    role: string
  }
  token: string
}

export class AuthService {
  private readonly endpoint = '/auth'

  async register(data: RegisterData): Promise<RegisterResponse> {
    try {
      const response = await apiService.post<RegisterResponse>(`${this.endpoint}/register`, data)
      return response
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 409) {
          throw new Error('Cet email est déjà utilisé')
        } else if (error.status === 400) {
          throw new Error('Données invalides')
        } else if (error.status === 422) {
          throw new Error('Erreur de validation des données')
        }
        throw error
      }
      throw new Error('Erreur lors de l\'inscription')
    }
  }

  async login(data: LoginData): Promise<LoginResponse> {
    try {
      const response = await apiService.post<LoginResponse>(`${this.endpoint}/login`, data)
      return response
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          throw new Error('Email ou mot de passe incorrect')
        } else if (error.status === 400) {
          throw new Error('Données invalides')
        } else if (error.status === 422) {
          throw new Error('Erreur de validation des données')
        }
        throw error
      }
      throw new Error('Erreur lors de la connexion')
    }
  }
}

export const authService = new AuthService()
