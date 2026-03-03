<script setup lang="ts">
import { ref } from 'vue'
import SignupModal from '@/components/SignupModal.vue'
import RoleDemo from '@/components/RoleDemo.vue'

const isModalOpen = ref(false)
const selectedUserType = ref<string>()

const openModal = (userType?: string) => {
  selectedUserType.value = userType
  isModalOpen.value = true
}

const handleSignupSuccess = (userType: string) => {
  console.log('Signup successful with userType:', userType)
  isModalOpen.value = false
}

const handleClose = () => {
  isModalOpen.value = false
}

const switchToLogin = () => {
  console.log('Switch to login')
  isModalOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 flex items-center justify-center p-8">
    <div class="max-w-4xl w-full">
      <div class="text-center mb-8">
        <h1 class="text-white text-3xl font-bold mb-2">Test Signup Modal</h1>
        <p class="text-slate-400">Test du composant SignupModal avec les rôles dynamiques</p>
      </div>
      
      <div class="grid lg:grid-cols-2 gap-8">
        <!-- Test Section -->
        <div class="space-y-4">
          <h2 class="text-white text-xl font-semibold mb-4">Tests du Modal</h2>
          
          <button
            @click="openModal()"
            class="w-full px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Ouvrir le modal (sélection)
          </button>
          
          <div class="grid grid-cols-1 gap-3">
            <button
              @click="openModal('CITOYEN')"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Citoyen direct
            </button>
            <button
              @click="openModal('RESPONSABLE')"
              class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Responsable direct
            </button>
            <button
              @click="openModal('AUDITOR')"
              class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Auditeur direct
            </button>
          </div>
        </div>
        
        <!-- Role Demo Section -->
        <div>
          <RoleDemo />
        </div>
      </div>
    </div>

    <SignupModal
      :is-open="isModalOpen"
      :user-type="selectedUserType"
      @close="handleClose"
      @success="handleSignupSuccess"
      @switch-to-login="switchToLogin"
    />
  </div>
</template>
