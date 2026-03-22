<script setup lang="ts">
import { ref, computed, watch, onMounted, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  MinusCircle, 
  AlertCircle,
  FileText,
  Save,
  Loader2
} from 'lucide-vue-next'
import { useAuditStore } from '@/stores/audit'
import { useQuestionnaireStore } from '@/stores/questionnaireStore'
import { useAuthStore } from '@/stores/auth'
import { questionnaireService } from '@/services/questionnaireService'

const router = useRouter()
const auditStore = useAuditStore()
const questionnaireStore = useQuestionnaireStore()
const authStore = useAuthStore()  // ← AJOUT CRUCIAL

const currentQuestionIndex = ref(0)
const selectedValue = ref<string | null>(null)
const textAnswer = ref('')
const notes = ref('')
const showNotes = ref(false)
const isInitialized = ref(false)

// Computed properties dynamiques
const isLoading = computed(() => questionnaireStore.loading)
const currentQuestionnaire = computed(() => questionnaireStore.currentQuestionnaire)
const currentQuestion = computed(() => {
  const questionnaire = currentQuestionnaire.value
  if (!questionnaire || !questionnaire.questions[currentQuestionIndex.value]) {
    return null
  }
  
  const question = questionnaire.questions[currentQuestionIndex.value]
  console.log("CURRENT QUESTION:", question)
  return question
})

const progress = computed(() => {
  const questionnaire = currentQuestionnaire.value
  if (!questionnaire) return 0
  return ((currentQuestionIndex.value + 1) / questionnaire.questions.length) * 100
})

const totalQuestions = computed(() => {
  return currentQuestionnaire.value?.questions.length || 0
})

const isLastQuestion = computed(() => {
  const questionnaire = currentQuestionnaire.value
  if (!questionnaire) return false
  return currentQuestionIndex.value >= questionnaire.questions.length - 1
})

const isQualitative = computed(() => {
  return !currentQuestion.value?.options || currentQuestion.value.options.length === 0
})

const referentialMeta = computed(() => {
  if (!currentQuestionnaire.value) return null
  return {
    icon: questionnaireService.getReferentialIcon(currentQuestionnaire.value.referentiel?.nom || ''),
    name: currentQuestionnaire.value.referentiel?.nom || ''
  }
})

onMounted(() => {
  console.log("QUESTIONNAIRE MOUNTED:", currentQuestionnaire.value)
  console.dir("QUESTIONNAIRE COMPLET:", currentQuestionnaire.value)
  
  if (!currentQuestionnaire.value) {
    console.log("NO QUESTIONNAIRE - REDIRECTING")
    router.push('/audit-selection')
    return
  }
  
  // Détection de session corrompue
  if (auditStore.currentAudit && auditStore.currentAudit.answers.length > currentQuestionnaire.value.questions.length) {
    console.log("DETECTING CORRUPTED SESSION - CLEARING")
    auditStore.clearCorruptedSession()
  }
  
  // Initialiser l'audit automatiquement si ce n'est pas déjà fait
  if (!auditStore.currentAudit) {
    console.log("INITIALIZING NEW AUDIT FOR:", currentQuestionnaire.value.referentiel?.nom)
    auditStore.startAudit(currentQuestionnaire.value.referentiel?.nom || '')
  } else {
    console.log("AUDIT ALREADY EXISTS:", auditStore.currentAudit)
  }
  
  isInitialized.value = true
  loadExistingAnswer()
})

// Watch pour charger la réponse quand la question change
watch(currentQuestionIndex, () => {
  console.log("QUESTION INDEX CHANGED:", currentQuestionIndex.value)
  loadExistingAnswer()
})

// Watch pour les changements de questionnaire avec debug complet
watch(currentQuestionnaire, (questionnaire) => {
  if (!questionnaire) return

  console.log("===== QUESTIONNAIRE CHARGÉ =====")
  console.log("Référentiel :", questionnaire.referentiel?.nom)
  console.log("Nombre de questions :", questionnaire.questions.length)

  console.log("===== LISTE DES QUESTIONS =====")

  questionnaire.questions.forEach((q, index) => {
    console.log(`Question ${index + 1}`)
    console.log("ID:", q.id)
    console.log("Domaine:", q.domaine)
    console.log("Question:", q.question)
    console.log("Options:", q.options)
    console.log("Type:", q.type)
    console.log("-----------------------------")
  })
  
  if (isInitialized.value) {
    loadExistingAnswer()
  }
})

