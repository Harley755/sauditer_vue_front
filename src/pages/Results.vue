<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
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
  Target
} from 'lucide-vue-next'
import { useAuditStore } from '@/stores/audit'
import { referentials, getScoreLevel } from '@/data/referentials'
import VueApexCharts from 'vue3-apexcharts'

const router = useRouter()
const auditStore = useAuditStore()

const referential = computed(() => 
  referentials.find(r => r.id === auditStore.currentAudit?.referentialId)
)

// Calculate scores
const results = computed(() => {
  if (!auditStore.currentAudit || !referential.value) return null

  const totalWeight = referential.value.questions.reduce((sum, q) => sum + q.weight, 0)
  let earnedPoints = 0

  auditStore.currentAudit.answers.forEach(answer => {
    const question = referential.value?.questions.find(q => q.id === answer.questionId)
    if (!question) return

    if (answer.answer === 'yes') {
      earnedPoints += question.weight
    } else if (answer.answer === 'partial') {
      earnedPoints += question.weight * 0.5
    }
  })

  const score = Math.round((earnedPoints / totalWeight) * 100)
  const scoreLevel = getScoreLevel(score)

  // Calculate by category
  const categoryScores: Record<string, { score: number; total: number; questions: number }> = {}
  
  referential.value.questions.forEach(question => {
    if (!categoryScores[question.category]) {
      categoryScores[question.category] = { score: 0, total: 0, questions: 0 }
    }
    
    const answer = auditStore.currentAudit?.answers.find(a => a.questionId === question.id)
    categoryScores[question.category].total += question.weight
    categoryScores[question.category].questions += 1
    
    if (answer) {
      if (answer.answer === 'yes') {
        categoryScores[question.category].score += question.weight
      } else if (answer.answer === 'partial') {
        categoryScores[question.category].score += question.weight * 0.5
      }
    }
  })

  // Answer distribution
  const answerCounts = {
    yes: auditStore.currentAudit.answers.filter(a => a.answer === 'yes').length,
    partial: auditStore.currentAudit.answers.filter(a => a.answer === 'partial').length,
    no: auditStore.currentAudit.answers.filter(a => a.answer === 'no').length,
    na: auditStore.currentAudit.answers.filter(a => a.answer === 'na').length
  }

  return {
    score,
    scoreLevel,
    categoryScores,
    answerCounts,
    totalQuestions: referential.value.questions.length,
    answeredQuestions: auditStore.currentAudit.answers.length
  }
})

onMounted(() => {
  if (auditStore.currentAudit && !auditStore.currentAudit.completedAt) {
    auditStore.completeAudit()
  }
  if (!auditStore.currentAudit || !results.value) {
    router.push('/dashboard')
  }
})

// Chart options
const barChartOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    background: 'transparent'
  },
  colors: ['#06b6d4'],
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: true,
    }
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: results.value ? Object.keys(results.value.categoryScores) : [],
    labels: { style: { colors: '#64748b' } }
  },
  yaxis: {
    labels: { style: { colors: '#64748b' } }
  },
  grid: { borderColor: '#1e293b' },
  theme: { mode: 'dark' }
}))

const barChartSeries = computed(() => [{
  name: 'Score',
  data: results.value ? Object.values(results.value.categoryScores).map(d => Math.round((d.score / d.total) * 100)) : []
}])

const pieChartOptions = computed(() => ({
  chart: { type: 'donut', background: 'transparent' },
  labels: ['Conforme', 'Partiel', 'Non conforme', 'N/A'],
  colors: ['#10b981', '#f59e0b', '#ef4444', '#64748b'],
  legend: { position: 'bottom', labels: { colors: '#64748b' } },
  stroke: { show: false },
  theme: { mode: 'dark' }
}))

const pieChartSeries = computed(() => results.value ? [
  results.value.answerCounts.yes,
  results.value.answerCounts.partial,
  results.value.answerCounts.no,
  results.value.answerCounts.na
] : [])

