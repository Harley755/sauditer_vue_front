<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  FileText,
  Download,
  BarChart3,
  PieChart,
  Target,
  Loader2,
  RefreshCw
} from 'lucide-vue-next'
import { useAuditStore } from '@/stores/audit'
import VueApexCharts from 'vue3-apexcharts'

const router = useRouter()
const route = useRoute()
const auditStore = useAuditStore()

// State
const loading = ref(true)
const analysisRunning = ref(false)
const scoreData = ref<any>(null)
const reportData = ref<any>(null)
const error = ref<string | null>(null)
const pollingInterval = ref<NodeJS.Timeout | null>(null)
const pollingTimeout = ref<NodeJS.Timeout | null>(null)
const retryCount = ref(0)

// Computed
const questionnaireId = computed(() => {
  return route.query.questionnaire_id as string || auditStore.currentAudit?.referentialId
})

const scoreLevel = computed(() => {
  if (!scoreData.value?.score_global) return { level: 'unknown', color: 'text-slate-400', label: 'Inconnu' }
  
  const score = scoreData.value.score_global
  
  if (score >= 80) return { level: 'excellent', color: 'text-emerald-400', label: 'Excellent' }
  if (score >= 60) return { level: 'good', color: 'text-blue-400', label: 'Bon' }
  if (score >= 40) return { level: 'moderate', color: 'text-yellow-400', label: 'Modéré' }
  if (score >= 20) return { level: 'weak', color: 'text-orange-400', label: 'Faible' }
  return { level: 'critical', color: 'text-red-400', label: 'Critique' }
})

// API functions
const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL as string) || 'http://localhost:8001'

const fetchScore = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/scores/score/${questionnaireId.value}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "questionnaire_id": questionnaireId.value
        }
      }
    )
    
    
    if (response.status === 404) {
      console.log('Score not found yet, analysis still running...')
      return null
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const score = await response.json()
    console.log('Score data received:', score)
    return score
  } catch (error) {
    console.error('Error fetching score:', error)
    throw error
  }
}

const fetchReport = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/reports/report/${questionnaireId.value}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "questionnaire_id": questionnaireId.value
        }
      }
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const report = await response.json()
    console.log('Report data received:', report)
    return report
  } catch (error) {
    console.error('Error fetching report:', error)
    throw error
  }
}

// Polling logic
const startPolling = () => {
  console.log('Starting polling for score...')
  analysisRunning.value = true
  
  pollingInterval.value = setInterval(async () => {
    try {
      const score = await fetchScore()
      
      if (score) {
        console.log('Score found! Stopping polling.')
        stopPolling()
        scoreData.value = score
        
        // Fetch report after score is found
        const report = await fetchReport()
        reportData.value = report
        
        analysisRunning.value = false
        loading.value = false
      }
    } catch (error) {
      console.error('Polling error:', error)
      retryCount.value++
      
      if (retryCount.value >= 30) { // 30 * 2s = 60 seconds timeout
        stopPolling()
        error.value = "L'analyse prend plus de temps que prévu. Veuillez réessayer plus tard."
        analysisRunning.value = false
        loading.value = false
      }
    }
  }, 2000) // Poll every 2 seconds
  
  // Set timeout after 60 seconds
  pollingTimeout.value = setTimeout(() => {
    stopPolling()
    error.value = "L'analyse prend plus de temps que prévu. Veuillez réessayer plus tard."
    analysisRunning.value = false
    loading.value = false
  }, 60000)
}

const stopPolling = () => {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
    pollingInterval.value = null
  }
  
  if (pollingTimeout.value) {
    clearTimeout(pollingTimeout.value)
    pollingTimeout.value = null
  }
}

const retryAnalysis = async () => {
  try {
    if (!questionnaireId.value) {
      error.value = "Identifiant de questionnaire manquant."
      return
    }

    console.log("Retrying analysis for:", questionnaireId.value)

    error.value = null
    retryCount.value = 0
    loading.value = true
    analysisRunning.value = true

    const response = await fetch(
      `${API_BASE_URL}/api/v1/questionnaires/${questionnaireId.value}/reanalyze`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
        }
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    console.log("Reanalysis started:", result)

    // relancer polling
    initializeResults()

  } catch (err) {
    console.error("Error retrying analysis:", err)

    error.value = "Impossible de relancer l'analyse. Veuillez réessayer."
    loading.value = false
    analysisRunning.value = false
  }
}

