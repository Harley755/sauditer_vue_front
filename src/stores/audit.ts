import { defineStore } from 'pinia'
import { ref } from 'vue'
import { questionnaireService } from '@/services/questionnaireService'
import type { SyncResult } from '@/types/questionnaire'

const AUDIT_SESSIONS_KEY = "audit-sessions"  // Clé pour toutes les sessions d'audit

export interface AuditAnswer {
  questionId: string;
  answer: string; // Changé pour accepter n'importe quelle chaîne de l'API
  notes?: string;
}

export interface AuditSession {
  questionnaireId: string;  // Changé de referentialId à questionnaireId
  answers: AuditAnswer[];
  startedAt: Date;
  completedAt?: Date;
  userType?: 'citizen' | 'manager' | 'auditor';
}

export interface AuditSessions {
  [questionnaireId: string]: AuditSession;  // Dictionnaire de sessions par questionnaireId
}

export const useAuditStore = defineStore('audit', () => {
  const currentAudit = ref<AuditSession | null>(null)
  const isAuthenticated = ref(false)
  const userType = ref<'citizen' | 'manager' | 'auditor' | null>(null)
  const isOnline = ref(true)
  const lastSyncTime = ref<Date | null>(null)
  const syncFailed = ref(false)
  const pendingSync = ref(false)

  const startAudit = (questionnaireId: string) => {

    // Récupérer toutes les sessions sauvegardées
    const savedSessions = localStorage.getItem(AUDIT_SESSIONS_KEY)
    let sessions: AuditSessions = {}
    
    if (savedSessions) {
      try {
        sessions = JSON.parse(savedSessions)
      } catch (error) {
        console.error("Erreur parsing sessions:", error)
        sessions = {}
      }
    }

    // Vérifier si une session existe pour ce questionnaire et n'est pas complétée
    const existingSession = sessions[questionnaireId]
    if (existingSession && !existingSession.completedAt) {
      // Restaurer la session existante
      existingSession.startedAt = new Date(existingSession.startedAt)
      if (existingSession.completedAt) {
        existingSession.completedAt = new Date(existingSession.completedAt)
      }
      
      currentAudit.value = existingSession
      console.log("Session restaurée pour questionnaire:", questionnaireId)
      return
    }

    // Créer une nouvelle session SANS écraser les existantes
    const newSession: AuditSession = {
      questionnaireId,
      answers: [],
      startedAt: new Date(),
      userType: userType.value || undefined
    }

    // Ajouter la nouvelle session aux sessions existantes (PAS de remplacement)
    sessions[questionnaireId] = newSession
    currentAudit.value = newSession

    // Sauvegarder TOUTES les sessions (anciennes + nouvelle)
    localStorage.setItem(AUDIT_SESSIONS_KEY, JSON.stringify(sessions))
    console.log("Nouvelle session créée pour questionnaire:", questionnaireId)
    console.log("Total sessions sauvegardées:", Object.keys(sessions).length)
  }

  // const answerQuestion = (questionId: string, answer: string, notes?: string) => {
  //   console.log("AUDIT STORE - ANSWER QUESTION:", { questionId, answer, notes })
    
  //   if (!currentAudit.value) return

  //   const existingIndex = currentAudit.value.answers.findIndex(a => a.questionId === questionId)
  //   if (existingIndex >= 0) {
  //     currentAudit.value.answers[existingIndex] = { questionId, answer, notes }
  //   } else {
  //     currentAudit.value.answers.push({ questionId, answer, notes })
  //   }
  // }

  const answerQuestion = async (questionId: string, answer: string, notes?: string, autoSync: boolean = false) => {

    if (!currentAudit.value) return

    const existing = currentAudit.value.answers.find(
      a => a.questionId === questionId
    )

    if (existing) {
      existing.answer = answer
      existing.notes = notes
    } else {
      currentAudit.value.answers.push({
        questionId,
        answer,
        notes
      })
    }

    // Sauvegarder dans localStorage immédiatement
    const savedSessions = localStorage.getItem(AUDIT_SESSIONS_KEY)
    let sessions: AuditSessions = {}
    
    if (savedSessions) {
      try {
        sessions = JSON.parse(savedSessions)
      } catch (error) {
        console.error("Erreur parsing sessions:", error)
        sessions = {}
      }
    }

    // Mettre à jour la session courante
    if (currentAudit.value) {
      sessions[currentAudit.value.questionnaireId] = currentAudit.value
      localStorage.setItem(AUDIT_SESSIONS_KEY, JSON.stringify(sessions))
    }

    // Synchronisation progressive avec le backend (désactivée par défaut)
    if (autoSync && isOnline.value) {
      await syncWithBackend()
    }
  }

  const filterValidAnswers = (validQuestionIds: string[]) => {
    if (!currentAudit.value) return

    // Filtrer uniquement les réponses qui correspondent aux questions du questionnaire courant
    currentAudit.value.answers = currentAudit.value.answers.filter(
      answer => validQuestionIds.includes(answer.questionId)
    )

    // Sauvegarder le nettoyage dans les multi-sessions
    const savedSessions = localStorage.getItem(AUDIT_SESSIONS_KEY)
    let sessions: AuditSessions = {}
    
    if (savedSessions) {
      try {
        sessions = JSON.parse(savedSessions)
      } catch (error) {
        console.error("Erreur parsing sessions:", error)
        sessions = {}
      }
    }

    // Mettre à jour la session filtrée
    sessions[currentAudit.value.questionnaireId] = currentAudit.value
    localStorage.setItem(AUDIT_SESSIONS_KEY, JSON.stringify(sessions))
  }

  const completeAudit = () => {

    if (!currentAudit.value) return

    currentAudit.value.completedAt = new Date()

    // Mettre à jour la session complétée dans les multi-sessions
    const savedSessions = localStorage.getItem(AUDIT_SESSIONS_KEY)
    let sessions: AuditSessions = {}
    
    if (savedSessions) {
      try {
        sessions = JSON.parse(savedSessions)
      } catch (error) {
        console.error("Erreur parsing sessions:", error)
        sessions = {}
      }
    }

    sessions[currentAudit.value.questionnaireId] = currentAudit.value
    localStorage.setItem(AUDIT_SESSIONS_KEY, JSON.stringify(sessions))
    
    // Optionnel: réinitialiser le store
    currentAudit.value = null
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

  const clearCorruptedSession = () => {
    localStorage.removeItem(AUDIT_SESSIONS_KEY)
    currentAudit.value = null
  }

  const getAllSessions = (): AuditSessions => {
    const savedSessions = localStorage.getItem(AUDIT_SESSIONS_KEY)
    if (savedSessions) {
      try {
        return JSON.parse(savedSessions)
      } catch (error) {
        console.error("Erreur parsing sessions:", error)
        return {}
      }
    }
    return {}
  }

  const clearCompletedSessions = () => {
    const sessions = getAllSessions()
    const activeSessions: AuditSessions = {}
    
    // Ne garder que les sessions non complétées
    for (const [questionnaireId, session] of Object.entries(sessions)) {
      if (!session.completedAt) {
        activeSessions[questionnaireId] = session
      }
    }
    
    localStorage.setItem(AUDIT_SESSIONS_KEY, JSON.stringify(activeSessions))
    console.log("Sessions complétées nettoyées")
  }

  const switchToAudit = (questionnaireId: string) => {
    const sessions = getAllSessions()
    const session = sessions[questionnaireId]
    
    if (session && !session.completedAt) {
      session.startedAt = new Date(session.startedAt)
      if (session.completedAt) {
        session.completedAt = new Date(session.completedAt)
      }
      
      currentAudit.value = session
      console.log("Basculé vers l'audit:", questionnaireId)
      return true
    }
    
    console.error("Audit non trouvé ou déjà complété:", questionnaireId)
    return false
  }

  // Synchronisation avec le backend
  const syncWithBackend = async (): Promise<SyncResult> => {
    if (!currentAudit.value || !isOnline.value) {
      return {
        success: false,
        synced_answers: 0,
        failed_answers: currentAudit.value?.answers.length || 0,
        error_message: 'Pas de session active ou hors ligne'
      }
    }

    try {
      pendingSync.value = true
      
      // Convertir les réponses pour l'API
      const answers = currentAudit.value.answers.map(a => ({
        question_id: a.questionId,
        valeur: a.answer,
        commentaire: a.notes
      }))

      const result = await questionnaireService.syncWithRetry(currentAudit.value.questionnaireId, answers)
      
      if (result.success) {
        lastSyncTime.value = new Date()
        syncFailed.value = false
        console.log("✅ Synchronisation réussie:", result)
      } else {
        syncFailed.value = true
        console.error("❌ Échec de synchronisation:", result)
      }

      return result
    } catch (error) {
      syncFailed.value = true
      console.error("❌ Erreur de synchronisation:", error)
      return {
        success: false,
        synced_answers: 0,
        failed_answers: currentAudit.value?.answers.length || 0,
        error_message: error instanceof Error ? error.message : 'Erreur inconnue'
      }
    } finally {
      pendingSync.value = false
    }
  }

  // Soumission finale
  const submitFinalAudit = async () => {
    if (!currentAudit.value) {
      throw new Error('Aucun audit en cours')
    }

    try {
      pendingSync.value = true
      
      // Convertir les réponses pour l'API
      const answers = currentAudit.value.answers.map(a => ({
        question_id: a.questionId,
        valeur: a.answer,
        commentaire: a.notes
      }))

      const result = await questionnaireService.submitFinalAnswers(currentAudit.value.questionnaireId, answers)
      
      if (result.saved_responses_count > 0) {
        currentAudit.value.completedAt = new Date()
        
        // Mettre à jour localStorage
        const sessions = getAllSessions()
        sessions[currentAudit.value.questionnaireId] = currentAudit.value
        localStorage.setItem(AUDIT_SESSIONS_KEY, JSON.stringify(sessions))
        
        // Réinitialiser le store
        currentAudit.value = null
        
        console.log("✅ Audit finalisé avec succès:", result)
        return result
      } else {
        throw new Error('Aucune réponse sauvegardée')
      }
    } catch (error) {
      console.error("❌ Erreur lors de la soumission finale:", error)
      throw error
    } finally {
      pendingSync.value = false
    }
  }

  // Vérifier la connectivité
  const checkConnectivity = async () => {
    const wasOnline = isOnline.value
    isOnline.value = await questionnaireService.checkBackendConnectivity()
    
    if (!wasOnline && isOnline.value) {
      // Retour en ligne : tenter une synchronisation
      console.log("🌐 Retour en ligne, tentative de synchronisation...")
      await syncWithBackend()
    } else if (wasOnline && !isOnline.value) {
      console.log("📵 Passe en mode dégradé")
    }
    
    return isOnline.value
  }

  // Forcer la synchronisation manuelle
  const forceSync = async () => {
    console.log("🔄 Synchronisation manuelle forcée...")
    return await syncWithBackend()
  }

  return {
    currentAudit,
    isAuthenticated,
    userType,
    isOnline,
    lastSyncTime,
    syncFailed,
    pendingSync,
    startAudit,
    answerQuestion,
    filterValidAnswers,
    completeAudit,
    submitFinalAudit,
    login,
    logout,
    clearCorruptedSession,
    getAllSessions,
    clearCompletedSessions,
    switchToAudit,
    syncWithBackend,
    checkConnectivity,
    forceSync
  }
})
