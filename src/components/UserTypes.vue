<script setup lang="ts">
import { User, ShieldCheck, SearchCheck, ArrowRight } from 'lucide-vue-next'

const userTypes = [
  {
    id: 'citizen' as const,
    icon: User,
    title: 'Citoyen / Professionnel',
    description: 'Évaluez votre posture de sécurité personnelle ou celle de votre petite entreprise',
    features: [
      'Auto-évaluation guidée',
      'Rapports simplifiés',
      'Recommandations personnalisées',
      'Support communautaire'
    ],
    color: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'manager' as const,
    icon: ShieldCheck,
    title: 'Responsable Sécurité',
    description: 'Gérez la conformité et les risques de votre organisation en toute simplicité',
    features: [
      'Tableaux de bord avancés',
      'Gestion multi-sites',
      'Rapports conformité',
      'Alertes en temps réel'
    ],
    color: 'from-blue-500 to-indigo-500',
    featured: true
  },
  {
    id: 'auditor' as const,
    icon: SearchCheck,
    title: 'Expert Auditeur',
    description: 'Réalisez des audits complets avec des outils professionnels de pointe',
    features: [
      'Méthodologies certifiées',
      'Rapports personnalisables',
      'Gestion clients multiples',
      'Bibliothèque de contrôles'
    ],
    color: 'from-indigo-500 to-purple-500'
  }
]

interface Props {
  onSignup: (userType: 'citizen' | 'manager' | 'auditor') => void;
}

defineProps<Props>()
</script>

<template>
  <section class="relative py-24 px-6 bg-slate-900/30 overflow-hidden">
    <div class="container mx-auto max-w-7xl">
      <div class="text-center mb-16 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <span class="text-cyan-400 text-sm uppercase tracking-wider">Profils utilisateurs</span>
        <h2 class="text-white text-4xl lg:text-5xl mt-4 mb-4">
          Une solution adaptée à chaque profil
        </h2>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">
          Que vous soyez un particulier, un responsable sécurité ou un expert auditeur, nous avons la solution qui vous convient
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <div
          v-for="(type, index) in userTypes"
          :key="type.id"
          class="relative p-8 bg-slate-900/50 border rounded-2xl hover:scale-105 transition-all animate-in fade-in slide-in-from-bottom-5 duration-700"
          :class="[
            type.featured 
              ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/10' 
              : 'border-slate-800 hover:border-slate-700'
          ]"
          :style="{ transitionDelay: `${index * 100}ms`, animationDelay: `${index * 100}ms` }"
        >
          <div v-if="type.featured" class="absolute -top-4 left-1/2 -translate-x-1/2">
            <span class="px-4 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm rounded-full">
              Populaire
            </span>
          </div>

          <div :class="`w-14 h-14 bg-gradient-to-br ${type.color} rounded-xl flex items-center justify-center mb-6`">
            <component :is="type.icon" class="w-7 h-7 text-white" />
          </div>

          <h3 class="text-white text-2xl mb-3">{{ type.title }}</h3>
          <p class="text-slate-400 mb-6 text-sm">{{ type.description }}</p>

          <ul class="space-y-3 mb-8">
            <li v-for="(feature, idx) in type.features" :key="idx" class="flex items-start gap-2 text-slate-300 text-sm">
              <div class="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2" />
              {{ feature }}
            </li>
          </ul>

          <button
            @click="onSignup(type.id)"
            class="w-full py-3 rounded-lg transition-all flex items-center justify-center gap-2 group"
            :class="[
              type.featured
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/25'
                : 'border border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-800/50'
            ]"
          >
            Créer un compte
            <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
