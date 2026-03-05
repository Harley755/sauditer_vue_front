import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface AuditAnswer {
  questionId: string;
  answer: string; // Changé pour accepter n'importe quelle chaîne de l'API
  notes?: string;
}

export interface AuditSession {
  referentialId: string;
  answers: AuditAnswer[];
  startedAt: Date;
  completedAt?: Date;
  userType?: 'citizen' | 'manager' | 'auditor';
}

export const useAuditStore = defineStore('audit', () => {
  const currentAudit = ref<AuditSession | null>(null)
  const isAuthenticated = ref(false)
  const userType = ref<'citizen' | 'manager' | 'auditor' | null>(null)

  const startAudit = (referentialId: string) => {
    currentAudit.value = {
      referentialId,
      answers: [],
      startedAt: new Date(),
      userType: userType.value || undefined
    }
  }

  const answerQuestion = (questionId: string, answer: string, notes?: string) => {
    console.log("AUDIT STORE - ANSWER QUESTION:", { questionId, answer, notes })
    
    if (!currentAudit.value) return

    const existingIndex = currentAudit.value.answers.findIndex(a => a.questionId === questionId)
    if (existingIndex >= 0) {
      currentAudit.value.answers[existingIndex] = { questionId, answer, notes }
    } else {
      currentAudit.value.answers.push({ questionId, answer, notes })
    }
  }

  const completeAudit = () => {
    if (!currentAudit.value) return
    currentAudit.value.completedAt = new Date()
  }

  const login = (type: 'citizen' | 'manager' | 'auditor') => {
    isAuthenticated.value = true
    userType.value = type
  }

  const logout = () => {
    isAuthenticated.value = false
    userType.value = null
    currentAudit.value = null
  }

  return {
    currentAudit,
    isAuthenticated,
    userType,
    startAudit,
    answerQuestion,
    completeAudit,
    login,
    logout
  }
})