const resetAnswers = () => {
  console.log("RESETTING ANSWERS")
  selectedValue.value = null
  textAnswer.value = ''
  notes.value = ''
  showNotes.value = false
}

const loadExistingAnswer = () => {
  if (!currentQuestionnaire.value || !currentQuestion.value) {
    resetAnswers()
    return
  }

  const questionId = currentQuestion.value.id
  console.log("LOADING EXISTING ANSWER FOR:", questionId)

  const existingAnswer = auditStore.currentAudit?.answers.find(
    a => a.questionId === questionId
  )
  
  if (existingAnswer) {
    console.log("FOUND EXISTING ANSWER:", existingAnswer)
    
    if (isQualitative.value) {
      textAnswer.value = existingAnswer.answer
    } else {
      selectedValue.value = existingAnswer.answer
    }
    
    notes.value = existingAnswer.notes || ''
    showNotes.value = !!existingAnswer.notes
  } else {
    console.log("NO EXISTING ANSWER FOUND")
    resetAnswers()
  }
}

watch(currentQuestionIndex, () => {
  loadExistingAnswer()
})

// Suppression des fonctions de gestion spécifiques aux types
// Maintenant tout est géré via les options dynamiques ou le textarea pour les qualitatives

const handleIDontKnow = () => {
  textAnswer.value = 'Je ne sais pas'
}

// Fonction pour soumettre les réponses à l'API
async function submitAnswers(payload: any) {
  const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL as string) || 'http://localhost:8001'
  
  try {
    // Créer les headers avec le user_id dynamique
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }
    
    // Ajouter le user_id si l'utilisateur est connecté
    if (authStore.user?.id) {
      headers['x-user-id'] = authStore.user.id
    }
    
    const response = await fetch(`${API_BASE_URL}/api/v1/questionnaires/submit-answers`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    console.log("SUBMIT ANSWERS SUCCESS:", result)
    return result
  } catch (error) {
    console.error('SUBMIT ANSWERS ERROR:', error)
    throw error
  }
}

const getAnswerValue = (): string => {
  if (isQualitative.value) {
    return textAnswer.value
  }
  return selectedValue.value || ''
}

const isAnswerValid = (): boolean => {
  if (isQualitative.value) {
    return textAnswer.value.trim().length > 0
  }
  return selectedValue.value !== null
}

const saveCurrentAnswer = () => {
  if (!currentQuestion.value) {
    console.log("NO CURRENT QUESTION - CANNOT SAVE")
    return false
  }

  const answerValue = getAnswerValue()
  console.log("SAVING ANSWER:", {
    questionId: currentQuestion.value.id,
    answer: answerValue,
    notes: notes.value
  })

  auditStore.answerQuestion(currentQuestion.value.id, answerValue, notes.value)
  
  // Debug du store après sauvegarde
  console.log("STORE ANSWERS AFTER SAVE:", auditStore.currentAudit?.answers)
  
  return true
}

const handleNext = () => {
  console.log("HANDLE NEXT CALLED")
  
  if (!currentQuestion.value || !isAnswerValid()) {
    console.log("INVALID ANSWER - CANNOT PROCEED")
    return
  }

  // Sauvegarder la réponse actuelle
  if (!saveCurrentAnswer()) {
    return
  }

  // Navigation
  if (!isLastQuestion.value) {
    console.log("GOING TO NEXT QUESTION")
    currentQuestionIndex.value++
  } else {
    console.log("LAST QUESTION - SUBMITTING ANSWERS")
    
    // Vérifier que toutes les questions ont une réponse
    const totalQuestions = questionnaireStore.currentQuestionnaire?.questions.length || 0
    const totalAnswers = auditStore.currentAudit?.answers.length || 0

    console.log("VALIDATION:", { totalQuestions, totalAnswers })

    if (totalAnswers !== totalQuestions) {
      alert("Veuillez répondre à toutes les questions avant de terminer l'audit.")
      return
    }

    // Debug du store avant construction du payload
    console.log("FINAL ANSWERS:", auditStore.currentAudit?.answers)
    
    // Transformer les réponses pour l'API
    const reponses = auditStore.currentAudit?.answers?.map(a => {
      const r: any = {
        question_id: a.questionId,
        valeur: a.answer
      }

      if (a.notes && a.notes.trim() !== "") {
        r.commentaire = a.notes
      }

      return r
    }) || []

    const payload = {
      questionnaire_id: questionnaireStore.currentQuestionnaire?.id || '',
      user_id: authStore.user?.id || '',  // ← AJOUT CRUCIAL
      reponses
    }

    console.log("===== PAYLOAD SUBMIT ANSWERS =====")
    console.log(JSON.stringify(payload, null, 2))
    console.log("NOMBRE DE RÉPONSES:", reponses.length)

    // Soumettre les réponses à l'API
    submitAnswers(payload)
      .then(() => {
        console.log("ANSWERS SUBMITTED SUCCESSFULLY")
        auditStore.completeAudit()
        router.push({
          name: 'Results',
          query: {
            questionnaire_id: payload.questionnaire_id
          }
        })
      })
      .catch((error) => {
        console.error("FAILED TO SUBMIT ANSWERS:", error)
        // Même en cas d'erreur, on continue vers les résultats
        auditStore.completeAudit()
        router.push({
          name: 'Results',
          query: {
            questionnaire_id: payload.questionnaire_id
          }
        })
      })
  }
}

