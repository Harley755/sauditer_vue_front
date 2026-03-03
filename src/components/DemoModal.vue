<script setup lang="ts">
import { ref } from 'vue'
import { X, Calendar, Building, Mail, Phone, Users, MessageSquare, CheckCircle } from 'lucide-vue-next'

interface Props {
  isOpen: boolean;
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const submitted = ref(false)

const handleSubmit = () => {
  submitted.value = true
  setTimeout(() => {
    submitted.value = false
    emit('close')
  }, 3000)
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop -->
        <div 
          class="fixed inset-0 bg-black/60 backdrop-blur-sm"
          @click="emit('close')"
        ></div>

        <!-- Modal Wrapper -->
        <div class="flex min-h-full items-center justify-center p-4">
          <Transition
            appear
            enter-active-class="transition duration-300 ease-out delay-75"
            enter-from-class="opacity-0 scale-95 translate-y-5"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-5"
          >
            <div 
              class="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-8 relative shadow-2xl my-8"
              @click.stop
            >
              <!-- Close button -->
              <button
                @click="emit('close')"
                class="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X class="w-5 h-5" />
              </button>

              <div v-if="!submitted">
                <!-- Header -->
                <div class="text-center mb-8">
                  <div class="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Calendar class="w-7 h-7 text-white" />
                  </div>
                  <h2 class="text-white text-2xl mb-2 font-bold">Demander une démo</h2>
                  <p class="text-slate-400 text-sm">Découvrez CyberGRC avec un expert en cybersécurité</p>
                </div>

                <!-- Form -->
                <form @submit.prevent="handleSubmit" class="space-y-4">
                  <div class="grid md:grid-cols-2 gap-4">
                    <div>
                      <label class="text-slate-300 text-sm font-medium mb-1.5 block">Prénom *</label>
                      <input
                        type="text"
                        placeholder="Jean"
                        required
                        class="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label class="text-slate-300 text-sm font-medium mb-1.5 block">Nom *</label>
                      <input
                        type="text"
                        placeholder="Dupont"
                        required
                        class="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="text-slate-300 text-sm font-medium mb-1.5 block">Email professionnel *</label>
                    <div class="relative">
                      <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        placeholder="votre@entreprise.com"
                        required
                        class="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="text-slate-300 text-sm font-medium mb-1.5 block">Téléphone</label>
                    <div class="relative">
                      <Phone class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        placeholder="+33 6 12 34 56 78"
                        class="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="text-slate-300 text-sm font-medium mb-1.5 block">Entreprise *</label>
                    <div class="relative">
                      <Building class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Nom de votre entreprise"
                        required
                        class="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="text-slate-300 text-sm font-medium mb-1.5 block">Taille de l'entreprise *</label>
                    <div class="relative">
                      <Users class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select
                        required
                        class="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors appearance-none"
                      >
                        <option value="">Sélectionnez...</option>
                        <option value="1-10">1-10 employés</option>
                        <option value="11-50">11-50 employés</option>
                        <option value="51-200">51-200 employés</option>
                        <option value="201-500">201-500 employés</option>
                        <option value="501+">Plus de 500 employés</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label class="text-slate-300 text-sm font-medium mb-1.5 block">Message (optionnel)</label>
                    <div class="relative">
                      <MessageSquare class="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <textarea
                        placeholder="Parlez-nous de vos besoins en cybersécurité..."
                        rows="4"
                        class="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                      ></textarea>
                    </div>
                  </div>

                  <button
                    type="submit"
                    class="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all text-sm font-semibold mt-4"
                  >
                    Envoyer la demande
                  </button>
                </form>

                <p class="mt-4 text-center text-slate-500 text-sm">
                  Un expert vous contactera sous 24h ouvrées
                </p>
              </div>

              <div v-else class="text-center py-8">
                <!-- Success state -->
                <div class="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-500">
                  <CheckCircle class="w-10 h-10 text-white" />
                </div>
                <h3 class="text-white text-2xl mb-2 font-bold">Demande envoyée !</h3>
                <p class="text-slate-400 text-sm">
                  Merci pour votre intérêt. Un expert vous contactera très prochainement.
                </p>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
