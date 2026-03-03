<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import { RouterView } from 'vue-router'
import Notifications from '@/components/ui/Notifications.vue'
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-50 antialiased font-sans">
    <RouterView />
    <Notifications />
    <Toaster position="top-right" close-button rich-colors />
  </div>
</template>

<style>
/* Base styles moved to index.css */
</style>
