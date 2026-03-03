import { apiService } from './api'
import type { Role } from '@/types/role'

export interface CreateRoleData {
  title: string
  code: string
  description: string
  permissions?: string[]
}

export interface UpdateRoleData extends Partial<CreateRoleData> {
  id: string
}

class RoleService {
  private readonly endpoint = '/roles'

  async getUsualRoles(): Promise<Role[]> {
    return apiService.get<Role[]>(`${this.endpoint}/index-usual-role`)
  }

  async getAllRoles(): Promise<Role[]> {
    return apiService.get<Role[]>(`${this.endpoint}/index`)
  }

  async getRoleById(id: string): Promise<Role> {
    return apiService.get<Role>(`${this.endpoint}/show/${id}`)
  }

  async createRole(data: CreateRoleData): Promise<Role> {
    return apiService.post<Role>(`${this.endpoint}/store`, data)
  }

  async updateRole(data: UpdateRoleData): Promise<Role> {
    return apiService.put<Role>(`${this.endpoint}/update/${data.id}`, data)
  }

  async deleteRole(id: string): Promise<void> {
    return apiService.delete<void>(`${this.endpoint}/delete/${id}`)
  }
}

export const roleService = new RoleService()
