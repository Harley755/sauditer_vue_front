<script setup lang="ts">
import { Shield, ChevronRight } from 'lucide-vue-next'
import CarouselText from './CarouselText.vue'

interface Props {
  onLogin: () => void;
  onSignup: () => void;
  onDemo: () => void;
}

const props = defineProps<Props>()
</script>

<template>
  <div class="relative overflow-hidden">
    <!-- Background decorations -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-cyan-500/10 rounded-full" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-cyan-500/5 rounded-full" />
    </div>

    <!-- Navigation -->
    <nav class="relative z-10 container mx-auto px-6 py-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 animate-in fade-in slide-in-from-left-5 duration-700">
          <div class="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Shield class="w-6 h-6 text-white" />
          </div>
          <span class="text-white text-xl tracking-tight">CyberGRC</span>
        </div>

        <div class="flex items-center gap-4 animate-in fade-in slide-in-from-right-5 duration-700">
          <button
            @click="onLogin"
            class="px-5 py-2 text-slate-300 hover:text-white transition-colors"
          >
            Connexion
          </button>
          <button
            @click="onSignup"
            class="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
          >
            Commencer
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero content -->
    <div class="relative z-10 container mx-auto px-6 py-20 lg:py-32">
      <div class="max-w-4xl mx-auto text-center">
        <div class="mb-6 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
          <span class="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm">
            <span class="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            Plateforme SaaS de Cybersécurité GRC
          </span>
        </div>

        <h1
          class="text-white text-5xl lg:text-7xl mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300"
        >
          Auto-évaluation et gestion GRC simplifiées
        </h1>

        <p
          class="text-slate-400 text-xl mb-12 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700 delay-400"
        >
          Protégez votre organisation avec une plateforme complète de gouvernance, risques et conformité en cybersécurité
        </p>

        <!-- Carousel -->
        <div class="mb-12 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-500">
          <CarouselText />
        </div>

        <div
          class="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-700"
        >
          <button
            @click="onSignup"
            class="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-xl hover:shadow-cyan-500/30 transition-all flex items-center gap-2"
          >
            Démarrer gratuitement
            <ChevronRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            @click="onDemo"
            class="px-8 py-4 border border-slate-700 text-slate-300 rounded-lg hover:border-slate-600 hover:bg-slate-900/50 transition-all"
          >
            Demander une démo
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
