<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuditStore } from '@/stores/audit'
import Hero from '@/components/Hero.vue'
import Features from '@/components/Features.vue'
import UserTypes from '@/components/UserTypes.vue'
import AuditCTA from '@/components/AuditCTA.vue'
import Testimonials from '@/components/Testimonials.vue'
import FAQ from '@/components/FAQ.vue'
import Pricing from '@/components/Pricing.vue'
import Footer from '@/components/Footer.vue'
import LoginModal from '@/components/LoginModal.vue'
import SignupModal from '@/components/SignupModal.vue'
import DemoModal from '@/components/DemoModal.vue'

const router = useRouter()
const auditStore = useAuditStore()

const isLoginOpen = ref(false)
const isSignupOpen = ref(false)
const isDemoOpen = ref(false)
const signupUserType = ref<'citizen' | 'manager' | 'auditor' | null>(null)

const handleSignup = (userType: 'citizen' | 'manager' | 'auditor') => {
  signupUserType.value = userType
  isSignupOpen.value = true
}

const handleLoginSuccess = (userType: 'citizen' | 'manager' | 'auditor') => {
  auditStore.login(userType)
  isLoginOpen.value = false
  router.push('/dashboard')
}

const handleSignupSuccess = (userType: 'citizen' | 'manager' | 'auditor') => {
  auditStore.login(userType)
  isSignupOpen.value = false
  router.push('/dashboard')
}

const handleStartAudit = () => {
  if (auditStore.isAuthenticated) {
    router.push('/audit-selection')
  } else {
    isSignupOpen.value = true
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-950">
    <Hero 
      @login="isLoginOpen = true" 
      @signup="isSignupOpen = true"
      @demo="isDemoOpen = true"
    />
    <Features />
    <UserTypes @signup="handleSignup" />
    <AuditCTA @start-audit="handleStartAudit" />
    <Testimonials />
    <Pricing />
    <FAQ />
    <Footer />
    
    <LoginModal 
      :is-open="isLoginOpen" 
      @close="isLoginOpen = false"
      @success="handleLoginSuccess"
      @switch-to-signup="() => {
        isLoginOpen = false;
        isSignupOpen = true;
      }"
    />
    <SignupModal 
      :is-open="isSignupOpen" 
      @close="() => {
        isSignupOpen = false;
        signupUserType = null;
      }"
      @success="handleSignupSuccess"
      @switch-to-login="() => {
        isSignupOpen = false;
        isLoginOpen = true;
      }"
      :user-type="signupUserType"
    />
    <DemoModal
      :is-open="isDemoOpen"
      @close="isDemoOpen = false"
    />
  </div>
</template>
