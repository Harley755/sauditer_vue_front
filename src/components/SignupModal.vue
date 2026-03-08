<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { X, Mail, Lock, User, Building, Shield, ChevronRight, Loader2 } from 'lucide-vue-next'
import { useRoleStore } from '@/stores/role'
import { useAuthStore } from '@/stores/auth'
import { useNotifications } from '@/composables/useNotifications'
import { useFormValidation, commonRules } from '@/composables/useFormValidation'
import type { Role } from '@/types/role'

interface Props {
  isOpen: boolean;
  userType?: string;
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success', data: { userType: string; formData: any }): void
  (e: 'switchToLogin'): void
}>()

const roleStore = useRoleStore()
const authStore = useAuthStore()
const { success, error, handleApiError } = useNotifications()

const step = ref<'select' | 'form'>('select')
const selectedRole = ref<Role | null>(null)
const isSubmitting = ref(false)

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  organization: '',
  role_id: ''
})

// Validation rules
const validationRules = computed(() => {
  const rules: any = {
    firstName: commonRules.name,
    lastName: commonRules.name,
    email: commonRules.email,
    password: commonRules.password
  }
  
  // Ajouter organization seulement si ce n'est pas un citoyen
  if (selectedRole.value?.code !== 'CITOYEN') {
    rules.organization = commonRules.required
  }
  
  return rules
})

const {
  errors,
  validateForm,
  setFieldTouched,
  clearAllErrors,
  markAllFieldsTouched,
  markAsSubmitted,
  getFieldError,
  isFieldInvalid
} = useFormValidation(formData.value, validationRules.value, () => selectedRole.value)

// Computed properties for role icons and colors
const getRoleIcon = (code: string) => {
  switch (code.toUpperCase()) {
    case 'CITOYEN':
      return User
    case 'RESPONSABLE':
      return Shield
    case 'AUDITOR':
      return Building
    default:
      return User
  }
}

const getRoleColor = (code: string) => {
  switch (code.toUpperCase()) {
    case 'CITOYEN':
      return 'from-cyan-500 to-blue-500'
    case 'RESPONSABLE':
      return 'from-blue-500 to-indigo-500'
    case 'AUDITOR':
      return 'from-indigo-500 to-purple-500'
    default:
      return 'from-gray-500 to-gray-600'
  }
}

// Fetch roles on component mount
onMounted(async () => {
  if (roleStore.availableRoles.length === 0) {
    await roleStore.fetchRoles()
  }
})

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.userType) {
      const role = roleStore.getRoleByCode(props.userType)
      if (role) {
        step.value = 'form'
        selectedRole.value = role
      }
    } else {
      step.value = 'select'
      selectedRole.value = null
    }
  }
})

const handleSelectRole = (role: Role) => {
  selectedRole.value = role
  console.log('Role sélectionné:', role)
  formData.value.role_id = role.id?.toString() || ''
  console.log('role_id assigné:', formData.value.role_id)
  step.value = 'form'
}

const handleSubmit = async () => {
  // Clear previous errors
  clearAllErrors()
  
  // Mark form as submitted to show errors
  markAsSubmitted()
  
  // Debug: voir les règles actuelles
  console.log('Validation rules:', validationRules.value)
  console.log('Form data:', formData.value)
  
  // Validate form
  if (!validateForm()) {
    console.log('Validation errors:', errors.value)
    error('Formulaire invalide', 'Veuillez corriger les erreurs ci-dessous')
    return
  }

  if (!selectedRole.value || !formData.value.role_id) {
    error('Veuillez sélectionner un type de compte')
    return
  }

  isSubmitting.value = true

  try {
    // Préparer les données pour l'API
    const registerData = {
      firstname: formData.value.firstName,
      lastname: formData.value.lastName,
      email: formData.value.email,
      password: formData.value.password,
      role_id: formData.value.role_id
    }

    // Appeler l'API d'inscription
    await authStore.register(registerData)
    
    // Succès
    success('Inscription réussie !', 'Bienvenue dans Sauditer.bj')
    
    // Émettre l'événement de succès
    emit('success', {
      userType: selectedRole.value.code,
      formData: formData.value
    })

  } catch (err: any) {
    // Gérer les erreurs avec le nouveau système
    handleApiError(err)
  } finally {
    isSubmitting.value = false
  }
}

