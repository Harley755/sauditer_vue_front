<script setup lang="ts">
import { PlayCircle, CheckCircle } from 'lucide-vue-next'

interface Props {
  onStartAudit?: () => void;
}

defineProps<Props>()

const steps = [
  { step: '1', title: 'Créez votre compte', desc: 'Inscription rapide et gratuite' },
  { step: '2', title: 'Choisissez votre audit', desc: 'Sélectionnez le type d\'évaluation' },
  { step: '3', title: 'Obtenez vos résultats', desc: 'Rapport instantané et actionnable' }
]
</script>

<template>
  <section class="relative py-24 px-6 overflow-hidden">
    <!-- Background decoration -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-3xl" />
    </div>

    <div class="container mx-auto max-w-5xl relative z-10">
      <div
        class="p-12 bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-cyan-500/30 rounded-3xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-5 duration-700"
      >
        <div class="text-center mb-12">
          <h2 class="text-white text-4xl lg:text-5xl mb-4">
            Prêt à commencer votre audit ?
          </h2>
          <p class="text-slate-400 text-lg max-w-2xl mx-auto">
            Lancez votre première évaluation en moins de 5 minutes et obtenez un rapport détaillé de votre posture de sécurité
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-6 mb-12">
          <div
            v-for="(item, index) in steps"
            :key="index"
            class="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-5 duration-700"
            :style="{ transitionDelay: `${index * 100}ms`, animationDelay: `${index * 100}ms` }"
          >
            <div class="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
              <span class="text-white">{{ item.step }}</span>
            </div>
            <h3 class="text-white mb-2">{{ item.title }}</h3>
            <p class="text-slate-400 text-sm">{{ item.desc }}</p>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            @click="onStartAudit"
            class="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-xl hover:shadow-cyan-500/30 transition-all flex items-center gap-2"
          >
            <PlayCircle class="w-5 h-5" />
            Commencer un audit maintenant
          </button>
          <button class="px-8 py-4 border border-slate-700 text-slate-300 rounded-lg hover:border-slate-600 hover:bg-slate-800/50 transition-all flex items-center gap-2 text-sm">
            <CheckCircle class="w-5 h-5" />
            Voir un exemple de rapport
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