const weakCategories = computed(() => {
  if (!results.value) return []
  return Object.entries(results.value.categoryScores)
    .map(([category, data]) => ({
      category,
      score: Math.round((data.score / data.total) * 100)
    }))
    .filter(c => c.score < 70)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
})
</script>

<template>
  <div v-if="results && referential" class="min-h-screen bg-slate-950">
    <!-- Background decorations -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
    </div>

    <div class="relative container mx-auto px-6 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <button
          @click="router.push('/dashboard')"
          class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft class="w-4 h-4" />
          Retour au tableau de bord
        </button>

        <button class="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center gap-2 text-sm font-semibold">
          <Download class="w-4 h-4" />
          Exporter le rapport
        </button>
      </div>

      <!-- Score Hero Section -->
      <div class="mb-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <div class="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 md:p-12 shadow-2xl backdrop-blur-sm">
          <div class="flex flex-col md:flex-row items-center gap-12">
            <!-- Score Circle -->
            <div class="relative group">
              <svg class="w-48 h-48 transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  stroke-width="12"
                  fill="none"
                  class="text-slate-800"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="url(#scoreGradient)"
                  stroke-width="12"
                  fill="none"
                  :stroke-dasharray="`${(results.score / 100) * 553} 553`"
                  stroke-linecap="round"
                  class="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#06b6d4" />
                    <stop offset="100%" stop-color="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                  <div class="text-white text-5xl font-bold mb-1 tracking-tighter">{{ results.score }}</div>
                  <div class="text-slate-500 text-xs font-bold uppercase tracking-widest">/ 100</div>
                </div>
              </div>
            </div>

            <!-- Score Details -->
            <div class="flex-1 text-center md:text-left">
              <div class="flex items-center gap-3 mb-4 justify-center md:justify-start">
                <span class="text-3xl">{{ referential.icon }}</span>
                <h1 class="text-white text-3xl font-bold tracking-tight">{{ referential.name }}</h1>
              </div>
              
              <div :class="`inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-6 ${results.scoreLevel.bgColor} shadow-sm shadow-black/20`">
                <Target :class="`w-5 h-5 ${results.scoreLevel.color}`" />
                <span :class="`text-sm font-bold uppercase tracking-wider ${results.scoreLevel.color}`">
                  Niveau : {{ results.scoreLevel.label }}
                </span>
              </div>

              <p class="text-slate-400 text-lg mb-8 leading-relaxed">
                {{ results.score >= 90 ? 'Excellent ! Votre organisation démontre une maturité exemplaire en cybersécurité.' :
                   results.score >= 70 ? 'Bon niveau de conformité. Quelques améliorations ciblées renforceront votre posture.' :
                   results.score >= 50 ? 'Conformité moyenne. Des efforts significatifs sont nécessaires pour atteindre les standards.' :
                   results.score >= 30 ? 'Conformité faible. Des mesures urgentes doivent être prises.' :
                   'Situation critique. Une action immédiate est requise pour sécuriser votre organisation.' }}
              </p>

              <div class="flex flex-wrap gap-6 justify-center md:justify-start text-slate-400">
                <div class="flex items-center gap-2 text-sm font-medium">
                  <FileText class="w-4 h-4 text-cyan-500" />
                  {{ results.answeredQuestions }} / {{ results.totalQuestions }} questions
                </div>
                <div class="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle class="w-4 h-4 text-emerald-400" />
                  {{ results.answerCounts.yes }} conformes
                </div>
                <div class="flex items-center gap-2 text-sm font-medium">
                  <AlertTriangle class="w-4 h-4 text-red-400" />
                  {{ results.answerCounts.no }} non conformes
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid lg:grid-cols-2 gap-8 mb-8">
        <!-- Category Scores -->
        <div class="bg-slate-900/50 border border-slate-800 rounded-xl p-8 shadow-xl animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
          <div class="flex items-center gap-3 mb-8">
            <BarChart3 class="w-6 h-6 text-cyan-400" />
            <h2 class="text-white text-xl font-bold tracking-tight">Score par catégorie</h2>
          </div>
          
          <div class="h-[300px]">
            <VueApexCharts
              type="bar"
              height="100%"
              :options="barChartOptions"
              :series="barChartSeries"
            />
          </div>
        </div>

        <!-- Answer Distribution -->
        <div class="bg-slate-900/50 border border-slate-800 rounded-xl p-8 shadow-xl animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300">
          <div class="flex items-center gap-3 mb-8">
            <PieChart class="w-6 h-6 text-cyan-400" />
            <h2 class="text-white text-xl font-bold tracking-tight">Distribution des réponses</h2>
          </div>
          
          <div class="h-[300px]">
            <VueApexCharts
              type="donut"
              height="100%"
              :options="pieChartOptions"
              :series="pieChartSeries"
            />
          </div>
        </div>
      </div>

      <!-- Recommendations -->
      <div v-if="weakCategories.length > 0" class="bg-slate-900/50 border border-slate-800 rounded-xl p-8 mb-8 shadow-xl animate-in fade-in slide-in-from-bottom-5 duration-700 delay-400">
        <div class="flex items-center gap-3 mb-8">
          <AlertTriangle class="w-6 h-6 text-yellow-400" />
          <h2 class="text-white text-xl font-bold tracking-tight">Priorités d'amélioration</h2>
        </div>

        <div class="grid gap-4">
          <div v-for="(cat, index) in weakCategories" :key="cat.category" class="flex items-center gap-4 p-5 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
            <div :class="`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg ${cat.score < 30 ? 'bg-red-500/20' : cat.score < 50 ? 'bg-orange-500/20' : 'bg-yellow-500/20'}`">
              <component :is="index === 0 ? TrendingDown : AlertTriangle" :class="`w-6 h-6 ${cat.score < 30 ? 'text-red-400' : 'text-yellow-400'}`" />
            </div>
            <div class="flex-1">
              <h3 class="text-white font-bold mb-1">{{ cat.category }}</h3>
              <p class="text-slate-400 text-sm">
                Score actuel : {{ cat.score }}% - Action prioritaire recommandée
              </p>
            </div>
            <div :class="`px-4 py-1.5 rounded-lg text-sm font-bold shadow-inner ${cat.score < 30 ? 'bg-red-500/20 text-red-400' : cat.score < 50 ? 'bg-orange-500/20 text-orange-400' : 'bg-yellow-500/20 text-yellow-400'}`">
              {{ cat.score }}%
            </div>
          </div>
        </div>
      </div>

      <!-- Success message -->
      <div v-if="results.score >= 70" class="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-8 mb-8 animate-in fade-in duration-1000 delay-500">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle class="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 class="text-white text-xl font-bold mb-2">Félicitations !</h3>
            <p class="text-slate-400 text-sm leading-relaxed max-w-3xl">
              Votre organisation démontre un bon niveau de maturité en matière de {{ referential.name }}. 
              Continuez à maintenir vos efforts et à améliorer les domaines identifiés pour atteindre l'excellence.
            </p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-wrap gap-4 justify-center mt-12 animate-in fade-in duration-1000 delay-700">
        <button
          @click="router.push('/audit-selection')"
          class="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold hover:shadow-xl hover:shadow-cyan-500/30 transition-all scale-100 hover:scale-[1.02] active:scale-95"
        >
          Lancer un nouvel audit
        </button>
        <button
          @click="router.push('/dashboard')"
          class="px-8 py-4 border border-slate-700 text-slate-300 rounded-xl font-bold hover:border-slate-600 hover:bg-slate-900/50 transition-all"
        >
          Retour au tableau de bord
        </button>
      </div>
    </div>
  </div>
</template>
