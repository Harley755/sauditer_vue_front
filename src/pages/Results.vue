<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue"
import { useRouter, useRoute } from "vue-router"
import {
  ArrowLeft,
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
} from "lucide-vue-next"

import VueApexCharts from "vue3-apexcharts"

const router = useRouter()
const route = useRoute()

// Importer directement le store pour éviter les problèmes d'import
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()

// Récupérer le questionnaireStore pour le référentiel
import { useQuestionnaireStore } from '@/stores/questionnaireStore'
const questionnaireStore = useQuestionnaireStore()

/* ---------------- STATE ---------------- */

const loading = ref(true)
const analysisRunning = ref(false)

const scoreData = ref<any>(null)
const reportData = ref<any>(null)

const error = ref<string | null>(null)

let pollingInterval: any = null
let pollingTimeout: any = null

const retryCount = ref(0)

// Récupérer le total des questions depuis le store
const totalQuestionsFromStore = computed(() => {
  console.log("📊 questionnaireStore.currentQuestionnaire:", questionnaireStore.currentQuestionnaire)
  console.log("📊 questions.length:", questionnaireStore.currentQuestionnaire?.questions.length)
  return questionnaireStore.currentQuestionnaire?.questions.length || 0
})

/* ---------------- CONFIG ---------------- */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8001"

const questionnaireId = computed(
  () => route.query.questionnaire_id as string
)

const referentielName = ref('RGPD')

async function fetchReferentielName() {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }
    
    if (authStore.user?.id) {
      headers['x-user-id'] = authStore.user.id
    }
    
    const response = await fetch(`${API_BASE_URL}/api/v1/questionnaires/referentiels/name/${questionnaireId.value}`, {
      method: "GET",
      // headers: headers
    })

    if (!response.ok) throw new Error("Referentiel name fetch failed")

    const data = await response.json()
    referentielName.value = data.referentiel_name || ' '
    
  } catch (error) {
    console.error('Failed to fetch referentiel name:', error)
    // Garder la valeur par défaut en cas d'erreur
  }
}

async function initializeResults() {
  try {
    // Charger le nom du référentiel
    await fetchReferentielName()
    
    const score = await fetchScore()

    if (score) {
      scoreData.value = score
      reportData.value = await fetchReport()

      loading.value = false
    } else {
      startPolling()
    }
  } catch {
    error.value = "Erreur chargement résultats"
    loading.value = false
  }
}

/* ---------------- SCORE LEVEL ---------------- */

const scoreLevel = computed(() => {
  const score = scoreData.value?.score_global

  if (!score)
    return {
      label: "Inconnu",
      color: "text-slate-400",
      bgColor: "bg-slate-500/10"
    }

  if (score >= 80)
    return {
      label: "Excellent",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10"
    }

  if (score >= 60)
    return {
      label: "Bon",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10"
    }

  if (score >= 40)
    return {
      label: "Modéré",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10"
    }

  if (score >= 20)
    return {
      label: "Faible",
      color: "text-orange-400",
      bgColor: "bg-orange-500/10"
    }

  return {
    label: "Critique",
    color: "text-red-400",
    bgColor: "bg-red-500/10"
  }
})

/* ---------------- API ---------------- */

async function fetchScore() {
  // Créer les headers avec le user_id dynamique
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  }
  
  // Ajouter le user_id si l'utilisateur est connecté
  if (authStore.user?.id) {
    headers['x-user-id'] = authStore.user.id
  }
  
  const res = await fetch(
    `${API_BASE_URL}/api/v1/scores/score/${questionnaireId.value}`,
    {
      headers: headers
    }
  )

  if (res.status === 404) return null
  if (!res.ok) throw new Error("Score fetch failed")

  return await res.json()
}

async function fetchReport() {
  // Créer les headers avec le user_id dynamique
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  }
  
  // Ajouter le user_id si l'utilisateur est connecté
  if (authStore.user?.id) {
    headers['x-user-id'] = authStore.user.id
  }
  
  const res = await fetch(
    `${API_BASE_URL}/api/v1/reports/report/${questionnaireId.value}`,
    {
      headers: headers
    }
  )

  if (!res.ok) throw new Error("Report fetch failed") 
    const data = await res.json()
    console.log(data)
    return data
}

/* ---------------- POLLING ---------------- */

function stopPolling() {
  if (pollingInterval) clearInterval(pollingInterval)
  if (pollingTimeout) clearTimeout(pollingTimeout)
}

function startPolling() {
  analysisRunning.value = true

  pollingInterval = setInterval(async () => {
    try {
      const score = await fetchScore()

      if (score) {
        stopPolling()

        scoreData.value = score
        reportData.value = await fetchReport()

        loading.value = false
        analysisRunning.value = false
      }
    } catch {
      retryCount.value++

      if (retryCount.value >= 30) {
        stopPolling()
        error.value = "Analyse trop longue"
        loading.value = false
      }
    }
  }, 2000)

  pollingTimeout = setTimeout(() => {
    stopPolling()

    error.value = "Timeout analyse"
    loading.value = false
  }, 60000)
}