const handlePrevious = () => {
  console.log("HANDLE PREVIOUS CALLED")
  
  // Sauvegarder la réponse actuelle avant de reculer
  if (currentQuestion.value && isAnswerValid()) {
    saveCurrentAnswer()
  }
  
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

const handleSaveAndExit = () => {
  console.log("HANDLE SAVE AND EXIT CALLED")
  
  // Sauvegarder la réponse actuelle
  if (currentQuestion.value && isAnswerValid()) {
    saveCurrentAnswer()
  }
  
  router.push('/dashboard')
}

// Suppression des options statiques - tout vient de l'API
</script>

<template>
  <!-- Loading State -->
  <div v-if="!isInitialized || isLoading" class="min-h-screen bg-slate-950 flex items-center justify-center">
    <div class="text-center">
      <Loader2 class="w-12 h-12 text-cyan-500 animate-spin mx-auto mb-4" />
      <p class="text-slate-400 text-lg">Chargement du questionnaire...</p>
    </div>
  </div>

  <!-- Main Content -->
  <div v-else-if="currentQuestionnaire && referentialMeta && currentQuestion" class="min-h-screen bg-slate-950">
    <!-- Background decorations -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
    </div>

    <div class="relative">
      <!-- Header with Progress -->
      <div class="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div class="container mx-auto px-6 py-4">
          <div class="flex items-center justify-between mb-4">
            <button
              @click="handleSaveAndExit"
              class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
            >
              <ArrowLeft class="w-4 h-4" />
              Sauvegarder et quitter
            </button>
            
            <div class="flex items-center gap-3">
              <div class="text-slate-400 text-sm font-medium">
                Question {{ currentQuestionIndex + 1 }} / {{ totalQuestions }}
              </div>
              <button
                @click="handleSaveAndExit"
                class="p-2 text-slate-400 hover:text-white transition-colors"
                title="Sauvegarder"
              >
                <Save class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="relative h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              class="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300"
              :style="{ width: `${progress}%` }"
            />
          </div>

          <!-- Referential Badge -->
          <div class="mt-4 flex items-center gap-2">
            <span class="text-xl">{{ referentialMeta.icon }}</span>
            <span class="text-white text-sm font-semibold">{{ referentialMeta.name }}</span>
            <span class="text-slate-600 text-sm">•</span>
            <span class="text-slate-400 text-sm font-medium">{{ currentQuestion?.domaine }}</span>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="container mx-auto px-6 py-12">
        <div class="max-w-4xl mx-auto">
          <Transition
            mode="out-in"
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 translate-x-5"
            enter-to-class="opacity-100 translate-x-0"
            leave-active-class="transition duration-300 ease-in"
            leave-from-class="opacity-100 translate-x-0"
            leave-to-class="opacity-0 -translate-x-5"
          >
            <div :key="currentQuestionIndex">
              <!-- Question -->
              <div class="bg-slate-900/50 border border-slate-800 rounded-xl p-8 mb-6 shadow-xl">
                <div class="flex items-start gap-4 mb-8">
                  <div class="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/20">
                    <FileText class="w-6 h-6 text-white" />
                  </div>
                  <div class="flex-1">
                    <h2 class="text-white text-2xl mb-3 leading-relaxed font-bold tracking-tight">
                      {{ currentQuestion?.question }}
                    </h2>
                    <p v-if="currentQuestion?.description" class="text-slate-400 leading-relaxed text-sm">
                      {{ currentQuestion?.description }}
                    </p>
                  </div>
                </div>

                <!-- Dynamic Answer Options -->
                <div v-if="!isQualitative && currentQuestion?.options?.length" class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    v-for="option in currentQuestion.options"
                    :key="option"
                    @click="selectedValue = option"
                    class="p-6 rounded-xl border-2 transition-all group relative overflow-hidden"
                    :class="[
                      selectedValue === option
                        ? 'border-cyan-500 bg-cyan-500/10 scale-[1.02] shadow-lg'
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'
                    ]"
                  >
                    <div class="w-10 h-10 mx-auto mb-3 rounded-full border-2 flex items-center justify-center transition-all duration-300"
                      :class="[
                        selectedValue === option
                          ? 'border-cyan-500 bg-cyan-500'
                          : 'border-slate-600'
                      ]"
                    >
                      <div v-if="selectedValue === option" class="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <div 
                      class="text-sm font-bold uppercase tracking-wider text-center"
                      :class="[
                        selectedValue === option ? 'text-cyan-400' : 'text-slate-400'
                      ]"
                    >
                      {{ option }}
                    </div>
                  </button>
                </div>

                <!-- Qualitative Answer -->
                <div v-else-if="isQualitative" class="space-y-4">
                  <div>
                    <label class="block text-slate-300 text-sm font-medium mb-3">
                      Veuillez décrire votre processus ou votre pratique actuelle
                    </label>
                    <textarea
                      v-model="textAnswer"
                      placeholder="Décrivez en détail votre approche, vos méthodes, vos outils..."
                      rows="4"
                      class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                    ></textarea>
                  </div>
                  
                  <button
                    @click="handleIDontKnow"
                    class="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    Je ne sais pas
                  </button>
                </div>

                <!-- Fallback for questions without options and not qualitative -->
                <div v-else class="text-center py-8">
                  <div class="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle class="w-8 h-8 text-slate-600" />
                  </div>
                  <h3 class="text-white text-lg font-semibold mb-2">Options non disponibles</h3>
                  <p class="text-slate-400 text-sm">Cette question n'a pas d'options de réponse définies</p>
                </div>
              </div>

              <!-- Notes Section -->
              <div class="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-6">
                <button
                  @click="showNotes = !showNotes"
                  class="flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-2 text-sm font-semibold"
                >
                  <FileText class="w-4 h-4 text-cyan-500" />
                  <span>Ajouter des notes (optionnel)</span>
                </button>

                <Transition
                  enter-active-class="transition-[max-height,opacity] duration-300 ease-out overflow-hidden"
                  enter-from-class="max-h-0 opacity-0"
                  enter-to-class="max-h-[300px] opacity-100"
                  leave-active-class="transition-[max-height,opacity] duration-300 ease-in overflow-hidden"
                  leave-from-class="max-h-[300px] opacity-100"
                  leave-to-class="max-h-0 opacity-0"
                >
                  <div v-if="showNotes" class="pt-4">
                    <textarea
                      v-model="notes"
                      placeholder="Ajoutez des précisions, contexte ou actions à prévoir..."
                      rows="4"
                      class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                    ></textarea>
                  </div>
                </Transition>
              </div>

              <!-- Navigation -->
              <div class="flex items-center justify-between gap-4">
                <button
                  @click="handlePrevious"
                  :disabled="currentQuestionIndex === 0"
                  class="px-6 py-3 border border-slate-700 text-slate-300 rounded-lg hover:border-slate-600 hover:bg-slate-900/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-bold"
                >
                  <ArrowLeft class="w-4 h-4" />
                  Précédent
                </button>

                <button
                  @click="handleNext"
                  :disabled="!isAnswerValid()"
                  class="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-xl hover:shadow-cyan-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-bold"
                >
                  <span v-if="!isLastQuestion">Suivant</span>
                  <span v-else>Terminer l'audit</span>
                  <ArrowRight v-if="!isLastQuestion" class="w-4 h-4" />
                  <CheckCircle v-else class="w-4 h-4" />
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>
