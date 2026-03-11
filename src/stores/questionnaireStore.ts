import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { questionnaireService } from '@/services/questionnaireService';
import type { EnhancedReferential, Questionnaire, QuestionnaireRequest } from '@/types/questionnaire';

export const useQuestionnaireStore = defineStore('questionnaire', () => {
  const referentials = ref<EnhancedReferential[]>([]);
  const currentQuestionnaire = ref<Questionnaire | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const hasReferentials = computed(() => referentials.value.length > 0);
  const hasCurrentQuestionnaire = computed(() => currentQuestionnaire.value !== null);

  const fetchReferentials = async (): Promise<void> => {
    loading.value = true;
    error.value = null;
    
    try {
      referentials.value = await questionnaireService.fetchReferentials();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Une erreur est survenue';
      console.error('Failed to fetch referentials:', err);
    } finally {
      loading.value = false;
    }
  };

  const generateQuestionnaire = async (request: QuestionnaireRequest): Promise<void> => {
    console.log("STORE GENERATE QUESTIONNAIRE", request)
    
    loading.value = true;
    error.value = null;
    
    try {
      currentQuestionnaire.value = await questionnaireService.generateQuestionnaire(request);
      console.log("STORE QUESTIONNAIRE SET:", currentQuestionnaire.value)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Une erreur est survenue';
      console.error('Failed to generate questionnaire:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const resetQuestionnaire = (): void => {
    currentQuestionnaire.value = null;
    error.value = null;
  };

  const getReferentialByName = (name: string): EnhancedReferential | undefined => {
    return referentials.value.find(ref => ref.nom === name);
  };

  const getReferentialById = (id: string): EnhancedReferential | undefined => {
    return referentials.value.find(ref => ref.id === id);
  };

  const getQuestionById = (questionId: string) => {
    return currentQuestionnaire.value?.questions.find(q => q.id === questionId);
  };

  const retryLastOperation = (): void => {
    error.value = null;
  };

  return {
    referentials,
    currentQuestionnaire,
    loading,
    error,
    hasReferentials,
    hasCurrentQuestionnaire,
    fetchReferentials,
    generateQuestionnaire,
    resetQuestionnaire,
    getReferentialByName,
    getReferentialById,
    getQuestionById,
    retryLastOperation
  };
});
