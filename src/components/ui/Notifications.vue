<script setup lang="ts">
import { computed } from 'vue'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-vue-next'
import { useNotifications, type Notification } from '@/composables/useNotifications'

const { notifications, removeNotification } = useNotifications()

const getIcon = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return CheckCircle
    case 'error':
      return AlertCircle
    case 'warning':
      return AlertTriangle
    case 'info':
      return Info
    default:
      return Info
  }
}

const getIconClasses = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return 'text-green-500'
    case 'error':
      return 'text-red-500'
    case 'warning':
      return 'text-yellow-500'
    case 'info':
      return 'text-blue-500'
    default:
      return 'text-blue-500'
  }
}

const getBorderClasses = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return 'border-green-500/20 bg-green-50 dark:bg-green-950/20'
    case 'error':
      return 'border-red-500/20 bg-red-50 dark:bg-red-950/20'
    case 'warning':
      return 'border-yellow-500/20 bg-yellow-50 dark:bg-yellow-950/20'
    case 'info':
      return 'border-blue-500/20 bg-blue-50 dark:bg-blue-950/20'
    default:
      return 'border-blue-500/20 bg-blue-50 dark:bg-blue-950/20'
  }
}

const getTextClasses = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return 'text-green-800 dark:text-green-200'
    case 'error':
      return 'text-red-800 dark:text-red-200'
    case 'warning':
      return 'text-yellow-800 dark:text-yellow-200'
    case 'info':
      return 'text-blue-800 dark:text-blue-200'
    default:
      return 'text-blue-800 dark:text-blue-200'
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      <Transition
        v-for="notification in notifications"
        :key="notification.id"
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="transform translate-x-full opacity-0"
        enter-to-class="transform translate-x-0 opacity-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="transform translate-x-0 opacity-100"
        leave-to-class="transform translate-x-full opacity-0"
      >
        <div
          :class="[
            'p-4 rounded-lg border shadow-lg backdrop-blur-sm',
            getBorderClasses(notification.type)
          ]"
        >
          <div class="flex items-start gap-3">
            <component
              :is="getIcon(notification.type)"
              :class="['w-5 h-5 flex-shrink-0 mt-0.5', getIconClasses(notification.type)]"
            />
            
            <div class="flex-1 min-w-0">
              <h4
                :class="[
                  'font-semibold text-sm',
                  getTextClasses(notification.type)
                ]"
              >
                {{ notification.title }}
              </h4>
              <p
                v-if="notification.message"
                :class="[
                  'text-xs mt-1',
                  getTextClasses(notification.type)
                ]"
              >
                {{ notification.message }}
              </p>
            </div>
            
            <button
              @click="removeNotification(notification.id)"
              :class="[
                'p-1 rounded-md transition-colors',
                getTextClasses(notification.type),
                'hover:bg-black/10 dark:hover:bg-white/10'
              ]"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>
