import { questionnaireAPI } from '@/api/questionnaires';
import type { APIReferential, Questionnaire, QuestionnaireRequest, EnhancedReferential, ReferentialMeta, AuditListResponse, PartialAnswerSubmission, PartialSaveResponse, AnswerItem, SyncResult } from '@/types/questionnaire';

export const referentialMeta: Record<string, ReferentialMeta> = {
  "ISO 27001": {
    icon: "🔒",
    color: "from-cyan-500 to-blue-600"
  },
  "RGPD": {
    icon: "🛡️",
    color: "from-blue-500 to-indigo-600"
  },
  "SOC 2": {
    icon: "✅",
    color: "from-purple-500 to-pink-600"
  },
  "NIST CSF": {
    icon: "🌐",
    color: "from-indigo-500 to-purple-600"
  },
  "Directive NIS 2": {
    icon: "🌐",
    color: "from-indigo-500 to-purple-600"
  },
  "PCI DSS": {
    icon: "💳",
    color: "from-pink-500 to-red-600"
  }
};

export class QuestionnaireService {
  async fetchReferentials(): Promise<EnhancedReferential[]> {
    const response = await questionnaireAPI.getReferentials();
    
    if (response.error || !response.data) {
      throw new Error(response.error || 'Impossible de récupérer les référentiels');
    }

    return response.data.referentiels.map(referential => ({
      ...referential,
      meta: referentialMeta[referential.nom] || {
        icon: "📋",
        color: "from-slate-500 to-slate-600"
      }
    }));
  }

  async generateQuestionnaire(request: QuestionnaireRequest): Promise<Questionnaire> {
    console.log("SERVICE GENERATE QUESTIONNAIRE", request)
    
    const response = await questionnaireAPI.generateQuestionnaire(request);
    
    if (response.error || !response.data) {
      console.log("SERVICE ERROR:", response.error)
      throw new Error(response.error || 'Impossible de générer le questionnaire');
    }

    console.log("QUESTIONNAIIIRES : ", response);
    
    return response.data;
  }

  getReferentialIcon(referentialName: string): string {
    return referentialMeta[referentialName]?.icon || "📋";
  }

  getReferentialColor(referentialName: string): string {
    return referentialMeta[referentialName]?.color || "from-slate-500 to-slate-600";
  }

  async getCompletedAudits(limit: number = 50, offset: number = 0): Promise<AuditListResponse> {
    const response = await questionnaireAPI.getCompletedAudits(limit, offset);
    
    if (response.error || !response.data) {
      throw new Error(response.error || 'Impossible de récupérer les audits complétés');
    }

    return response.data;
  }

  async getInProgressAudits(limit: number = 50, offset: number = 0): Promise<AuditListResponse> {
    const response = await questionnaireAPI.getInProgressAudits(limit, offset);
    
    if (response.error || !response.data) {
      throw new Error(response.error || 'Impossible de récupérer les audits en cours');
    }

    return response.data;
  }

  async getQuestionnaireWithAnswers(questionnaireId: string): Promise<import('@/types/questionnaire').Questionnaire> {
    const response = await questionnaireAPI.getQuestionnaireWithAnswers(questionnaireId);
    
    if (response.error || !response.data) {
      throw new Error(response.error || 'Impossible de récupérer le questionnaire avec les réponses');
    }

    return response.data;
  }

  // Méthodes de sauvegarde progressive
  async savePartialAnswers(questionnaireId: string, answers: AnswerItem[]): Promise<PartialSaveResponse> {
    const submission: PartialAnswerSubmission = {
      questionnaire_id: questionnaireId,
      reponses: answers,
      is_final_submission: false
    };
    
    const response = await questionnaireAPI.savePartialAnswers(submission);
    
    if (response.error || !response.data) {
      throw new Error(response.error || 'Impossible de sauvegarder les réponses partielles');
    }

    return response.data;
  }

  async submitFinalAnswers(questionnaireId: string, answers: AnswerItem[]): Promise<PartialSaveResponse> {
    const response = await questionnaireAPI.submitFinalAnswers(questionnaireId, answers);
    
    if (response.error || !response.data) {
      throw new Error(response.error || 'Impossible de soumettre les réponses finales');
    }

    return response.data;
  }

  // Synchronisation progressive avec mode dégradé
  async syncAnswersWithBackend(questionnaireId: string, answers: AnswerItem[]): Promise<SyncResult> {
    console.log("🔄 Synchronisation des réponses avec le backend...", { questionnaireId, answersCount: answers.length });
    
    try {
      const result = await this.savePartialAnswers(questionnaireId, answers);
      
      console.log("✅ Synchronisation réussie:", result);
      
      return {
        success: true,
        synced_answers: result.saved_responses_count,
        failed_answers: 0
      };
    } catch (error) {
      console.error("❌ Échec de la synchronisation:", error);
      
      return {
        success: false,
        synced_answers: 0,
        failed_answers: answers.length,
        error_message: error instanceof Error ? error.message : 'Erreur de synchronisation'
      };
    }
  }

  // Synchronisation avec retry et mode dégradé
  async syncWithRetry(questionnaireId: string, answers: AnswerItem[], maxRetries: number = 3): Promise<SyncResult> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      console.log(`🔄 Tentative de synchronisation ${attempt}/${maxRetries}`);
      
      try {
        const result = await this.syncAnswersWithBackend(questionnaireId, answers);
        
        if (result.success) {
          console.log(`✅ Synchronisation réussie à la tentative ${attempt}`);
          return result;
        }
        
        lastError = new Error(result.error_message || 'Échec de synchronisation');
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Erreur inconnue');
        console.error(`❌ Tentative ${attempt} échouée:`, lastError.message);
      }
      
      // Attendre avant de réessayer (exponential backoff)
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        console.log(`⏳ Attente de ${delay}ms avant la prochaine tentative...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    console.error(`❌ Échec de la synchronisation après ${maxRetries} tentatives`);
    return {
      success: false,
      synced_answers: 0,
      failed_answers: answers.length,
      error_message: lastError?.message || 'Échec de synchronisation'
    };
  }

  // Vérifier la connectivité avec le backend
  async checkBackendConnectivity(): Promise<boolean> {
    try {
      const response = await fetch(`${(import.meta.env?.VITE_API_BASE_URL as string) || 'http://localhost:8000'}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      return response.ok;
    } catch (error) {
      console.error("❌ Backend inaccessible:", error);
      return false;
    }
  }
}

export const questionnaireService = new QuestionnaireService();
