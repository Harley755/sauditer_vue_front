<script setup lang="ts">
import { Check, Sparkles } from 'lucide-vue-next'

const plans = [
  {
    name: 'Starter',
    price: '0',
    period: 'Gratuit',
    description: 'Parfait pour découvrir la plateforme',
    features: [
      '1 audit par mois',
      'Rapports basiques',
      'Support communautaire',
      'Accès limité aux frameworks',
      'Export PDF'
    ],
    cta: 'Commencer gratuitement',
    highlighted: false
  },
  {
    name: 'Professional',
    price: '99',
    period: '/ mois',
    description: 'Pour les professionnels et PME',
    features: [
      'Audits illimités',
      'Tous les frameworks (ISO 27001, NIST, RGPD)',
      'Tableaux de bord avancés',
      'Support prioritaire',
      'Gestion multi-utilisateurs (5)',
      'API access',
      'Rapports personnalisables',
      'Stockage 100 GB'
    ],
    cta: 'Essayer 14 jours gratuits',
    highlighted: true
  },
  {
    name: 'Enterprise',
    price: 'Sur mesure',
    period: '',
    description: 'Pour les grandes organisations',
    features: [
      'Tout du plan Professional',
      'Utilisateurs illimités',
      'SSO & SAML',
      'Audit trails complets',
      'SLA garanti 99.9%',
      'Manager dédié',
      'Formation personnalisée',
      'Stockage illimité',
      'Déploiement on-premise disponible'
    ],
    cta: 'Contactez-nous',
    highlighted: false
  }
]
</script>

<template>
  <section class="relative py-24 px-6 bg-slate-900/30 overflow-hidden">
    <div class="container mx-auto max-w-7xl">
      <div class="text-center mb-16 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <span class="text-cyan-400 text-sm uppercase tracking-wider">Tarification</span>
        <h2 class="text-white text-4xl lg:text-5xl mt-4 mb-4 font-bold">
          Un plan pour chaque besoin
        </h2>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">
          Commencez gratuitement, évoluez à votre rythme. Tous les plans incluent notre garantie satisfait ou remboursé de 30 jours
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <div
          v-for="(plan, index) in plans"
          :key="index"
          class="relative p-8 rounded-2xl transition-all animate-in fade-in slide-in-from-bottom-5 duration-700"
          :class="[
            plan.highlighted
              ? 'bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-cyan-500/50 shadow-xl shadow-cyan-500/10 scale-105 z-10'
              : 'bg-slate-900/50 border border-slate-800 hover:border-slate-700'
          ]"
          :style="{ transitionDelay: `${index * 100}ms`, animationDelay: `${index * 100}ms` }"
        >
          <div v-if="plan.highlighted" class="absolute -top-4 left-1/2 -translate-x-1/2">
            <span class="px-4 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm rounded-full flex items-center gap-1">
              <Sparkles class="w-3 h-3" />
              Recommandé
            </span>
          </div>

          <div class="mb-6">
            <h3 class="text-white text-2xl mb-2 font-semibold">{{ plan.name }}</h3>
            <p class="text-slate-400 text-sm">{{ plan.description }}</p>
          </div>

          <div class="mb-6">
            <div v-if="plan.price === 'Sur mesure'" class="text-white text-3xl font-bold">{{ plan.price }}</div>
            <div v-else class="flex items-baseline gap-1">
              <span class="text-white text-5xl font-bold">{{ plan.price }}</span>
              <span class="text-slate-400">€</span>
              <span class="text-slate-400">{{ plan.period }}</span>
            </div>
          </div>

          <ul class="space-y-4 mb-8">
            <li v-for="(feature, idx) in plan.features" :key="idx" class="flex items-start gap-3 text-slate-300">
              <Check class="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span class="text-sm">{{ feature }}</span>
            </li>
          </ul>

          <button
            class="w-full py-3 rounded-lg transition-all text-sm font-medium"
            :class="[
              plan.highlighted
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/25'
                : 'border border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-800/50'
            ]"
          >
            {{ plan.cta }}
          </button>
        </div>
      </div>

      <div class="mt-12 text-center animate-in fade-in duration-1000 delay-500">
        <p class="text-slate-400 text-sm">
          Besoin d'une configuration spécifique ?{' '}
          <a href="#" class="text-cyan-400 hover:text-cyan-300 transition-colors underline underline-offset-4">
            Contactez notre équipe commerciale
          </a>
        </p>
      </div>
    </div>
  </section>
</template>
