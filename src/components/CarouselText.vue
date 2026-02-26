<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Shield, Zap, Lock, BarChart3, Users } from 'lucide-vue-next'

const features = [
  {
    icon: Shield,
    text: 'Conformité automatisée aux normes ISO 27001, NIST et RGPD',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    icon: Zap,
    text: 'Audits en temps réel avec rapports instantanés',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    icon: Lock,
    text: 'Chiffrement de niveau entreprise pour vos données sensibles',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    icon: BarChart3,
    text: 'Tableaux de bord intelligents et analytics prédictifs',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Users,
    text: 'Collaboration multi-équipes avec gestion des rôles avancée',
    color: 'from-pink-500 to-cyan-500'
  }
]

const currentIndex = ref(0)
let timer: any

onMounted(() => {
  timer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % features.length
  }, 4000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const setCurrentIndex = (index: number) => {
  currentIndex.value = index
}
</script>

<template>
  <div class="relative h-24 flex items-center justify-center overflow-hidden">
    <Transition
      mode="out-in"
      enter-active-class="transition duration-500 ease-out transform"
      enter-from-class="opacity-0 translate-y-5"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-500 ease-in transform"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-5"
    >
      <div
        :key="currentIndex"
        class="flex items-center gap-4"
      >
        <div :class="`p-3 bg-gradient-to-br ${features[currentIndex].color} rounded-lg`">
          <component :is="features[currentIndex].icon" class="w-6 h-6 text-white" />
        </div>
        <p class="text-slate-300 text-lg max-w-2xl">
          {{ features[currentIndex].text }}
        </p>
      </div>
    </Transition>

    <!-- Indicators -->
    <div class="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
      <button
        v-for="(_, index) in features"
        :key="index"
        @click="setCurrentIndex(index)"
        class="h-2 rounded-full transition-all"
        :class="[
          index === currentIndex 
            ? 'bg-cyan-500 w-8' 
            : 'bg-slate-700 hover:bg-slate-600 w-2'
        ]"
      />
    </div>
  </div>
</template>
