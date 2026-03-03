import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

// Types pour les notifications
export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'default'

export interface NotificationOptions {
  message: string
  type?: NotificationType
  duration?: number
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
}

class NotificationService {
  private toast: ReturnType<typeof useToast> | null = null

  constructor() {
    // Initialiser plus tard quand on est dans un composant Vue
  }

  private getToast() {
    if (!this.toast) {
      this.toast = useToast()
    }
    return this.toast
  }

  show(options: NotificationOptions) {
    const toast = this.getToast()
    const { message, type = 'info', duration = 5000 } = options
    
    return toast.open({
      message,
      type,
      duration,
      dismissible: true,
      pauseOnHover: true
    })
  }

  success(message: string, options?: Partial<NotificationOptions>) {
    const toast = this.getToast()
    const { duration = 5000 } = options || {}
    return toast.success(message, { duration })
  }

  error(message: string, options?: Partial<NotificationOptions>) {
    const toast = this.getToast()
    const { duration = 8000 } = options || {} // Plus long pour les erreurs
    return toast.error(message, { duration })
  }

  warning(message: string, options?: Partial<NotificationOptions>) {
    const toast = this.getToast()
    const { duration = 6000 } = options || {}
    return toast.warning(message, { duration })
  }

  info(message: string, options?: Partial<NotificationOptions>) {
    const toast = this.getToast()
    const { duration = 5000 } = options || {}
    return toast.info(message, { duration })
  }

  clear() {
    const toast = this.getToast()
    toast.clear()
  }
}

export const notificationService = new NotificationService()
