<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  Play, 
  FileText, 
  TrendingUp,
  AlertCircle,
  Loader2,
  BarChart3,
  Eye,
  RefreshCw
} from 'lucide-vue-next'


import { useAuthStore } from '@/stores/auth'
import { useQuestionnaireStore } from '@/stores/questionnaireStore'
import { questionnaireService } from '@/services/questionnaireService'
import type { AuditListItem, AuditListResponse } from '@/types/questionnaire'
import { useAuditStore } from '@/stores/audit'


const router = useRouter()
const authStore = useAuthStore()
const auditStore = useAuditStore()
const questionnaireStore = useQuestionnaireStore()

const completedAudits = ref<AuditListItem[]>([])
const inProgressAudits = ref<AuditListItem[]>([])
const localAudits = ref<AuditListItem[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const activeTab = ref<'in-progress' | 'completed'>('in-progress')

const currentAudits = computed(() => 
  activeTab.value === 'in-progress' ? inProgressAudits.value : completedAudits.value
)

const hasAudits = computed(() => currentAudits.value.length > 0)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusColor = (status: string) => {
  const colors = {
    'active': 'from-blue-500 to-cyan-600',
    'processing': 'from-yellow-500 to-orange-600',
    'analyse_pending': 'from-purple-500 to-indigo-600',
    'completed': 'from-green-500 to-emerald-600',
    'failed': 'from-red-500 to-pink-600',
    'draft': 'from-gray-500 to-slate-600'
  }
  return colors[status as keyof typeof colors] || 'from-gray-500 to-slate-600'
}

const getStatusIcon = (status: string) => {
  const icons = {
    'active': Play,
    'processing': Loader2,
    'analyse_pending': Clock,
    'completed': CheckCircle,
    'failed': AlertCircle,
    'draft': FileText
  }
  return icons[status as keyof typeof icons] || FileText
}

const getStatusLabel = (status: string) => {
  const labels = {
    'active': 'En cours',
    'processing': 'En traitement',
    'analyse_pending': 'Analyse en attente',
    'completed': 'Terminé',
    'failed': 'Échoué',
    'draft': 'Brouillon'
  }
  return labels[status as keyof typeof labels] || status
}

const handleResumeAudit = (audit: AuditListItem) => {
  // Rediriger vers la page questionnaire avec l'ID de l'audit
  router.push(`/questionnaire?questionnaire_id=${audit.id}`)
}

const handleViewResults = (audit: AuditListItem) => {
  // Rediriger vers la page de résultats
  router.push(`/results?questionnaire_id=${audit.id}`)
}

const loadAudits = async () => {
  if (!authStore.isAuthenticated) {
    router.push('/')
    return
  }

  isLoading.value = true
  error.value = null

  try {
    // Charger les deux types d'audits en parallèle
    const [completedResponse, inProgressResponse] = await Promise.all([
      questionnaireService.getCompletedAudits(50, 0),
      questionnaireService.getInProgressAudits(50, 0)
    ])

    completedAudits.value = completedResponse.audits
    inProgressAudits.value = inProgressResponse.audits

    console.log('✅ Audits chargés:', {
      completed: completedAudits.value.length,
      inProgress: inProgressAudits.value.length
    })

  } catch (err: any) {
    console.error('❌ Erreur lors du chargement des audits:', err)
    error.value = err.message || 'Impossible de charger vos audits'
  } finally {
    isLoading.value = false
  }
}

const handleRetry = () => {
  loadAudits()
}

onMounted(() => {
  loadAudits()
})
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-50">
    <!-- Header -->
    <div class="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Back button -->
          <button
            @click="router.push('/dashboard')"
            class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft class="w-5 h-5" />
            <span>Retour au tableau de bord</span>
          </button>

          <!-- Title -->
          <h1 class="text-xl font-bold text-white">Mes Audits</h1>

          <!-- Refresh button -->
          <button
            @click="handleRetry"
            :disabled="isLoading"
            class="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all disabled:opacity-50"
          >
            <RefreshCw :class="['w-4 h-4', isLoading && 'animate-spin']" />
            <span>Actualiser</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading state -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
        <Loader2 class="w-8 h-8 text-cyan-500 animate-spin mb-4" />
        <p class="text-slate-400">Chargement de vos audits...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="flex flex-col items-center justify-center py-20">
        <AlertCircle class="w-12 h-12 text-red-500 mb-4" />
        <p class="text-slate-300 mb-4">{{ error }}</p>
        <button
          @click="handleRetry"
          class="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
        >
          Réessayer
        </button>
      </div>

      <!-- Content -->
      <div v-else>
        <!-- Tabs -->
        <div class="flex border-b border-slate-800 mb-8">
          <button
            @click="activeTab = 'in-progress'"
            :class="[
              'px-6 py-3 font-medium transition-all border-b-2',
              activeTab === 'in-progress'
                ? 'text-cyan-400 border-cyan-400'
                : 'text-slate-400 border-transparent hover:text-slate-300'
            ]"
          >
            <div class="flex items-center gap-2">
              <Clock class="w-4 h-4" />
              <span>En cours ({{ inProgressAudits.length }})</span>
            </div>
          </button>
          <button
            @click="activeTab = 'completed'"
            :class="[
              'px-6 py-3 font-medium transition-all border-b-2',
              activeTab === 'completed'
                ? 'text-cyan-400 border-cyan-400'
                : 'text-slate-400 border-transparent hover:text-slate-300'
            ]"
          >
            <div class="flex items-center gap-2">
              <CheckCircle class="w-4 h-4" />
              <span>Terminés ({{ completedAudits.length }})</span>
            </div>
          </button>
        </div>

        <!-- No audits state -->
        <div v-if="!hasAudits" class="text-center py-20">
          <div class="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText class="w-10 h-10 text-slate-600" />
          </div>
          <h3 class="text-xl font-semibold text-slate-300 mb-2">
            {{ activeTab === 'in-progress' ? 'Aucun audit en cours' : 'Aucun audit terminé' }}
          </h3>
          <p class="text-slate-500 mb-6">
            {{ activeTab === 'in-progress' 
              ? 'Commencez un nouvel audit pour voir apparaître vos évaluations en cours.'
              : 'Les audits terminés apparaîtront ici une fois que vous les aurez finalisés.' 
            }}
          </p>
          <button
            v-if="activeTab === 'in-progress'"
            @click="router.push('/audit-selection')"
            class="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all"
          >
            Commencer un audit
          </button>
        </div>

        <!-- Audits list -->
        <div v-else class="space-y-4">
          <div
            v-for="audit in currentAudits"
            :key="audit.id"
            class="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:bg-slate-900/70 transition-all"
          >
            <div class="flex items-start justify-between">
              <!-- Main info -->
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-3">
                  <!-- Status badge -->
                  <div :class="`w-10 h-10 bg-gradient-to-br ${getStatusColor(audit.status)} rounded-lg flex items-center justify-center`">
                    <component :is="getStatusIcon(audit.status)" class="w-5 h-5 text-white" />
                  </div>
                  
                  <!-- Title -->
                  <div>
                    <h3 class="text-lg font-semibold text-white">
                      {{ audit.referentiel_nom || 'Référentiel' }}
                    </h3>
                    <p class="text-slate-400 text-sm">
                      {{ audit.secteur }} • {{ audit.taille_organisation }}
                    </p>
                  </div>
                </div>

                <!-- Metadata -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p class="text-slate-500 text-xs uppercase tracking-wider mb-1">Date</p>
                    <p class="text-slate-300 text-sm">{{ formatDate(audit.created_at) }}</p>
                  </div>
                  <div>
                    <p class="text-slate-500 text-xs uppercase tracking-wider mb-1">Niveau cible</p>
                    <p class="text-slate-300 text-sm">{{ audit.niveau_cible }}</p>
                  </div>
                  <div v-if="audit.score_global !== undefined">
                    <p class="text-slate-500 text-xs uppercase tracking-wider mb-1">Score</p>
                    <div class="flex items-center gap-2">
                      <div class="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div 
                          :class="`h-full bg-gradient-to-r ${getStatusColor(audit.status)}`"
                          :style="`width: ${audit.score_global}%`"
                        ></div>
                      </div>
                      <span class="text-slate-300 text-sm font-medium">{{ audit.score_global }}%</span>
                    </div>
                  </div>
                </div>

                <!-- Status label -->
                <div class="flex items-center gap-2">
                  <span :class="`px-2 py-1 text-xs font-medium rounded-full bg-gradient-to-r ${getStatusColor(audit.status)} text-white`">
                    {{ getStatusLabel(audit.status) }}
                  </span>
                  <span v-if="audit.niveau_maturite" class="text-slate-400 text-sm">
                    • Niveau {{ audit.niveau_maturite }}
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex flex-col gap-2 ml-4">
                <button
                  v-if="audit.status === 'active' || audit.status === 'processing'"
                  @click="handleResumeAudit(audit)"
                  class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg text-sm font-medium transition-all"
                >
                  <Play class="w-4 h-4" />
                  Continuer
                </button>
                <button
                  v-if="audit.status === 'completed'"
                  @click="handleViewResults(audit)"
                  class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg text-sm font-medium transition-all"
                >
                  <Eye class="w-4 h-4" />
                  Voir les résultats
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
