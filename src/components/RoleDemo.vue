<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoleStore } from '@/stores/role'
import { Loader2, AlertCircle, CheckCircle } from 'lucide-vue-next'

const roleStore = useRoleStore()

onMounted(() => {
  roleStore.fetchRoles()
})

const statusIcon = computed(() => {
  if (roleStore.isLoading) return Loader2
  if (roleStore.hasError) return AlertCircle
  return CheckCircle
})

const statusColor = computed(() => {
  if (roleStore.isLoading) return 'text-cyan-500'
  if (roleStore.hasError) return 'text-red-500'
  return 'text-green-500'
})
</script>

<template>
  <div class="bg-slate-900 border border-slate-800 rounded-xl p-6">
    <h2 class="text-white text-xl font-semibold mb-4 flex items-center gap-2">
      <component :is="statusIcon" :class="['w-5 h-5', statusColor, roleStore.isLoading && 'animate-spin']" />
      Rôles disponibles
    </h2>
    
    <div v-if="roleStore.isLoading" class="text-slate-400">
      Chargement des rôles...
    </div>
    
    <div v-else-if="roleStore.hasError" class="text-red-400">
      <p class="mb-2">Erreur: {{ roleStore.errorMessage }}</p>
      <button 
        @click="roleStore.fetchRoles()"
        class="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
      >
        Réessayer
      </button>
    </div>
    
    <div v-else class="space-y-3">
      <div 
        v-for="role in roleStore.availableRoles" 
        :key="role.id"
        class="bg-slate-800 rounded-lg p-4"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-white font-medium">{{ role.title }}</h3>
            <p class="text-slate-400 text-sm">{{ role.description }}</p>
            <p class="text-cyan-400 text-sm mt-1">{{ role.code }}</p>
          </div>
          <div class="text-right">
            <p class="text-slate-500 text-sm">ID: {{ role.id.slice(0, 8) }}...</p>
            <p class="text-slate-500 text-sm">{{ new Date(role.created_at).toLocaleDateString() }}</p>
          </div>
        </div>
      </div>
      
      <div v-if="roleStore.availableRoles.length === 0" class="text-slate-400 text-center py-4">
        Aucun rôle disponible
      </div>
    </div>
  </div>
</template>
