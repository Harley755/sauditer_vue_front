<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Shield, 
  Plus, 
  TrendingUp, 
  FileText, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  BarChart3,
  LogOut,
  User,
  Loader2,
  AlertCircle,
  ChevronRight
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useQuestionnaireStore } from '@/stores/questionnaireStore'
import type { EnhancedReferential } from '@/types/questionnaire'

const router = useRouter()
const authStore = useAuthStore()
const questionnaireStore = useQuestionnaireStore()

const isInitialized = ref(false)

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/')
    return
  }
  
  try {
    if (!questionnaireStore.hasReferentials) {
      await questionnaireStore.fetchReferentials()
    }
  } catch (error) {
    console.error('Failed to load referentials:', error)
  } finally {
    isInitialized.value = true
  }
})

const handleStartAudit = () => {
  router.push('/audit-selection')
}

const handleRetry = () => {
  questionnaireStore.fetchReferentials()
}

const displayedReferentials = computed(() => {
  return questionnaireStore.referentials.slice(0, 6) // Limiter à 6 pour l'affichage
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

const userTypeLabels = {
  citizen: 'Citoyen / Professionnel',
  manager: 'Responsable Sécurité',
  auditor: 'Expert Auditeur'
}

const stats = [
  {
    label: 'Audits complétés',
    value: '0',
    icon: CheckCircle,
    color: 'from-emerald-500 to-green-600'
  },
  {
    label: 'Score moyen',
    value: '-',
    icon: TrendingUp,
    color: 'from-cyan-500 to-blue-600'
  },
  {
    label: 'En cours',
    value: '0',
    icon: Clock,
    color: 'from-yellow-500 to-orange-600'
  },
  {
    label: 'Actions requises',
    value: '-',
    icon: AlertTriangle,
    color: 'from-red-500 to-pink-600'
  }
]
</script>

<template>
  <div class="min-h-screen bg-slate-950">
    <!-- Header -->
    <nav class="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Shield class="w-6 h-6 text-white" />
            </div>
            <span class="text-white text-xl tracking-tight">Sauditer.bj</span>
          </div>

          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
              <User class="w-4 h-4 text-slate-400" />
              <span class="text-slate-300 text-sm">
                {{ authStore.userFullName || 'Utilisateur' }}
              </span>
            </div>
            <button
              @click="handleLogout"
              class="p-2 text-slate-400 hover:text-white transition-colors"
              title="Déconnexion"
            >
              <LogOut class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="container mx-auto px-6 py-8">
      <!-- Welcome Section -->
      <div class="mb-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <h1 class="text-white text-3xl mb-2 font-bold">
          Tableau de bord
        </h1>
        <p class="text-slate-400">
          Gérez vos audits de conformité et suivez vos scores de sécurité
        </p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          v-for="(stat, index) in stats"
          :key="stat.label"
          class="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors animate-in fade-in slide-in-from-bottom-5 duration-700"
          :style="{ transitionDelay: `${index * 100}ms`, animationDelay: `${index * 100}ms` }"
        >
          <div class="flex items-start justify-between mb-4">
            <div :class="`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`">
              <component :is="stat.icon" class="w-6 h-6 text-white" />
            </div>
          </div>
          <div class="text-white text-3xl mb-1 font-bold">{{ stat.value }}</div>
          <div class="text-slate-400 text-sm">{{ stat.label }}</div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid md:grid-cols-2 gap-6 mb-8 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-400">
        <button
          @click="handleStartAudit"
          class="group bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-8 text-left hover:shadow-xl hover:shadow-cyan-500/20 transition-all"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="w-14 h-14 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Plus class="w-7 h-7 text-white" />
            </div>
            <BarChart3 class="w-6 h-6 text-white/60 group-hover:text-white transition-colors" />
          </div>
          <h3 class="text-white text-2xl mb-2 font-bold">Nouvel audit</h3>
          <p class="text-cyan-100 text-sm">
            Lancez une nouvelle évaluation de conformité selon un référentiel
          </p>
        </button>

        <div class="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
          <div class="flex items-start justify-between mb-4">
            <div class="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText class="w-7 h-7 text-white" />
            </div>
          </div>
          <h3 class="text-white text-2xl mb-2 font-bold">Rapports</h3>
          <p class="text-slate-400 text-sm">
            Consultez et exportez vos rapports d'audit
          </p>
          <button class="mt-4 text-cyan-400 text-sm hover:text-cyan-300 transition-colors font-medium">
            Voir les rapports →
          </button>
        </div>
      </div>

      <!-- Available Referentials -->
      <div class="animate-in fade-in slide-in-from-bottom-5 duration-700 delay-500">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-white text-2xl font-bold">Référentiels disponibles</h2>
          <!-- <button
            @click="handleStartAudit"
            class="text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium"
          >
            Voir tout →
          </button> -->
        </div>
        
        <!-- Loading State -->
        <div v-if="!isInitialized || questionnaireStore.loading" class="flex items-center justify-center py-12">
          <div class="flex flex-col items-center gap-4">
            <Loader2 class="w-8 h-8 text-cyan-500 animate-spin" />
            <p class="text-slate-400 text-sm">Chargement des référentiels...</p>
          </div>
        </div>
        
        <!-- Error State -->
        <div v-else-if="questionnaireStore.error" class="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-6">
          <div class="flex gap-4">
            <AlertCircle class="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
            <div class="flex-1">
              <h3 class="text-red-400 font-semibold mb-2">Erreur de chargement</h3>
              <p class="text-slate-400 text-sm mb-4">{{ questionnaireStore.error }}</p>
              <button
                @click="handleRetry"
                class="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors text-sm"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
        
        <!-- Referentials Grid -->
        <div v-else-if="displayedReferentials.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="ref in displayedReferentials"
            :key="ref.nom"
            class="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-cyan-500/50 transition-all group"
            
          >
            <div class="flex items-start gap-4 mb-4">
              <div :class="`w-12 h-12 bg-gradient-to-br ${ref.meta.color} rounded-lg flex items-center justify-center text-2xl shadow-lg`">
                {{ ref.meta.icon }}
              </div>
              <div class="flex-1">
                <h3 class="text-white mb-1 font-semibold group-hover:text-cyan-400 transition-colors">{{ ref.nom }}</h3>
                <p class="text-slate-400 text-sm line-clamp-2">{{ ref.description }}</p>
              </div>
            </div>
            <div class="flex items-center justify-between text-sm text-slate-500">
              <span>Génération dynamique</span>
              <ChevronRight class="w-4 h-4 group-hover:text-cyan-400 transition-colors" />
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <div class="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield class="w-8 h-8 text-slate-600" />
          </div>
          <h3 class="text-white text-lg font-semibold mb-2">Aucun référentiel disponible</h3>
          <p class="text-slate-400 text-sm mb-4">Les référentiels n'ont pas pu être chargés</p>
          <button
            @click="handleRetry"
            class="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors text-sm"
          >
            Réessayer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
