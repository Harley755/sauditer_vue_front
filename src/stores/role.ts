import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Role, RoleState } from '@/types/role'
import { roleService } from '@/services/roleService'

export const useRoleStore = defineStore('role', () => {
  // State
  const roles = ref<Role[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const availableRoles = computed(() => roles.value)
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => !!error.value)
  const errorMessage = computed(() => error.value)

  // Actions
  const fetchRoles = async () => {
    loading.value = true
    error.value = null

    try {
      const data = await roleService.getUsualRoles()
      roles.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch roles'
      console.error('Error fetching roles:', err)
    } finally {
      loading.value = false
    }
  }

  const getRoleByCode = (code: string): Role | undefined => {
    return roles.value.find(role => role.code.toLowerCase() === code.toLowerCase())
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    roles,
    loading,
    error,
    // Getters
    availableRoles,
    isLoading,
    hasError,
    errorMessage,
    // Actions
    fetchRoles,
    getRoleByCode,
    clearError
  }
})
