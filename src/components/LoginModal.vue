<script setup lang="ts">
import { ref, watch } from 'vue'
import { X, Mail, Lock, Shield, Loader2 } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useFormValidation, commonRules } from '@/composables/useFormValidation'
import { useToast } from '@/composables/useToast'

interface Props {
  isOpen: boolean;
  prefilledEmail?: string;
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success', userType: 'citizen' | 'manager' | 'auditor'): void
  (e: 'switchToSignup'): void
}>()

const authStore = useAuthStore()

const { success, error, info } = useToast()

const email = ref('')
const password = ref('')
const isSubmitting = ref(false)


// Pré-remplir l'email si fourni
watch(() => props.prefilledEmail, (newEmail) => {
  if (newEmail) {
    email.value = newEmail
  }
}, { immediate: true })

// Validation rules
const validationRules = {
  email: commonRules.email,
  password: commonRules.required
}

const {
  errors,
  validateForm,
  setFieldTouched,
  clearAllErrors,
  markAsSubmitted,
  getFieldError,
  isFieldInvalid
} = useFormValidation({ email, password }, validationRules)

const handleSubmit = async () => {
  // Clear previous errors
  clearAllErrors()
  
  // Mark form as submitted to show errors
  markAsSubmitted()
  
  // Validate form
  if (!validateForm()) {
    console.log('Validation failed - showing toast')
    error('Formulaire invalide', 'Veuillez corriger les erreurs ci-dessous')
    return
  }

  isSubmitting.value = true

  try {
    // Appeler l'API de login
    const response = await authStore.login({
      email: email.value,
      password: password.value
    })
    
    // Succès
    console.log('Login successful - showing success toast')
    success('Connexion réussie !', 'Bienvenue dans Sauditer.bj')
    
    // Émettre l'événement de succès avec le type d'utilisateur
    const userRole = authStore.userRole
    const validRole = userRole === 'citizen' || userRole === 'manager' || userRole === 'auditor' 
      ? userRole 
      : 'manager'
    emit('success', validRole)

  } catch (err: any) {
    // Gérer les erreurs avec vue-sonner
    console.log('Login error:', err)
    const errorMessage = 
      err?.detail?.message ||
      err?.response?.data?.message ||
      err?.message ||
      'Une erreur est survenue'
    const errorDescription = 
      err?.detail?.status_code ? `Erreur ${err.detail.status_code}` :
      'Veuillez réessayer plus tard'
    error(errorMessage, errorDescription)
  } finally {
    isSubmitting.value = false
  }
}

const handleGoogleLogin = () => {
  // TODO: Implémenter Google OAuth
  success('Connexion Google réussie !', 'Bienvenue dans Sauditer.bj')
  emit('success', 'manager')
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
              class="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-8 relative shadow-2xl"
              @click.stop
            >
              <!-- Close button -->
              <button
                @click="emit('close')"
                class="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X class="w-5 h-5" />
              </button>

              <!-- Header -->
              <div class="text-center mb-8">
                <div class="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield class="w-7 h-7 text-white" />
                </div>
                <h2 class="text-white text-2xl mb-2 font-bold">Connexion</h2>
                <p class="text-slate-400 text-sm">Accédez à votre espace sécurisé</p>
              </div>

              <!-- Form -->
              <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                  <label class="text-slate-300 text-sm font-medium mb-1.5 block">
                    Email
                  </label>
                  <div class="relative">
                    <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      v-model="email"
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
                  <label class="text-slate-300 text-sm font-medium mb-1.5 block">
                    Mot de passe
                  </label>
                  <div class="relative">
                    <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      v-model="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      @blur="setFieldTouched('password')"
                      class="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                      :class="{ 'border-red-500 focus:border-red-500': isFieldInvalid('password') }"
                    />
                  </div>
                  <p v-if="isFieldInvalid('password')" class="text-red-500 text-xs mt-1">
                    {{ getFieldError('password') }}
                  </p>
                </div>

                <div class="flex items-center justify-between text-sm font-medium">
                  <label class="flex items-center gap-2 text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      class="w-4 h-4 rounded border-slate-700 bg-slate-800/50 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0"
                    />
                    Se souvenir de moi
                  </label>
                  <a href="#" class="text-cyan-400 hover:text-cyan-300 transition-colors">
                    Mot de passe oublié ?
                  </a>
                </div>

                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all text-sm font-semibold mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
                  {{ isSubmitting ? 'Connexion...' : 'Se connecter' }}
                </button>
              </form>

              <!-- Divider -->
              <div class="my-6 flex items-center gap-4">
                <div class="flex-1 h-px bg-slate-800" />
                <span class="text-slate-500 text-sm">ou</span>
                <div class="flex-1 h-px bg-slate-800" />
              </div>

              <!-- SSO Options -->
              <div class="space-y-3">
                <button 
                  type="button"
                  @click="handleGoogleLogin"
                  class="w-full py-2.5 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800/50 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <svg class="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continuer avec Google
                </button>
              </div>

              <!-- Footer -->
              <p class="mt-6 text-center text-slate-400 text-sm">
                Pas encore de compte ? 
                <button 
                  type="button"
                  @click="emit('switchToSignup')" 
                  class="text-cyan-400 hover:text-cyan-300 transition-colors font-semibold"
                >
                  Créer un compte
                </button>
              </p>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
