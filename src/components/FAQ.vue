<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

const faqs = [
  {
    question: 'Qu\'est-ce que la gestion GRC en cybersécurité ?',
    answer: 'GRC signifie Gouvernance, Risques et Conformité. C\'est une approche intégrée qui permet aux organisations de gérer leur stratégie de cybersécurité, d\'identifier et de mitiger les risques, et de maintenir la conformité avec les réglementations et normes applicables (ISO 27001, RGPD, NIST, etc.).'
  },
  {
    question: 'Combien de temps prend un audit initial ?',
    answer: 'Un audit basique peut être complété en 15-30 minutes. Pour un audit complet avec l\'ensemble des contrôles ISO 27001, comptez 2-4 heures selon la taille de votre organisation. Notre système sauvegarde automatiquement votre progression, vous permettant de compléter l\'audit en plusieurs sessions.'
  },
  {
    question: 'Mes données sont-elles sécurisées ?',
    answer: 'Absolument. Nous utilisons un chiffrement AES-256 pour toutes les données en transit et au repos. Notre infrastructure est hébergée sur des serveurs certifiés ISO 27001 et SOC 2. Nous ne partageons jamais vos données avec des tiers et vous gardez le contrôle total de vos informations.'
  },
  {
    question: 'Puis-je changer de plan à tout moment ?',
    answer: 'Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement et nous calculons les ajustements de facturation au prorata. Aucun engagement à long terme n\'est requis.'
  },
  {
    question: 'Quels frameworks de conformité sont supportés ?',
    answer: 'Nous supportons les principaux frameworks internationaux : ISO 27001, ISO 27002, NIST CSF, NIST 800-53, RGPD, SOC 2, PCI-DSS, HIPAA, et bien d\'autres. De nouveaux frameworks sont ajoutés régulièrement selon les demandes de nos utilisateurs.'
  },
  {
    question: 'Proposez-vous de la formation ?',
    answer: 'Oui, tous nos plans incluent l\'accès à notre bibliothèque de tutoriels vidéo et documentation. Les plans Professional et Enterprise bénéficient également de webinaires mensuels. Le plan Enterprise inclut des sessions de formation personnalisées pour votre équipe.'
  },
  {
    question: 'Comment fonctionne le support technique ?',
    answer: 'Le plan Starter bénéficie du support communautaire via notre forum. Le plan Professional inclut le support par email avec réponse sous 24h. Le plan Enterprise offre un support prioritaire 24/7 avec un gestionnaire de compte dédié et un SLA garanti.'
  },
  {
    question: 'Puis-je exporter mes rapports ?',
    answer: 'Oui, tous les rapports peuvent être exportés en PDF, Excel ou Word. Le plan Professional permet également la personnalisation complète des templates de rapports avec votre branding, et l\'API permet l\'intégration avec vos outils existants.'
  }
]

const openIndex = ref<number | null>(null)

const toggleFaq = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <section class="relative py-24 px-6 overflow-hidden">
    <div class="container mx-auto max-w-4xl">
      <div class="text-center mb-16 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <span class="text-cyan-400 text-sm uppercase tracking-wider">FAQ</span>
        <h2 class="text-white text-4xl lg:text-5xl mt-4 mb-4 font-bold">
          Questions fréquentes
        </h2>
        <p class="text-slate-400 text-lg">
          Vous avez des questions ? Nous avons les réponses
        </p>
      </div>

      <div class="space-y-4">
        <div
          v-for="(faq, index) in faqs"
          :key="index"
          class="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/50 animate-in fade-in slide-in-from-bottom-5 duration-700"
          :style="{ transitionDelay: `${index * 50}ms`, animationDelay: `${index * 50}ms` }"
        >
          <button
            @click="toggleFaq(index)"
            class="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors focus:outline-none"
          >
            <span class="text-white pr-8 text-sm md:text-base font-medium">{{ faq.question }}</span>
            <ChevronDown
              class="w-5 h-5 text-cyan-400 flex-shrink-0 transition-transform duration-300"
              :class="[openIndex === index ? 'rotate-180' : '']"
            />
          </button>
          
          <Transition
            enter-active-class="transition-[max-height,opacity] duration-300 ease-out overflow-hidden"
            enter-from-class="max-h-0 opacity-0"
            enter-to-class="max-h-[500px] opacity-100"
            leave-active-class="transition-[max-height,opacity] duration-300 ease-in overflow-hidden"
            leave-from-class="max-h-[500px] opacity-100"
            leave-to-class="max-h-0 opacity-0"
          >
            <div v-if="openIndex === index">
              <div class="px-6 pb-5 text-slate-400 leading-relaxed border-t border-slate-800/50 pt-5 text-sm">
                {{ faq.answer }}
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <div class="mt-12 text-center p-8 bg-slate-900/50 border border-slate-800 rounded-xl animate-in fade-in duration-1000 delay-500">
        <p class="text-slate-300 mb-4 text-sm font-medium">
          Vous ne trouvez pas la réponse à votre question ?
        </p>
        <button class="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all text-sm font-semibold">
          Contactez notre support
        </button>
      </div>
    </div>
  </section>
</template>
