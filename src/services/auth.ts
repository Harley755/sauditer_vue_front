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
    const response = await apiService.post<RegisterResponse>(`${this.endpoint}/register`, data)
    return response
  }

  async login(data: LoginData): Promise<LoginResponse> {
    const response = await apiService.post<LoginResponse>(`${this.endpoint}/login`, data)
    return response
  }
}

export const authService = new AuthService()