const initializeResults = async () => {
  if (!questionnaireId.value) {
    error.value = "Aucun identifiant de questionnaire trouvé."
    loading.value = false
    return
  }
  
  try {
    // First attempt to get score
    const score = await fetchScore()
    
    if (score) {
      scoreData.value = score
      
      // Get report if score exists
      const report = await fetchReport()
      reportData.value = report
      
      loading.value = false
    } else {
      // Start polling if score not found
      startPolling()
    }
  } catch (error) {
    console.error('Error initializing results:', error)
    error.value = "Erreur lors du chargement des résultats. Veuillez réessayer."
    loading.value = false
  }
}

// Chart configurations
const radarChartOptions = computed(() => {
  if (!reportData.value?.radar_par_domaine) return {}
  
  const domains = Object.keys(reportData.value.radar_par_domaine)
  const values = Object.values(reportData.value.radar_par_domaine)
  
  return {
    series: [{
      name: 'Score par domaine',
      data: values
    }],
    chart: {
      type: 'radar',
      toolbar: { show: false }
    },
    xaxis: {
      categories: domains
    },
    yaxis: {
      max: 100,
      labels: {
        formatter: (val: number) => `${val}%`
      }
    },
    plotOptions: {
      radar: {
        polygons: {
          strokeColors: '#1e293b',
          fill: {
            colors: ['#0891b2']
          }
        }
      }
    }
  }
})

const barChartOptions = computed(() => {
  if (!reportData.value?.radar_par_domaine) return {}
  
  const domains = Object.keys(reportData.value.radar_par_domaine)
  const values = Object.values(reportData.value.radar_par_domaine)
  
  return {
    series: [{
      name: 'Score',
      data: values
    }],
    chart: {
      type: 'bar',
      toolbar: { show: false }
    },
    xaxis: {
      categories: domains
    },
    yaxis: {
      max: 100,
      labels: {
        formatter: (val: number) => `${val}%`
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        colors: ['#0891b2']
      }
    }
  }
})

// Lifecycle
onMounted(() => {
  console.log('Results mounted, questionnaire_id:', questionnaireId.value)
  initializeResults()
})

onUnmounted(() => {
  stopPolling()
})
</script>

