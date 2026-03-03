<script setup lang="ts">
import { Shield, Mail, MapPin, Phone } from 'lucide-vue-next'

const links = {
  product: [
    { label: 'Fonctionnalités', href: '#' },
    { label: 'Tarification', href: '#' },
    { label: 'Démo', href: '#' },
    { label: 'API', href: '#' }
  ],
  resources: [
    { label: 'Documentation', href: '#' },
    { label: 'Guides', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Webinaires', href: '#' }
  ],
  company: [
    { label: 'À propos', href: '#' },
    { label: 'Carrières', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Partenaires', href: '#' }
  ],
  legal: [
    { label: 'Confidentialité', href: '#' },
    { label: 'Conditions', href: '#' },
    { label: 'Sécurité', href: '#' },
    { label: 'Conformité', href: '#' }
  ]
}
</script>

<template>
  <footer class="relative border-t border-slate-800 bg-slate-900/50">
    <div class="container mx-auto px-6 py-16">
      <div class="grid md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
        <!-- Brand -->
        <div class="lg:col-span-2">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Shield class="w-6 h-6 text-white" />
            </div>
            <span class="text-white text-xl tracking-tight">CyberGRC</span>
          </div>
          <p class="text-slate-400 mb-6 max-w-sm text-sm">
            La plateforme SaaS de référence pour l'auto-évaluation et la gestion GRC en cybersécurité
          </p>
          <div class="space-y-2 text-slate-400 text-sm">
            <div class="flex items-center gap-2">
              <Mail class="w-4 h-4 text-cyan-500" />
              contact@cybergrc.com
            </div>
            <div class="flex items-center gap-2">
              <Phone class="w-4 h-4 text-cyan-500" />
              +33 1 23 45 67 89
            </div>
            <div class="flex items-center gap-2">
              <MapPin class="w-4 h-4 text-cyan-500" />
              Paris, France
            </div>
          </div>
        </div>

        <!-- Links -->
        <div v-for="(group, key) in links" :key="key">
          <h3 class="text-white mb-4 text-sm font-semibold uppercase tracking-wider">
            {{ key === 'product' ? 'Produit' : key === 'resources' ? 'Ressources' : key === 'company' ? 'Entreprise' : 'Légal' }}
          </h3>
          <ul class="space-y-2">
            <li v-for="(link, index) in group" :key="index">
              <a :href="link.href" class="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Certifications -->
      <div class="py-8 border-t border-slate-800">
        <div class="flex flex-wrap items-center justify-center gap-8 mb-8">
          <div v-for="(cert, index) in ['ISO 27001', 'SOC 2', 'RGPD', 'NIST']" :key="index" class="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg">
            <span class="text-slate-400 text-sm font-medium">{{ cert }}</span>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-slate-400 text-sm">
          © 2025 CyberGRC. Tous droits réservés.
        </p>
        <div class="flex gap-6">
          <a href="#" class="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
            LinkedIn
          </a>
          <a href="#" class="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
            Twitter
          </a>
          <a href="#" class="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
            GitHub
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
