<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  MinusCircle, 
  AlertCircle,
  FileText,
  Save
} from 'lucide-vue-next'
import { useAuditStore } from '@/stores/audit'
import { referentials } from '@/data/referentials'

const router = useRouter()
const auditStore = useAuditStore()

const currentQuestionIndex = ref(0)
const selectedAnswer = ref<'yes' | 'no' | 'partial' | 'na' | null>(null)
const notes = ref('')
const showNotes = ref(false)

// Get current referential
const referential = computed(() => 
  referentials.find(r => r.id === auditStore.currentAudit?.referentialId)
)

onMounted(() => {
  if (!auditStore.currentAudit || !referential.value) {
    router.push('/audit-selection')
    return
  }
  loadExistingAnswer()
})

const loadExistingAnswer = () => {
  if (!referential.value || !auditStore.currentAudit) return

  const existingAnswer = auditStore.currentAudit.answers.find(
    a => a.questionId === referential.value?.questions[currentQuestionIndex.value].id
  )
  
  if (existingAnswer) {
    selectedAnswer.value = existingAnswer.answer
    notes.value = existingAnswer.notes || ''
    showNotes.value = !!existingAnswer.notes
  } else {
    selectedAnswer.value = null
    notes.value = ''
    showNotes.value = false
  }
}

watch(currentQuestionIndex, () => {
  loadExistingAnswer()
})

const currentQuestion = computed(() => referential.value?.questions[currentQuestionIndex.value])
const progress = computed(() => referential.value ? ((currentQuestionIndex.value + 1) / referential.value.questions.length) * 100 : 0)

const handleAnswer = (answer: 'yes' | 'no' | 'partial' | 'na') => {
  selectedAnswer.value = answer
}

const handleNext = () => {
  if (selectedAnswer.value && currentQuestion.value) {
    auditStore.answerQuestion(currentQuestion.value.id, selectedAnswer.value, notes.value)
    
    if (referential.value && currentQuestionIndex.value < referential.value.questions.length - 1) {
      currentQuestionIndex.value++
    } else {
      router.push('/results')
    }
  }
}

const handlePrevious = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

const handleSaveAndExit = () => {
  if (selectedAnswer.value && currentQuestion.value) {
    auditStore.answerQuestion(currentQuestion.value.id, selectedAnswer.value, notes.value)
  }
  router.push('/dashboard')
}

const answerOptions = [
  { value: 'yes' as const, label: 'Oui', icon: CheckCircle, color: 'text-emerald-400', borderColor: 'border-emerald-500', bgColor: 'bg-emerald-500/10' },
  { value: 'partial' as const, label: 'Partiel', icon: MinusCircle, color: 'text-yellow-400', borderColor: 'border-yellow-500', bgColor: 'bg-yellow-500/10' },
  { value: 'no' as const, label: 'Non', icon: XCircle, color: 'text-red-400', borderColor: 'border-red-500', bgColor: 'bg-red-500/10' },
  { value: 'na' as const, label: 'N/A', icon: AlertCircle, color: 'text-slate-400', borderColor: 'border-slate-500', bgColor: 'bg-slate-500/10' }
]
</script>

<template>
  <div v-if="auditStore.currentAudit && referential" class="min-h-screen bg-slate-950">
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
              <div class="text-slate-400 text-xs font-medium">
                Question {{ currentQuestionIndex + 1 }} / {{ referential.questions.length }}
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
            <span class="text-xl">{{ referential.icon }}</span>
            <span class="text-white text-sm font-semibold">{{ referential.name }}</span>
            <span class="text-slate-600 text-xs">•</span>
            <span class="text-slate-400 text-xs font-medium">{{ currentQuestion?.category }}</span>
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

                <!-- Answer Options -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    v-for="option in answerOptions"
                    :key="option.value"
                    @click="handleAnswer(option.value)"
                    class="p-6 rounded-xl border-2 transition-all group relative overflow-hidden"
                    :class="[
                      selectedAnswer === option.value
                        ? `${option.borderColor} ${option.bgColor} scale-[1.02] shadow-lg`
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'
                    ]"
                  >
                    <component 
                      :is="option.icon" 
                      class="w-10 h-10 mx-auto mb-3 transition-transform duration-300 group-hover:scale-110" 
                      :class="[selectedAnswer === option.value ? option.color : 'text-slate-500']"
                    />
                    <div 
                      class="text-xs font-bold uppercase tracking-wider text-center"
                      :class="[selectedAnswer === option.value ? option.color : 'text-slate-400']"
                    >
                      {{ option.label }}
                    </div>
                  </button>
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
                  :disabled="!selectedAnswer"
                  class="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-xl hover:shadow-cyan-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-bold"
                >
                  <span v-if="currentQuestionIndex < referential.questions.length - 1">Suivant</span>
                  <span v-else>Terminer l'audit</span>
                  <ArrowRight v-if="currentQuestionIndex < referential.questions.length - 1" class="w-4 h-4" />
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
