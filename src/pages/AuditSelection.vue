<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeft, ChevronRight } from 'lucide-vue-next'
import { useAuditStore } from '@/stores/audit'
import { referentials } from '@/data/referentials'

const router = useRouter()
const auditStore = useAuditStore()

const handleSelectReferential = (referentialId: string) => {
  auditStore.startAudit(referentialId)
  router.push('/questionnaire')
}

const getCategories = (referential: any) => {
  return [...new Set(referential.questions.map((q: any) => q.category))]
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

      <!-- Referentials Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <button
          v-for="(referential, index) in referentials"
          :key="referential.id"
          @click="handleSelectReferential(referential.id)"
          class="group bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-left hover:border-cyan-500/50 hover:bg-slate-900 transition-all animate-in fade-in slide-in-from-bottom-5 duration-700"
          :style="{ transitionDelay: `${index * 100}ms`, animationDelay: `${index * 100}ms` }"
        >
          <!-- Icon & Badge -->
          <div class="flex items-start justify-between mb-6">
            <div :class="`w-16 h-16 bg-gradient-to-br ${referential.color} rounded-xl flex items-center justify-center text-3xl shadow-lg`">
              {{ referential.icon }}
            </div>
            <ChevronRight class="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </div>

          <!-- Content -->
          <h3 class="text-white text-2xl mb-3 font-bold">{{ referential.name }}</h3>
          <p class="text-slate-400 mb-6 leading-relaxed text-sm">
            {{ referential.description }}
          </p>

          <!-- Stats -->
          <div class="flex items-center gap-4 pt-4 border-t border-slate-800">
            <div class="flex items-center gap-2 text-slate-500 text-sm">
              <div class="w-2 h-2 bg-cyan-500 rounded-full" />
              {{ referential.questions.length }} questions
            </div>
            <div class="flex items-center gap-2 text-slate-500 text-sm">
              <div class="w-2 h-2 bg-blue-500 rounded-full" />
              ~30-45 min
            </div>
          </div>

          <!-- Categories Preview -->
          <div class="mt-4 flex flex-wrap gap-2">
            <span
              v-for="category in getCategories(referential).slice(0, 3)"
              :key="category"
              class="px-2 py-1 bg-slate-800/50 text-slate-400 text-[10px] font-medium rounded-md uppercase tracking-wider"
            >
              {{ category }}
            </span>
            <span v-if="getCategories(referential).length > 3" class="px-2 py-1 text-slate-500 text-[10px]">
              +{{ getCategories(referential).length - 3 }} autres
            </span>
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
  </div>
</template>