<template>
  <div class="min-h-screen bg-slate-950">
    <!-- Header -->
    <nav class="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Target class="w-6 h-6 text-white" />
            </div>
            <span class="text-white text-xl tracking-tight">Sauditer.bj</span>
          </div>
          
          <button 
            @click="router.push({ name: 'Dashboard' })"
            class="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
          >
            <ArrowLeft class="w-4 h-4" />
            Retour au dashboard
          </button>
        </div>
      </div>
    </nav>

    <!-- Loading State -->
    <div v-if="loading" class="container mx-auto px-6 py-12">
      <div class="text-center">
        <div v-if="analysisRunning" class="max-w-md mx-auto">
          <Loader2 class="w-16 h-16 text-cyan-500 animate-spin mx-auto mb-6" />
          <h2 class="text-2xl font-bold text-white mb-4">
            Analyse de votre posture cybersécurité en cours...
          </h2>
          <p class="text-slate-400 mb-6">
            Cela peut prendre quelques secondes. Nous analysons vos réponses pour générer un rapport personnalisé.
          </p>
          <div class="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div class="bg-gradient-to-r from-cyan-500 to-blue-600 h-full animate-pulse" style="width: 60%"></div>
          </div>
        </div>
        
        <div v-else class="max-w-md mx-auto">
          <Loader2 class="w-16 h-16 text-cyan-500 animate-spin mx-auto mb-6" />
          <h2 class="text-2xl font-bold text-white mb-4">
            Chargement des résultats...
          </h2>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container mx-auto px-6 py-12">
      <div class="text-center max-w-md mx-auto">
        <AlertTriangle class="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h2 class="text-2xl font-bold text-white mb-4">
          Une erreur est survenue
        </h2>
        <p class="text-slate-400 mb-6">{{ error }}</p>
        <button 
          @click="retryAnalysis"
          class="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors mx-auto"
        >
          <RefreshCw class="w-4 h-4" />
          Relancer l'analyse
        </button>
      </div>
    </div>

    <!-- Results Display -->
    <div v-else-if="scoreData && reportData" class="container mx-auto px-6 py-12">
      <!-- Score Header -->
      <div class="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-8 mb-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-white mb-4">Résultats de l'audit</h1>
          <div class="flex items-center justify-center gap-4 mb-6">
            <div class="text-6xl font-bold" :class="scoreLevel.color">
              {{ scoreData.score_global }}%
            </div>
            <div class="text-right">
              <div class="text-xl font-semibold" :class="scoreLevel.color">
                {{ scoreLevel.label }}
              </div>
              <div class="text-sm text-slate-400">
                Score global
              </div>
            </div>
          </div>
          
          <div class="text-slate-300 max-w-2xl mx-auto">
            {{ reportData.resume_executif }}
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Radar Chart -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <PieChart class="w-5 h-5 text-cyan-500" />
            Score par domaine
          </h3>
          <VueApexCharts 
            type="radar" 
            :options="radarChartOptions" 
            :series="radarChartOptions.series"
            height="300"
          />
        </div>

        <!-- Bar Chart -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 class="w-5 h-5 text-cyan-500" />
            Distribution des scores
          </h3>
          <VueApexCharts 
            type="bar" 
            :options="barChartOptions" 
            :series="barChartOptions.series"
            height="300"
          />
        </div>
      </div>

      <!-- Critical Issues -->
      <div v-if="reportData.ecarts_majeurs?.length" class="bg-red-900/20 border border-red-800/50 rounded-xl p-6 mb-8">
        <h3 class="text-xl font-semibold text-red-400 mb-4 flex items-center gap-2">
          <AlertTriangle class="w-5 h-5" />
          Écarts majeurs identifiés
        </h3>
        <ul class="space-y-2">
          <li v-for="(ecart, index) in reportData.ecarts_majeurs" :key="index" class="flex items-start gap-3">
            <div class="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
            <span class="text-red-300">{{ ecart }}</span>
          </li>
        </ul>
      </div>

      <!-- Priority Risks -->
      <div v-if="reportData.risques_prioritaires?.length" class="bg-orange-900/20 border border-orange-800/50 rounded-xl p-6 mb-8">
        <h3 class="text-xl font-semibold text-orange-400 mb-4 flex items-center gap-2">
          <TrendingUp class="w-5 h-5" />
          Risques prioritaires
        </h3>
        <ul class="space-y-2">
          <li v-for="(risque, index) in reportData.risques_prioritaires" :key="index" class="flex items-start gap-3">
            <div class="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
            <span class="text-orange-300">{{ risque }}</span>
          </li>
        </ul>
      </div>

      <!-- Action Plan -->
      <div v-if="reportData.plan_action_priorise?.length" class="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
        <h3 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Target class="w-5 h-5 text-cyan-500" />
          Plan d'action priorisé
        </h3>
        <div class="space-y-4">
          <div v-for="(action, index) in reportData.plan_action_priorise" :key="index" class="border border-slate-700 rounded-lg p-4">
            <div class="flex items-start justify-between mb-2">
              <h4 class="font-semibold text-white">{{ action.description_action }}</h4>
              <span class="px-2 py-1 text-xs font-medium rounded" 
                :class="{
                  'bg-green-900/50 text-green-400': action.priorite === 'low',
                  'bg-yellow-900/50 text-yellow-400': action.priorite === 'medium', 
                  'bg-red-900/50 text-red-400': action.priorite === 'high'
                }">
                {{ action.priorite.toUpperCase() }}
              </span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span class="text-slate-400">Impact risque:</span>
                <span class="text-white ml-2">{{ action.impact_risque }}</span>
              </div>
              <div>
                <span class="text-slate-400">Effort estimé:</span>
                <span class="text-white ml-2">{{ action.effort_estime }}</span>
              </div>
              <div>
                <span class="text-slate-400">Délai recommandé:</span>
                <span class="text-white ml-2">{{ action.delai_recommande }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Strategic Recommendations -->
      <div v-if="reportData.recommandations_strategiques?.length" class="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp class="w-5 h-5 text-cyan-500" />
          Recommandations stratégiques
        </h3>
        <ul class="space-y-3">
          <li v-for="(reco, index) in reportData.recommandations_strategiques" :key="index" class="flex items-start gap-3">
            <CheckCircle class="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
            <span class="text-slate-300">{{ reco }}</span>
          </li>
        </ul>
      </div>

      <!-- Download Report -->
      <div class="text-center mt-12">
        <button class="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors mx-auto">
          <Download class="w-4 h-4" />
          Télécharger le rapport complet
        </button>
      </div>
    </div>
  </div>
</template>