const handleGoogleSignup = () => {
  if (selectedRole.value) {
    emit('success', {
      userType: selectedRole.value.code,
      formData: { ...formData.value, googleSignup: true }
    })
  }
}

const handleBack = () => {
  step.value = 'select'
  selectedRole.value = null
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop -->
        <div 
          class="fixed inset-0 bg-black/60 backdrop-blur-sm"
          @click="emit('close')"
        ></div>

        <!-- Modal Wrapper -->
        <div class="flex min-h-full items-center justify-center p-4">
          <Transition
            appear
            enter-active-class="transition duration-300 ease-out delay-75"
            enter-from-class="opacity-0 scale-95 translate-y-5"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-5"
          >
            <div 
              class="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-8 relative shadow-2xl my-8"
              @click.stop
            >
              <!-- Close button -->
              <button
                @click="emit('close')"
                class="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X class="w-5 h-5" />
              </button>

              <div v-if="step === 'select'">
                <!-- Type Selection -->
                <div class="text-center mb-8">
                  <div class="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <User class="w-7 h-7 text-white" />
                  </div>
                  <h2 class="text-white text-2xl mb-2 font-bold">Créer un compte</h2>
                  <p class="text-slate-400 text-sm">Choisissez le type de compte qui vous correspond</p>
                </div>

                <!-- Loading state -->
                <div v-if="roleStore.isLoading" class="flex justify-center py-8">
                  <Loader2 class="w-8 h-8 text-cyan-500 animate-spin" />
                </div>

                <!-- Error state -->
                <div v-else-if="roleStore.hasError" class="text-center py-8">
                  <p class="text-red-400 mb-4">{{ roleStore.errorMessage }}</p>
                  <button 
                    @click="roleStore.fetchRoles()"
                    class="text-cyan-400 hover:text-cyan-300 font-medium"
                  >
                    Réessayer
                  </button>
                </div>

                <!-- Roles list -->
                <div v-else class="grid gap-4">
                  <button
                    v-for="role in roleStore.availableRoles"
                    :key="role.id"
                    @click="handleSelectRole(role)"
                    class="w-full p-6 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-cyan-500/50 hover:bg-slate-800 transition-all text-left group"
                  >
                    <div class="flex items-center gap-4">
                      <div :class="`w-12 h-12 bg-gradient-to-br ${getRoleColor(role.code)} rounded-lg flex items-center justify-center flex-shrink-0`">
                        <component :is="getRoleIcon(role.code)" class="w-6 h-6 text-white" />
                      </div>
                      <div class="flex-1">
                        <h3 class="text-white mb-1 font-semibold">Compte {{ role.title }}</h3>
                        <p class="text-slate-400 text-sm">{{ role.description }}</p>
                      </div>
                      <ChevronRight class="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                    </div>
                  </button>
                </div>

                <p class="mt-6 text-center text-slate-400 text-sm">
                  Vous avez déjà un compte ?
                  <button 
                    type="button"
                    @click="emit('switchToLogin')" 
                    class="text-cyan-400 hover:text-cyan-300 transition-colors font-semibold"
                  >
                    Se connecter
                  </button>
                </p>
              </div>

              <div v-else>
                <!-- Signup Form -->
                <div v-if="selectedRole" class="text-center mb-8">
                  <button
                    @click="handleBack"
                    class="text-slate-400 hover:text-white transition-colors text-sm mb-4 flex items-center gap-1 mx-auto"
                  >
                    <ChevronRight class="w-4 h-4 rotate-180" />
                    Retour
                  </button>
                  <div :class="`w-14 h-14 bg-gradient-to-br ${getRoleColor(selectedRole.code)} rounded-xl flex items-center justify-center mx-auto mb-4`">
                    <component :is="getRoleIcon(selectedRole.code)" class="w-7 h-7 text-white" />
                  </div>
                  <h2 class="text-white text-2xl mb-2 font-bold">{{ selectedRole.title }}</h2>
                  <p class="text-slate-400 text-sm">{{ selectedRole.description }}</p>
                </div>

                <form @submit.prevent="handleSubmit" class="space-y-4">
                  <div class="grid md:grid-cols-2 gap-4">
                    <div>
                      <label class="text-slate-300 text-sm font-medium mb-1.5 block">Prénom</label>
                      <input
                        v-model="formData.firstName"
                        type="text"
                        placeholder="Jean"
                        required
                        @blur="setFieldTouched('firstName')"
                        class="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                        :class="{ 'border-red-500 focus:border-red-500': isFieldInvalid('firstName') }"
                      />
                      <p v-if="isFieldInvalid('firstName')" class="text-red-500 text-xs mt-1">
                        {{ getFieldError('firstName') }}
                      </p>
                    </div>
                    <div>
                      <label class="text-slate-300 text-sm font-medium mb-1.5 block">Nom</label>
                      <input
                        v-model="formData.lastName"
                        type="text"
                        placeholder="Dupont"
                        required
                        @blur="setFieldTouched('lastName')"
                        class="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                        :class="{ 'border-red-500 focus:border-red-500': isFieldInvalid('lastName') }"
                      />
                      <p v-if="isFieldInvalid('lastName')" class="text-red-500 text-xs mt-1">
                        {{ getFieldError('lastName') }}
                      </p>
                    </div>
                  </div>

                  <div v-if="selectedRole.code !== 'CITOYEN'">
                    <label class="text-slate-300 text-sm font-medium mb-1.5 block">Organisation</label>
                    <input
                      v-model="formData.organization"
                      type="text"
                      placeholder="Nom de votre organisation"
                      required
                      @blur="setFieldTouched('organization')"
                      class="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                      :class="{ 'border-red-500 focus:border-red-500': isFieldInvalid('organization') }"
                    />
                    <p v-if="isFieldInvalid('organization')" class="text-red-500 text-xs mt-1">
                      {{ getFieldError('organization') }}
                    </p>
                  </div>

                  <div>
                    <label class="text-slate-300 text-sm font-medium mb-1.5 block">Email professionnel</label>
                    <div class="relative">
                      <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        v-model="formData.email"
                        type="email"
                        placeholder="votre@email.com"
                        required
                        @blur="setFieldTouched('email')"
                        class="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                        :class="{ 'border-red-500 focus:border-red-500': isFieldInvalid('email') }"
                      />
                    </div>
                    <p v-if="isFieldInvalid('email')" class="text-red-500 text-xs mt-1">
                      {{ getFieldError('email') }}
                    </p>
                  </div>

                  <div>
                    <label class="text-slate-300 text-sm font-medium mb-1.5 block">Mot de passe</label>
                    <div class="relative">
                      <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        v-model="formData.password"
                        type="password"
                        placeholder="Minimum 8 caractères"
                        required
                        minlength="8"
                        @blur="setFieldTouched('password')"
                        class="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                        :class="{ 'border-red-500 focus:border-red-500': isFieldInvalid('password') }"
                      />
                    </div>
                    <p v-if="isFieldInvalid('password')" class="text-red-500 text-xs mt-1">
                      {{ getFieldError('password') }}
                    </p>
                    <p class="text-slate-500 text-[10px] mt-1">
                      Au moins 8 caractères avec majuscules, chiffres et symboles
                    </p>
                  </div>

                  <div class="pt-2">
                    <label class="flex items-start gap-3 text-slate-400 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        class="w-4 h-4 rounded border-slate-700 bg-slate-800/50 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0 mt-0.5"
                      />
                      <span>
                        J'accepte les 
                        <a href="#" class="text-cyan-400 hover:text-cyan-300 font-medium">conditions d'utilisation</a> 
                        et la 
                        <a href="#" class="text-cyan-400 hover:text-cyan-300 font-medium">politique de confidentialité</a>
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    :disabled="isSubmitting"
                    class="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all text-sm font-semibold mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
                    {{ isSubmitting ? 'Inscription...' : 'Créer mon compte' }}
                  </button>
                </form>

                <div class="my-6 flex items-center gap-4">
                  <div class="flex-1 h-px bg-slate-800" />
                  <span class="text-slate-500 text-sm font-medium">ou</span>
                  <div class="flex-1 h-px bg-slate-800" />
                </div>

                <button 
                  type="button"
                  @click="handleGoogleSignup"
                  class="w-full py-2.5 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800/50 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <svg class="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  S'inscrire avec Google
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
