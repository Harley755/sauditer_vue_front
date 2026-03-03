<script setup lang="ts">
import { Star, Quote } from 'lucide-vue-next'

const testimonials = [
  {
    name: 'Sophie Durand',
    role: 'RSSI - Groupe Financier',
    company: 'BanquePlus',
    content: 'CyberGRC a transformé notre approche de la conformité. Nous avons réduit de 60% le temps consacré aux audits tout en améliorant notre posture de sécurité.',
    rating: 5,
    avatar: 'SD'
  },
  {
    name: 'Marc Lefebvre',
    role: 'Consultant Cybersécurité',
    company: 'SecureConsult',
    content: 'En tant qu\'auditeur, j\'apprécie particulièrement la flexibilité de la plateforme et la richesse de sa bibliothèque de contrôles. Un outil indispensable.',
    rating: 5,
    avatar: 'ML'
  },
  {
    name: 'Julie Martin',
    role: 'Directrice IT',
    company: 'TechCorp',
    content: 'L\'interface est intuitive et les rapports sont clairs. Même sans expertise approfondie en cybersécurité, nous pouvons gérer efficacement nos risques.',
    rating: 5,
    avatar: 'JM'
  }
]
</script>

<template>
  <section class="relative py-24 px-6 overflow-hidden">
    <div class="container mx-auto max-w-7xl">
      <div class="text-center mb-16 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <span class="text-cyan-400 text-sm uppercase tracking-wider">Témoignages</span>
        <h2 class="text-white text-4xl lg:text-5xl mt-4 mb-4">
          Ils nous font confiance
        </h2>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">
          Découvrez comment CyberGRC aide les organisations à sécuriser leurs activités
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <div
          v-for="(testimonial, index) in testimonials"
          :key="index"
          class="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all relative animate-in fade-in slide-in-from-bottom-5 duration-700"
          :style="{ transitionDelay: `${index * 100}ms`, animationDelay: `${index * 100}ms` }"
        >
          <Quote class="absolute top-8 right-8 w-8 h-8 text-cyan-500/20" />
          
          <div class="flex gap-1 mb-4">
            <Star v-for="i in testimonial.rating" :key="i" class="w-4 h-4 fill-cyan-500 text-cyan-500" />
          </div>

          <p class="text-slate-300 mb-6 leading-relaxed text-sm">
            "{{ testimonial.content }}"
          </p>

          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-sm">
              <span class="text-white">{{ testimonial.avatar }}</span>
            </div>
            <div>
              <div class="text-white text-sm">{{ testimonial.name }}</div>
              <div class="text-slate-400 text-[10px]">{{ testimonial.role }}</div>
              <div class="text-slate-500 text-[10px]">{{ testimonial.company }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-16 text-center animate-in fade-in duration-1000 delay-500">
        <div class="flex items-center justify-center gap-8 text-slate-400">
          <div class="text-center">
            <div class="text-white text-3xl mb-1 font-bold">500+</div>
            <div class="text-[10px] uppercase tracking-wider">Organisations</div>
          </div>
          <div class="w-px h-12 bg-slate-800" />
          <div class="text-center">
            <div class="text-white text-3xl mb-1 font-bold">10K+</div>
            <div class="text-[10px] uppercase tracking-wider">Audits réalisés</div>
          </div>
          <div class="w-px h-12 bg-slate-800" />
          <div class="text-center">
            <div class="text-white text-3xl mb-1 font-bold">99.9%</div>
            <div class="text-[10px] uppercase tracking-wider">Disponibilité</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
