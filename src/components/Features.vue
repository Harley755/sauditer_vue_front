<script setup lang="ts">
import { Shield, FileCheck, AlertTriangle, TrendingUp, Users, Lock } from 'lucide-vue-next'

const features = [
  {
    icon: Shield,
    title: 'Auto-évaluation intelligente',
    description: 'Évaluez votre posture de sécurité en quelques clics avec notre IA avancée'
  },
  {
    icon: FileCheck,
    title: 'Conformité multi-normes',
    description: 'ISO 27001, NIST, RGPD, SOC 2 - Gérez toutes vos conformités en un seul endroit'
  },
  {
    icon: AlertTriangle,
    title: 'Gestion des risques',
    description: 'Identifiez, évaluez et mitigez les risques cyber de manière proactive'
  },
  {
    icon: TrendingUp,
    title: 'Analytics en temps réel',
    description: 'Visualisez vos métriques de sécurité avec des dashboards personnalisables'
  },
  {
    icon: Users,
    title: 'Collaboration intégrée',
    description: 'Travaillez en équipe avec des workflows adaptés à chaque rôle'
  },
  {
    icon: Lock,
    title: 'Sécurité garantie',
    description: 'Hébergement sécurisé avec chiffrement end-to-end et conformité certifiée'
  }
]
</script>

<template>
  <section class="relative py-24 px-6 overflow-hidden">
    <div class="container mx-auto max-w-7xl">
      <div class="text-center mb-16 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <span class="text-cyan-400 text-sm uppercase tracking-wider">Fonctionnalités</span>
        <h2 class="text-white text-4xl lg:text-5xl mt-4 mb-4">
          Une plateforme complète pour votre cybersécurité
        </h2>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">
          Tous les outils dont vous avez besoin pour gérer efficacement votre gouvernance, vos risques et votre conformité
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="group p-8 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-cyan-500/50 hover:bg-slate-900/80 transition-all animate-in fade-in slide-in-from-bottom-5 duration-700"
          :style="{ transitionDelay: `${index * 100}ms`, animationDelay: `${index * 100}ms` }"
        >
          <div class="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <component :is="feature.icon" class="w-6 h-6 text-cyan-400" />
          </div>
          <h3 class="text-white text-xl mb-3">{{ feature.title }}</h3>
          <p class="text-slate-400">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
