<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-vue-next'
import { useQuestionnaireStore } from '@/stores/questionnaireStore'
import type { EnhancedReferential } from '@/types/questionnaire'
import { organizationSizes, isValidOrganizationSize } from '@/constants/organizationSize'
import { maturityLevels, isValidMaturityLevel } from '@/constants/maturityLevels'
import { getReferentialApiValue, isValidReferential } from '@/constants/referentialMapping'

const router = useRouter()
const questionnaireStore = useQuestionnaireStore()

const showContextModal = ref(false)
const selectedReferential = ref<EnhancedReferential | null>(null)
const contextForm = ref({
  secteur: '',
  taille: '',
  niveau_estime: ''
})
const isGenerating = ref(false)
const formError = ref<string | null>(null)

const sectors = [
  'Santé',
  'Finance',
  'Technologie',
  'Éducation',
  'Administration',
  'Industrie',
  'Commerce',
  'Autre'
]

const secteurPlaceholder = "ex: Banque, Santé, E-commerce, Administration publique"

onMounted(async () => {
  await questionnaireStore.fetchReferentials()
})

const validateForm = (): boolean => {
  formError.value = null
  
  // Validation du secteur
  if (!contextForm.value.secteur.trim()) {
    formError.value = 'Veuillez sélectionner un secteur d\'activité'
    return false
  }
  
  // Validation de la taille
  if (!contextForm.value.taille) {
    formError.value = 'Veuillez sélectionner une taille d\'organisation'
    return false
  }
  if (!isValidOrganizationSize(contextForm.value.taille)) {
    formError.value = 'Taille d\'organisation invalide'
    return false
  }
  
  // Validation du niveau
  if (!contextForm.value.niveau_estime) {
    formError.value = 'Veuillez sélectionner un niveau de maturité'
    return false
  }
  if (!isValidMaturityLevel(contextForm.value.niveau_estime)) {
    formError.value = 'Niveau de maturité invalide'
    return false
  }
  
  return true
}

const handleSelectReferential = (referential: EnhancedReferential) => {
  console.log("CLICK REFERENTIAL", referential.nom)
  
  if (!isValidReferential(referential.nom)) {
    formError.value = `Référentiel "${referential.nom}" non supporté par le backend`
    return
  }
  
  selectedReferential.value = referential
  showContextModal.value = true
  formError.value = null
}

const handleGenerateQuestionnaire = async () => {
  console.log("GENERATE QUESTIONNAIRE CLICKED")
  
  if (!selectedReferential.value) {
    console.log("NO SELECTED REFERENTIAL")
    return
  }
  
  if (!validateForm()) {
    console.log("FORM VALIDATION FAILED")
    return
  }
  
  console.log("FORM VALIDATION PASSED")
  isGenerating.value = true
  try {
    const payload = {
      referentiel: getReferentialApiValue(selectedReferential.value.nom),
      secteur: contextForm.value.secteur.trim(),
      taille: contextForm.value.taille,
      niveau_estime: contextForm.value.niveau_estime
    }
    
    console.log("PAYLOAD TO SEND:", payload)
    
    await questionnaireStore.generateQuestionnaire(payload)
    
    console.log("QUESTIONNAIRE GENERATED SUCCESSFULLY ", questionnaireStore.generateQuestionnaire(payload))
    
    showContextModal.value = false
    resetForm()
    router.push('/questionnaire')
  } catch (error) {
    console.error('Error generating questionnaire:', error)
    if (error instanceof Error) {
      formError.value = error.message
    } else {
      formError.value = 'Erreur lors de la génération du questionnaire'
    }
  } finally {
    isGenerating.value = false
  }
}

const resetForm = () => {
  contextForm.value = {
    secteur: '',
    taille: '',
    niveau_estime: ''
  }
  selectedReferential.value = null
  formError.value = null
}

const closeModal = () => {
  showContextModal.value = false
  resetForm()
}

const retryFetch = () => {
  questionnaireStore.fetchReferentials()
}
</script>

