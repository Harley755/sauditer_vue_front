import type { APIReferential, Questionnaire, QuestionnaireRequest, APIResponse } from '@/types/questionnaire';

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
        throw new Error(`HTTP error! status: ${response.status}`);
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
}

export const questionnaireAPI = new QuestionnaireAPI();
