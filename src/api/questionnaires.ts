import type { APIReferential, Questionnaire, QuestionnaireRequest, APIResponse, AuditListResponse, PartialAnswerSubmission, PartialSaveResponse, AnswerItem } from '@/types/questionnaire';
import { useAuthStore } from '@/stores/auth';

const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL as string) || 'http://localhost:8000';

class QuestionnaireAPI {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<APIResponse<T>> {
    console.log("API CALL", endpoint, options)
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      console.log("API RESPONSE STATUS:", response.status)
      
      if (!response.ok) {
        // Loguer plus de détails pour le debug
        const errorText = await response.text()
        console.error("API ERROR RESPONSE:", errorText)
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const data = await response.json();
      console.log("DDATA QUESTIONNAIRE :", data);
      return { data };
    } catch (error) {
      console.error('API Error:', error);
      return { 
        error: error instanceof Error ? error.message : 'Une erreur est survenue',
        message: 'Impossible de contacter le serveur'
      };
    }
  }

  async getReferentials(): Promise<APIResponse<{ referentiels: APIReferential[] }>> {
    return this.request<{ referentiels: APIReferential[] }>('/api/v1/questionnaires/referentiels/database');
  }

  async generateQuestionnaire(payload: QuestionnaireRequest): Promise<APIResponse<Questionnaire>> {
    const endpoint = '/api/v1/questionnaires/generate-questionnaire'
    console.log("API CALL generateQuestionnaire", endpoint)
    
    return this.request<Questionnaire>(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getCompletedAudits(limit: number = 50, offset: number = 0): Promise<APIResponse<AuditListResponse>> {
    const authStore = useAuthStore();
    const userId = authStore.user?.id;
    
    if (!userId) {
      throw new Error('Utilisateur non authentifié');
    }
    
    const endpoint = `/api/v1/questionnaires/audits/completed?limit=${limit}&offset=${offset}`;
    console.log("API CALL getCompletedAudits", endpoint);
    
    return this.request<AuditListResponse>(endpoint, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'X-User-Id': userId
      }
    });
  }

  async getInProgressAudits(limit: number = 50, offset: number = 0): Promise<APIResponse<AuditListResponse>> {
    const authStore = useAuthStore();
    const userId = authStore.user?.id;
    
    if (!userId) {
      throw new Error('Utilisateur non authentifié');
    }
    
    const endpoint = `/api/v1/questionnaires/audits/in-progress?limit=${limit}&offset=${offset}`;
    console.log("API CALL getInProgressAudits", endpoint);
    
    return this.request<AuditListResponse>(endpoint, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'X-User-Id': userId
      }
    });
  }

  async getQuestionnaireWithAnswers(questionnaireId: string): Promise<APIResponse<import('@/types/questionnaire').Questionnaire>> {
    const authStore = useAuthStore();
    const userId = authStore.user?.id;
    
    if (!userId) {
      throw new Error('Utilisateur non authentifié');
    }
    
    const endpoint = `/api/v1/questionnaires/questionnaire/${questionnaireId}/continue`;
    console.log("API CALL getQuestionnaireWithAnswers", endpoint);
    
    return this.request<import('@/types/questionnaire').Questionnaire>(endpoint, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'X-User-Id': userId
      }
    });
  }

  async savePartialAnswers(submission: PartialAnswerSubmission): Promise<APIResponse<PartialSaveResponse>> {
    const authStore = useAuthStore();
    const userId = authStore.user?.id;
    
    console.log("USER INFO:", { user: authStore.user, userId: userId });
    
    if (!userId) {
      throw new Error('Utilisateur non authentifié');
    }
    
    const endpoint = '/api/v1/questionnaires/save-partial-answers';
    console.log("API CALL savePartialAnswers", endpoint, submission);
    
    return this.request<PartialSaveResponse>(endpoint, {
      method: 'POST',
      body: JSON.stringify(submission),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId
      }
    });
  }

  async saveAndExit(submission: PartialAnswerSubmission): Promise<APIResponse<PartialSaveResponse>> {
    const authStore = useAuthStore();
    const userId = authStore.user?.id;
    
    if (!userId) {
      throw new Error('Utilisateur non authentifié');
    }
    
    // Ajouter le flag is_user_exiting
    const payload = {
      ...submission,
      is_user_exiting: true,
      is_final_submission: false
    };
    
    const endpoint = '/api/v1/questionnaires/save-partial-answers';
    console.log("API CALL saveAndExit", endpoint, payload);
    
    return this.request<PartialSaveResponse>(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId
      }
    });
  }

  async submitFinalAnswers(questionnaireId: string, answers: AnswerItem[]): Promise<APIResponse<PartialSaveResponse>> {
    const authStore = useAuthStore();
    const userId = authStore.user?.id;
    
    if (!userId) {
      throw new Error('Utilisateur non authentifié');
    }
    
    const submission: PartialAnswerSubmission = {
      questionnaire_id: questionnaireId,
      reponses: answers,
      is_final_submission: true
    };
    
    const endpoint = '/api/v1/questionnaires/save-partial-answers';
    console.log("API CALL submitFinalAnswers", endpoint, submission);
    
    return this.request<PartialSaveResponse>(endpoint, {
      method: 'POST',
      body: JSON.stringify(submission),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId
      }
    });
  }
}

export const questionnaireAPI = new QuestionnaireAPI();