async function exportPDF() {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }
    
    if (authStore.user?.id) {
      headers['x-user-id'] = authStore.user.id
    }
    
    // Utiliser la route GET existante avec le questionnaire_id
    const response = await fetch(`${API_BASE_URL}/api/v1/reports/report/${questionnaireId.value}/export?format=pdf`, {
      method: "GET",
      headers: headers
    })

    if (!response.ok) throw new Error("PDF export failed")

    console.log(response)
    // Créer un blob et télécharger le fichier
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rapport_audit_cybersecurite_${questionnaireId.value}.pdf`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    
  } catch (error) {
    console.error('Failed to export PDF:', error)
    // Optionnel: afficher une notification d'erreur
  }
}

function goToDashboard() {
  console.log("🧹 Retour au tableau de bord avec nettoyage de Pinia")
  
  // Vider les questionnaires et audits de Pinia avant de retourner au dashboard
  questionnaireStore.clearCurrentQuestionnaire()
  // auditStore.clearAudit()
  
  router.push('/dashboard')
}

async function retryAnalysis() {
  error.value = null
  retryCount.value = 0

  loading.value = true
  analysisRunning.value = true

  // Créer les headers avec le user_id dynamique
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  }
  
  // Ajouter le user_id si l'utilisateur est connecté
  if (authStore.user?.id) {
    headers['x-user-id'] = authStore.user.id
  }

  await fetch(
    `${API_BASE_URL}/api/v1/questionnaires/${questionnaireId.value}/reanalyze`,
    {
      method: "POST",
      headers: headers
    }
  )

  initializeResults()
}

/* ---------------- RESULTS ADAPTER ---------------- */

const results = computed(() => {
  if (!scoreData.value || !reportData.value) return null

  const categoryScores: any = {}

  Object.entries(reportData.value.radar_par_domaine).forEach(
    ([category, score]: any) => {
      categoryScores[category] = {
        score: Math.round(score),  // ← ARRONDI
        total: 100,
        questions: 1
      }
    }
  )

  return {
    score: Math.round(scoreData.value.score_global),  // ← ARRONDI

    scoreLevel: scoreLevel.value,

    categoryScores,

    answerCounts: {
      yes: scoreData.value.reponses_oui,
      partial: scoreData.value.reponses_partiel,
      no: scoreData.value.reponses_non,
      na: scoreData.value.reponses_na
    },

    totalQuestions:
      scoreData.value.reponses_oui +
      scoreData.value.reponses_partiel +
      scoreData.value.reponses_non +
      scoreData.value.reponses_na,

    answeredQuestions:
      scoreData.value.reponses_oui +
      scoreData.value.reponses_partiel +
      scoreData.value.reponses_non
  }
})

/* ---------------- CHARTS ---------------- */

const barChartOptions = computed(() => ({
  chart: { type: "bar", toolbar: { show: false }, background: "transparent" },

  colors: ["#06b6d4"],

  plotOptions: {
    bar: { borderRadius: 4, horizontal: true }
  },

  xaxis: {
    categories: results.value
      ? Object.keys(results.value.categoryScores)
      : []
  },

  theme: { mode: "dark" }
}))

const barChartSeries = computed(() => {
  if (!results.value) return []

  const data = Object.values(results.value.categoryScores).map(
    (d: any) => Math.round(d.score ?? 0)  // ← ARRONDI
  )

  return [
    {
      name: "Score",
      data
    }
  ]
})

const pieChartOptions = {
  chart: {
    type: "donut",
    background: "transparent"
  },

  labels: ["Conforme", "Partiel", "Non conforme", "N/A"],

  colors: ["#10b981", "#f59e0b", "#ef4444", "#64748b"],

  dataLabels: {
    enabled: true
  },

  legend: {
    position: "right",
    labels: {
      colors: "#cbd5f5"
    }
  },

  theme: {
    mode: "dark"
  }
}

const pieChartSeries = computed(() => {
  if (!results.value) return []

  const data = [
    results.value.answerCounts?.yes ?? 0,
    results.value.answerCounts?.partial ?? 0,
    results.value.answerCounts?.no ?? 0,
    results.value.answerCounts?.na ?? 0
  ]

  // ApexCharts ne render pas si tout est 0
  const total = data.reduce((a, b) => a + b, 0)

  if (total === 0) {
    return [1] // fallback invisible
  }

  return data
})

/* ---------------- PRIORITIES ---------------- */

const weakCategories = computed(() => {
  if (!results.value) return []

  return Object.entries(results.value.categoryScores)
    .map(([category, data]: any) => ({
      category,
      score: Math.round(data.score)  // ← ARRONDI
    }))
    .filter((c) => c.score < 70)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
})

onMounted(initializeResults)
onUnmounted(stopPolling)
</script>

<template>
  <div v-if="loading" class="text-center py-24">
    <Loader2 class="w-16 h-16 animate-spin text-cyan-500 mx-auto mb-6" />
    <h2 class="text-white text-2xl font-bold">
      {{ analysisRunning ? "Analyse en cours..." : "Chargement..." }}
    </h2>
  </div>

  <div v-else-if="results" class="min-h-screen bg-slate-950">
    <div class="container mx-auto px-6 py-8">

      <!-- HEADER -->

      <div class="flex items-center justify-between mb-8">
        <button
          @click="goToDashboard"
          class="flex items-center gap-2 text-slate-400 hover:text-white"
        >
          <ArrowLeft class="w-4 h-4" />
          Retour au tableau de bord
        </button>

        <button
          @click="exportPDF"
          class="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg flex items-center gap-2"
        >
          <Download class="w-4 h-4" />
          Exporter le rapport
        </button>
      </div>

      <!-- SCORE HERO -->

      <div
        class="bg-slate-900 border border-slate-800 rounded-2xl p-10 mb-12 flex items-center gap-10"
      >
        <!-- SCORE CIRCLE -->

        <div class="relative">
          <svg class="w-40 h-40 transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              stroke-width="10"
              fill="none"
              class="text-slate-800"
            />

            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="#06b6d4"
              stroke-width="10"
              fill="none"
              :stroke-dasharray="`${(Math.round(results.score) / 100) * 440} 440`"
              stroke-linecap="round"
            />
          </svg>

          <div
            class="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold"
          >
            {{ Math.round(results.score) }} %
          </div>
        </div>

        <!-- DETAILS -->

        <div>
          <h1 class="text-white text-3xl font-bold mb-2">
            {{ referentielName }}
          </h1>

          <div
            :class="`inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-4 ${results.scoreLevel.bgColor}`"
          >
            <Target :class="results.scoreLevel.color" />
            <span :class="results.scoreLevel.color">
              Niveau : {{ results.scoreLevel.label }}
            </span>
          </div>

          <p class="text-slate-400 mb-4">
            {{
              Math.round(results.score) >= 70
                ? "Bon niveau de conformité."
                : "Conformité faible. Des mesures urgentes doivent être prises."
            }}
          </p>

          <div class="flex gap-6 text-slate-400 text-sm">
            <div class="flex gap-2 items-center">
              <FileText class="w-4 h-4 text-cyan-400" />
              {{ results.answeredQuestions }} / {{ totalQuestionsFromStore || results.totalQuestions }} questions
            </div>

            <div class="flex gap-2 items-center">
              <CheckCircle class="w-4 h-4 text-emerald-400" />
              {{ results.answerCounts.yes }} conformes
            </div>

            <div class="flex gap-2 items-center">
              <AlertTriangle class="w-4 h-4 text-red-400" />
              {{ results.answerCounts.no }} non conformes
            </div>
          </div>
        </div>
      </div>

      <!-- CHARTS -->

      <div class="grid lg:grid-cols-2 gap-8 mb-12">

        <div class="bg-slate-900 border border-slate-800 rounded-xl p-8">
          <div class="flex items-center gap-3 mb-6">
            <BarChart3 class="w-6 h-6 text-cyan-400" />
            <h2 class="text-white text-xl font-bold">
              Score par catégorie
            </h2>
          </div>

          <VueApexCharts
            v-if="barChartSeries.length"
            type="bar"
            height="300"
            :options="barChartOptions"
            :series="barChartSeries"
          />
        </div>

        <!-- <div class="bg-slate-900 border border-slate-800 rounded-xl p-8">
          <div class="flex items-center gap-3 mb-6">
            <PieChart class="w-6 h-6 text-cyan-400" />
            <h2 class="text-white text-xl font-bold">
              Distribution des réponses
            </h2>
          </div>

          <VueApexCharts
            v-if="pieChartSeries.length"
            type="donut"
            height="300"
            :options="pieChartOptions"
            :series="pieChartSeries"
          />
        </div> -->

      </div>

      <!-- PRIORITÉS -->

      <div
        v-if="weakCategories.length"
        class="bg-slate-900 border border-slate-800 rounded-xl p-8 mb-10"
      >
        <div class="flex items-center gap-3 mb-6">
          <AlertTriangle class="w-6 h-6 text-yellow-400" />
          <h2 class="text-white text-xl font-bold">
            Priorités d'amélioration
          </h2>
        </div>

        <div class="grid gap-4">

          <div
            v-for="(cat, index) in weakCategories"
            :key="cat.category"
            class="flex items-center gap-4 p-4 bg-slate-800 rounded-xl"
          >
            <div class="flex-1">
              <h3 class="text-white font-bold">
                {{ cat.category }}
              </h3>

              <p class="text-slate-400 text-sm">
                Score actuel : {{ Math.round(cat.score) }}%
              </p>
            </div>

            <div class="text-red-400 font-bold">
              {{ Math.round(cat.score) }}%
            </div>
          </div>

        </div>
      </div>

      <!-- ACTIONS -->

      <div class="flex justify-center gap-4">
        <button
          @click="router.push('/audit-selection')"
          class="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold"
        >
          Lancer un nouvel audit
        </button>

        <button
          @click="router.push('/dashboard')"
          class="px-8 py-4 border border-slate-700 text-slate-300 rounded-xl font-bold"
        >
          Retour au tableau de bord
        </button>
      </div>

    </div>
  </div>
</template>