<template>
  <div class="min-h-screen bg-slate-950">
    <!-- Background decorations -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
    </div>

    <div class="relative container mx-auto px-6 py-8">
      <!-- Back Button -->
      <button
        @click="router.push('/dashboard')"
        class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm font-medium"
      >
        <ArrowLeft class="w-4 h-4" />
        Retour au tableau de bord
      </button>

      <!-- Header -->
      <div class="mb-12 text-center animate-in fade-in slide-in-from-bottom-5 duration-700">
        <h1 class="text-white text-4xl lg:text-5xl mb-4 font-bold tracking-tight">
          Choisissez un référentiel
        </h1>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">
          Sélectionnez le référentiel de conformité pour lequel vous souhaitez réaliser un audit
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="questionnaireStore.loading" class="flex flex-col items-center justify-center py-20">
        <Loader2 class="w-12 h-12 text-cyan-500 animate-spin mb-4" />
        <p class="text-slate-400 text-lg">Chargement des référentiels...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="questionnaireStore.error" class="max-w-2xl mx-auto">
        <div class="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
          <div class="flex gap-4">
            <AlertCircle class="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
            <div class="flex-1">
              <h3 class="text-red-400 font-semibold mb-2">Erreur de chargement</h3>
              <p class="text-slate-400 mb-4">{{ questionnaireStore.error }}</p>
              <button
                @click="retryFetch"
                class="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Referentials Grid -->
      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <button
          v-for="(referential, index) in questionnaireStore.referentials"
          :key="referential.nom"
          @click="handleSelectReferential(referential)"
          class="group bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-left hover:border-cyan-500/50 hover:bg-slate-900 transition-all animate-in fade-in slide-in-from-bottom-5 duration-700"
          :style="{ transitionDelay: `${index * 100}ms`, animationDelay: `${index * 100}ms` }"
        >
          <!-- Icon & Badge -->
          <div class="flex items-start justify-between mb-6">
            <div :class="`w-16 h-16 bg-gradient-to-br ${referential.meta.color} rounded-xl flex items-center justify-center text-3xl shadow-lg`">
              {{ referential.meta.icon }}
            </div>
            <ChevronRight class="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </div>

          <!-- Content -->
          <h3 class="text-white text-2xl mb-3 font-bold">{{ referential.nom }}</h3>
          <p class="text-slate-400 mb-6 leading-relaxed text-sm">
            {{ referential.description }}
          </p>

          <!-- Stats -->
          <div class="flex items-center gap-4 pt-4 border-t border-slate-800">
            <div class="flex items-center gap-2 text-slate-500 text-sm">
              <div class="w-2 h-2 bg-cyan-500 rounded-full" />
              Génération dynamique
            </div>
            <div class="flex items-center gap-2 text-slate-500 text-sm">
              <div class="w-2 h-2 bg-blue-500 rounded-full" />
              ~30-45 min
            </div>
          </div>
        </button>
      </div>

      <!-- Info Box -->
      <div class="mt-12 max-w-4xl mx-auto bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-500">
        <div class="flex gap-4">
          <div class="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <span class="text-cyan-400 text-xl">💡</span>
          </div>
          <div>
            <h4 class="text-white mb-2 font-semibold">Besoin d'aide pour choisir ?</h4>
            <p class="text-slate-400 text-sm leading-relaxed">
              Chaque référentiel correspond à des exigences spécifiques. L'ISO 27001 est idéal pour la gestion globale de la sécurité, 
              le RGPD pour la protection des données personnelles, NIS 2 pour les opérateurs de services essentiels, 
              SOC 2 pour les fournisseurs de services cloud, et PCI DSS pour le traitement des paiements par carte.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Context Modal -->
    <div v-if="showContextModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div class="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-8">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-white text-2xl font-bold mb-2">Personnaliser l'audit</h2>
            <p class="text-slate-400 text-sm">
              Configurez votre audit pour {{ selectedReferential?.nom }}
            </p>
          </div>
          <button
            @click="closeModal"
            class="text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft class="w-6 h-6" />
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleGenerateQuestionnaire" class="space-y-6">
          <!-- Secteur -->
          <div>
            <label class="block text-slate-300 text-sm font-medium mb-3">
              Secteur d'activité
            </label>
            <input
              v-model="contextForm.secteur"
              type="text"
              :placeholder="secteurPlaceholder"
              required
              class="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <!-- Taille -->
          <div>
            <label class="block text-slate-300 text-sm font-medium mb-3">
              Taille de l'organisation
            </label>
            <select
              v-model="contextForm.taille"
              required
              class="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="">Sélectionnez une taille</option>
              <option v-for="size in organizationSizes" :key="size.value" :value="size.value">
                {{ size.label }}
              </option>
            </select>
          </div>

          <!-- Niveau estimé -->
          <div>
            <label class="block text-slate-300 text-sm font-medium mb-3">
              Niveau de maturité estimé
            </label>
            <select
              v-model="contextForm.niveau_estime"
              required
              class="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="">Sélectionnez un niveau</option>
              <option v-for="level in maturityLevels" :key="level.value" :value="level.value">
                {{ level.label }}
              </option>
            </select>
          </div>

          <!-- Error Message -->
          <div v-if="formError" class="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div class="flex gap-3">
              <AlertCircle class="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p class="text-red-400 text-sm">{{ formError }}</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-4 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              :disabled="isGenerating || !contextForm.secteur || !contextForm.taille || !contextForm.niveau_estime || formError !== null"
              class="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Loader2 v-if="isGenerating" class="w-4 h-4 animate-spin" />
              {{ isGenerating ? 'Génération...' : 'Générer le questionnaire' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
