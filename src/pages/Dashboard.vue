<script setup lang="ts">
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
  User
} from 'lucide-vue-next'
import { useAuditStore } from '@/stores/audit'
import { referentials } from '@/data/referentials'
import { onMounted } from 'vue'

const router = useRouter()
const auditStore = useAuditStore()

onMounted(() => {
  if (!auditStore.isAuthenticated) {
    router.push('/')
  }
})

const handleStartAudit = () => {
  router.push('/audit-selection')
}

const handleLogout = () => {
  auditStore.logout()
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
  <div v-if="auditStore.isAuthenticated" class="min-h-screen bg-slate-950">
    <!-- Header -->
    <nav class="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Shield class="w-6 h-6 text-white" />
            </div>
            <span class="text-white text-xl tracking-tight">CyberGRC</span>
          </div>

          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
              <User class="w-4 h-4 text-slate-400" />
              <span class="text-slate-300 text-sm">
                {{ auditStore.userType ? userTypeLabels[auditStore.userType] : 'Utilisateur' }}
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
        <h2 class="text-white text-2xl mb-4 font-bold">Référentiels disponibles</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="ref in referentials"
            :key="ref.id"
            class="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors"
          >
            <div class="flex items-start gap-4 mb-4">
              <div class="text-4xl">{{ ref.icon }}</div>
              <div class="flex-1">
                <h3 class="text-white mb-1 font-semibold">{{ ref.name }}</h3>
                <p class="text-slate-400 text-sm">{{ ref.description }}</p>
              </div>
            </div>
            <div class="flex items-center justify-between text-sm text-slate-500">
              <span>{{ ref.questions.length }} questions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
